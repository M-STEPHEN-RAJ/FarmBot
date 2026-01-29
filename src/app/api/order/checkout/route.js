import Stripe from "stripe";
import { NextResponse } from "next/server";
import { placeOrder } from "@/app/backend/controllers/orderController.js";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/backend/config/db.js";

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
      return NextResponse.json({ message: "Not authenticated!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { selectedItemIds, shippingAddress, paymentMethod } = await req.json();

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
            product_data: { name: "FarmBot" },
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
    return NextResponse.json({ error: err.message || "Something went wrong!" }, { status: 500 });
  }
}