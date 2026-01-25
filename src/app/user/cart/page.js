"use client";
import React, { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { gsap } from "gsap";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";

const Cart = () => {
  const itemRefs = useRef({});
  const hasAnimated = useRef(false);

  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.defaultShippingAddress) {
      setShippingAddress({ ...user.defaultShippingAddress });
    }
  }, [user]);

  const handleCheckout = async () => {
    if (selectedTotalPrice === 0) {
      toast.error("Select items first!");
      return;
    }

    if (!shippingAddress.name || !shippingAddress.phone) {
      toast.error("Enter a valid shipping address!");
      return;
    }

    const res = await axios.post("/api/order/checkout", {
      selectedItemIds: Array.from(selectedItems).map((id) => id.toString()),
      shippingAddress,
      paymentMethod,
    });

    if (paymentMethod === "CARD") {
      window.location.href = res.data.url;
    } else {
      toast.success("Order placed successfully!");
      fetchCart();
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/cart`, { withCredentials: true });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      toast.error("Failed to load cart!");
    } finally {
      setLoading(false);
    }
  };

  const incrementQty = async (item) => {
    try {
      const res = await axios.patch(
        `${API}/cart`,
        {
          productId: item.productId,
          action: "update",
          quantity: item.quantity + 1,
        },
        { withCredentials: true },
      );

      setCart(res.data.cart);
    } catch (err) {
      toast.error("Failed to update quantity!");
    }
  };

  const decrementQty = async (item) => {
    const el = itemRefs.current[item._id];

    if (item.quantity === 1) {
      gsap.to(el, {
        opacity: 0,
        x: -100,
        height: 0,
        padding: 0,
        margin: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: async () => {
          try {
            const res = await axios.patch(
              `${API}/cart`,
              { productId: item.productId, action: "remove" },
              { withCredentials: true },
            );
            setCart(res.data.cart);
          } catch (err) {
            toast.error("Failed to remove item");
          }
        },
      });
    } else {
      try {
        const res = await axios.patch(
          `${API}/cart`,
          {
            productId: item.productId,
            action: "update",
            quantity: item.quantity - 1,
          },
          { withCredentials: true },
        );
        setCart(res.data.cart);
      } catch (err) {
        toast.error("Failed to update cart");
      }
    }
  };

  const toggleItem = (itemId) => {
    setSelectedItems((prev) => {
      const updated = new Set(prev);
      const idStr = itemId.toString();
      updated.has(idStr) ? updated.delete(idStr) : updated.add(idStr);
      return updated;
    });
  };

  const selectedCartItems = cart?.items
    ? cart.items.filter((item) => selectedItems.has(item._id.toString()))
    : [];

  const selectedTotalItems = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const selectedTotalPrice = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!cart?.items || hasAnimated.current) return;

    const elements = cart.items
      .map((item) => itemRefs.current[item._id])
      .filter(Boolean);
    if (!elements.length) return;

    gsap.from(elements, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.05,
    });

    hasAnimated.current = true;
  }, [cart]);

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading</p>;
  }

  if (!cart || !cart.items.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4">
      <div className="w-full grid grid-cols-[2.5fr_1fr] gap-12 mt-3">
        <div className="space-y-5">
          <h2 className="text-lg font-medium">Shopping Cart</h2>

          {cart.items.map((item) => (
            <div
              key={item._id}
              ref={(el) => (itemRefs.current[item._id] = el)}
              className="w-full grid grid-cols-[0.5fr_1fr_2fr_1fr] gap-3 border-b border-gray-300 pb-3"
            >
              <div className="flex justify-center items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item._id)}
                  onChange={() => toggleItem(item._id)}
                  className="accent-[#166831] w-4 h-4 cursor-pointer p-1"
                />
              </div>
              <div className="">
                <img className="w-35" src={item.image} alt="" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="">
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.category} - {item.type}
                  </p>
                </div>
                <p
                  className={`font-medium ${
                    item.stock > 0 ? "text-[#166831]" : "text-red-600"
                  }`}
                >
                  {item.stock > 0 ? "Instock" : "Out of Stock"}
                </p>

                <div className="w-[100px] flex justify-between items-center px-4 py-1 border border-gray-300 rounded-md">
                  {item.quantity > 1 ? (
                    <div
                      onClick={() => decrementQty(item)}
                      className="text-xl cursor-pointer select-none"
                    >
                      -
                    </div>
                  ) : (
                    <img
                      className="w-4 cursor-pointer"
                      src="/images/user/cart/delete.png"
                      alt=""
                      onClick={() => decrementQty(item)}
                    />
                  )}
                  <p>{item.quantity}</p>
                  <div
                    onClick={() => incrementQty(item)}
                    className="text-xl cursor-pointer select-none"
                  >
                    +
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex gap-2">
                  <p className="text-red-600 mt-1">-10%</p>
                  <p className="text-xl font-medium flex items-start gap-1">
                    <span className="text-sm font-normal mt-[1.8px]">₹</span>
                    {item.price}.00
                    <span className="text-gray-600 text-sm mt-[5px]">
                      /{item.unit}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  M.R.P:{" "}
                  <span className="line-through">
                    ₹{Math.round(item.price / (1 - 10 / 100))}.00
                  </span>
                </p>

                <p className="text-sm mt-3">Inclusive of all taxes</p>
              </div>
            </div>
          ))}

          <div className="text-end font-medium flex justify-end items-start gap-3">
            <span className="mt-1">{`Subtotal (${cart.totalItems} items):`}</span>
            <div className="flex gap-1">
              <span className="text-sm mt-[1.8px]">₹</span>
              <span className="text-2xl">{cart.totalPrice}.00</span>
            </div>
          </div>
        </div>
        <div className="h-fit sticky top-12 space-y-3 border border-gray-300 rounded-md p-4 mt-5">
          <h2 className="font-semibold border-b border-b-gray-300">
            Payment Method
          </h2>
          <div className="flex gap-3 cursor-pointer w-fit">
            <input
              id="cod"
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="accent-[#166831] cursor-pointer"
            />
            <label
              htmlFor="cod"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Cash on Delivery
            </label>
          </div>

          <div className="flex gap-3 cursor-pointer w-fit">
            <input
              id="payOnline"
              type="radio"
              name="payment"
              value="CARD"
              checked={paymentMethod === "CARD"}
              onChange={() => setPaymentMethod("CARD")}
              className="accent-[#166831] cursor-pointer"
            />
            <label
              htmlFor="payOnline"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Pay Online
            </label>
          </div>

          <h2 className="font-semibold border-b border-b-gray-300 mt-5">
            Delivery Address
          </h2>

          {user?.defaultShippingAddress ? (
            <div>
              <p>{user.defaultShippingAddress.name}</p>
              <p className="text-sm text-gray-600 font-medium">
                {user.defaultShippingAddress.addressLine}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {user.defaultShippingAddress.city},{" "}
                {user.defaultShippingAddress.state} -{" "}
                {user.defaultShippingAddress.pincode}
              </p>
              <p className="text-sm font-medium text-gray-600">
                {user.defaultShippingAddress.phone}
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-600 mt-2">
              No default shipping address found. Please add one in your profile.
            </p>
          )}

          <h2 className="font-semibold border-b border-b-gray-300 mt-5">
            Payment Details
          </h2>

          <div className="font-medium flex justify-between items-start">
            <span className="mt-1 text-sm">
              Subtotal ({selectedTotalItems} items):
            </span>
            <div className="flex gap-1">
              <span className="text-sm mt-[1.8px]">₹</span>
              <span className="text-xl">{selectedTotalPrice}.00</span>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 text-sm">Delivery Fee</p>
            {selectedTotalPrice >= 499 ? (
              <p className="text-sm text-gray-600 font-medium">₹ 0.00</p>
            ) : (
              <p className="text-sm text-gray-600 font-medium">+ ₹ 40.00</p>
            )}
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-lg">Order Total</p>
            <p className="font-semibold text-lg">
              ₹
              {selectedTotalPrice > 0
                ? selectedTotalPrice < 499
                  ? selectedTotalPrice + 40
                  : selectedTotalPrice
                : 0}
              .00
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full text-white bg-[#166831] rounded-md py-1 px-4 cursor-pointer mt-3"
          >
            Proceed to Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
