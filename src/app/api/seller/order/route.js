import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/backend/config/db.js";
import Order from "@/app/backend/models/Order.js";

export async function GET(req) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") || "";
    const sellerToken = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("sellerToken="))
      ?.split("=")[1];

    if (!sellerToken) {
      return NextResponse.json(
        { message: "Seller not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    const sellerId = decoded.id;

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    // Match all orders where sellerId is present in items
    const match = { "items.sellerId": sellerId };

    if (status) match["items.status"] = status;
    if (search) match["items.name"] = { $regex: search, $options: "i" };

    // Fetch all orders with populated user info
    const orders = await Order.find(match)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    // Map seller items but include full details
    const sellerOrders = orders.map((order) => {
      const sellerItems = order.items
        .filter((item) => item.sellerId.toString() === sellerId)
        .map((item) => ({
          _id: item._id,
          productId: item.productId,
          sellerId: item.sellerId,
          name: item.name,
          image: item.image,
          category: item.category,
          type: item.type,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          status: item.status,
          returnStatus: item.returnStatus,
          delivery: item.delivery,
          cancelledAt: item.cancelledAt,
          cancelReason: item.cancelReason,
        }));

      return {
        _id: order._id,
        user: order.userId,
        shippingAddress: order.shippingAddress,
        payment: order.payment,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        totalPrice: order.totalPrice,
        totalItems: order.totalItems,
        items: sellerItems,
      };
    });

    return NextResponse.json({ orders: sellerOrders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch seller orders" },
      { status: 500 }
    );
  }
}
