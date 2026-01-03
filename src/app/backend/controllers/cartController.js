import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add to cart
export async function addToCart({ userId, productId, quantity }) {
  if (!quantity || quantity < 1) quantity = 1;

  const product = await Product.findById(productId);
  if (!product) throw { status: 404, message: "Product not found!" };
  if (product.stock <= 0) throw { status: 400, message: "Product is out of stock!" };
  if (quantity > product.stock)
    throw { status: 400, message: `Only ${product.stock} items available!` };

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingIndex !== -1) {
    cart.items[existingIndex].quantity += quantity;

    if (cart.items[existingIndex].quantity > product.stock) {
      cart.items[existingIndex].quantity = product.stock;
    }
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      image: product.image,
      price: product.price,
      unit: product.unit,
      quantity,
      stock: product.stock,
      isOutOfStock: product.stock <= 0,
    });
  }

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  await cart.save();
  return cart;
}


// Fetch cart for a user
export async function getCart(userId) {

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      status: "active",
      coupon: {},
      shippingAddress: null,
    };
  }

  return cart;
}