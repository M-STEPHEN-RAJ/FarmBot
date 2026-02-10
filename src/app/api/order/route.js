import { NextResponse } from "next/server";
import Stripe from "stripe";
import { placeOrder } from "@/app/backend/controllers/orderController.js";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/backend/config/db.js";
import Order from "@/app/backend/models/Order.js";
import Seller from "@/app/backend/models/Seller.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated!" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { selectedItemIds, shippingAddress, paymentMethod } =
      await req.json();

    const order = await placeOrder({
      userId,
      selectedItemIds,
      shippingAddress,
      paymentMethod: "CARD",
    });

    const amount = order.totalPrice;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Farm Smart Order" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/user/payment-success",
      cancel_url: "http://localhost:3000/user/cart",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong!" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const tab = url.searchParams.get("status") || "Orders";
    const itemStatus = url.searchParams.get("itemStatus");

    const query = { userId };

    if (tab === "Buy Again") {
      query.items = {
        $elemMatch: { status: "delivered" },
      };
    } else if (tab === "Cancelled Orders") {
      query.items = {
        $elemMatch: { status: "cancelled" },
      };
    } else {
      query.items = {
        $elemMatch: {
          status: { $nin: ["delivered", "cancelled"] },
        },
      };
    }

    if (itemStatus) {
      query.items = {
        $elemMatch: {
          ...(query.items?.$elemMatch || {}),
          status: itemStatus,
        },
      };
    }

    if (search) {
      query["items.name"] = { $regex: search, $options: "i" };
    }

    const orders = await Order.find(query)
      .populate("items.sellerId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
