"use client";
import { useEffect, useState } from "react";

export default function Success() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Sample order data for testing
    const sampleOrder = {
      totalItems: 3,
      totalPrice: 550,
      deliveryFee: 40,
      shippingAddress: {
        name: "John Doe",
        phone: "9876543210",
        addressLine: "123 Main Street",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001",
      },
      items: [
        { productId: "1", name: "Tomato", price: 50, quantity: 2, unit: "kg" },
        { productId: "2", name: "Potato", price: 100, quantity: 1, unit: "kg" },
      ],
      payment: { method: "CARD", status: "paid" },
    };

    setOrder(sampleOrder);
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2">Your order has been placed successfully.</p>

      <h2 className="mt-4 font-semibold text-lg">Order Summary</h2>
      <p>Total Items: {order.totalItems}</p>
      <p>Total Price: ₹{order.totalPrice}</p>
      {order.deliveryFee && <p>Delivery Fee: ₹{order.deliveryFee}</p>}

      <h2 className="mt-4 font-semibold text-lg">Shipping Address</h2>
      <p>{order.shippingAddress.name}</p>
      <p>{order.shippingAddress.phone}</p>
      <p>{order.shippingAddress.addressLine}</p>
      <p>
        {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
        {order.shippingAddress.pincode}
      </p>

      <h2 className="mt-4 font-semibold text-lg">Ordered Items</h2>
      <ul className="list-disc pl-5">
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.name} - ₹{item.price} x {item.quantity} ({item.unit})
          </li>
        ))}
      </ul>

      <p className="mt-4 font-medium text-gray-700">
        Payment Method: {order.payment.method} ({order.payment.status})
      </p>
    </div>
  );
}
