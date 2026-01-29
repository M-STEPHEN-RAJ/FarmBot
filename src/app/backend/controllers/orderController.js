import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export async function placeOrder({
  userId,
  selectedItemIds,
  shippingAddress,
  paymentMethod = "COD",
}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0)
      throw { status: 400, message: "Cart is empty!" };

    if (!Array.isArray(selectedItemIds)) {
      throw { status: 400, message: "selectedItemIds missing" };
    }

    const selectedItems = cart.items.filter((item) =>
      selectedItemIds.includes(item._id.toString()),
    );

    if (!selectedItems.length)
      throw { status: 400, message: "No items selected!" };

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);

    const items = [];

    for (const cartItem of selectedItems) {
      const product = await Product.findOneAndUpdate(
        { _id: cartItem.productId, stock: { $gte: cartItem.quantity } },
        { $inc: { stock: -cartItem.quantity } },
        { new: true, session },
      );

      if (!product) {
        throw {
          status: 400,
          message: `Not enough stock for ${cartItem.name}`,
        };
      }

      items.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        image: product.image,
        category: product.category,
        type: product.type,
        price: product.price,
        unit: product.unit,
        quantity: cartItem.quantity,
        delivery: {
          estimatedDate,
        },
      });
    }

    const totalItems = selectedItems.reduce((acc, i) => acc + i.quantity, 0);
    let totalPrice = selectedItems.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0,
    );

    const deliveryFee = totalPrice > 0 && totalPrice < 499 ? 40 : 0;
    totalPrice += deliveryFee;

    const order = await Order.create(
      [
        {
          userId,
          items,
          totalItems,
          totalPrice,
          deliveryFee,
          shippingAddress,
          payment: {
            method: paymentMethod,
            status: paymentMethod === "COD" ? "pending" : "paid",
          },
          orderStatus: "placed",
        },
      ],
      { session },
    );

    cart.items = cart.items.filter(
      (item) => !selectedItemIds.includes(item._id.toString()),
    );
    cart.totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0,
    );
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
