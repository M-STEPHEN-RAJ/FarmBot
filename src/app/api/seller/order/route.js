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
        { status: 401 },
      );
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    const sellerId = decoded.id;

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const orderStatus = url.searchParams.get("orderStatus");

    const match = { "items.sellerId": sellerId };

    if (orderStatus) {
      match.orderStatus = orderStatus;
    }

    if (search) match["items.name"] = { $regex: search, $options: "i" };

    const orders = await Order.find(match)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.sellerId.toString() === sellerId &&
            (!status || item.status === status),
        );

        if (sellerItems.length === 0) return null;

        const splitTotalPrice = sellerItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        return {
          _id: order._id,
          user: order.userId,
          shippingAddress: order.shippingAddress,
          payment: order.payment,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          totalPrice: splitTotalPrice,
          totalItems: sellerItems.length,
          items: sellerItems,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ orders: sellerOrders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch seller orders" },
      { status: 500 },
    );
  }
}
