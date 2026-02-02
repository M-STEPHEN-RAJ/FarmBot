"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { toast } from "react-hot-toast";

const Order = () => {
  const tabRefs = useRef([]);
  const indicatorRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("confirmed");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const tabs = [
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "out_for_delivery", label: "Out For Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  const emptyStateContent = {
    confirmed: {
      title: "No confirmed orders",
      description: "No orders have been confirmed yet.",
    },
    processing: {
      title: "No processing orders",
      description: "No orders are being processed.",
    },
    shipped: {
      title: "No shipped orders",
      description: "No orders have been shipped yet.",
    },
    out_for_delivery: {
      title: "No orders out for delivery",
      description: "No orders are currently out for delivery.",
    },
    delivered: {
      title: "No delivered orders",
      description: "You haven’t delivered any orders yet.",
    },
    cancelled: {
      title: "No cancelled orders",
      description: "You haven’t cancelled any orders.",
    },
    returned: {
      title: "No returned orders",
      description: "No orders have been returned.",
    },
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/seller/order", {
        params: {
          search,
          status: active,
        },
        withCredentials: true,
      });

      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to fetch seller orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [active, search]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === active);
    const activeTab = tabRefs.current[activeIndex];

    if (activeTab && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  }, [active]);

  return (
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4">
      <div className="w-full mt-3">
        <div className="space-y-8">
          <h2 className="text-lg font-medium">Your Orders</h2>

          {/* Tabs */}
          <div className="relative flex border-b border-b-gray-300">
            <span
              ref={indicatorRef}
              className="absolute bottom-0 h-0.5 bg-[#EB3D3F]"
              style={{ width: 0 }}
            />

            {tabs.map((tab, index) => (
              <p
                key={tab.value}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => setActive(tab.value)}
                className={`cursor-pointer pb-2 px-7 transition-colors duration-200 ${
                  active === tab.value
                    ? "text-[#EB3D3F] font-semibold"
                    : "text-gray-500 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </p>
            ))}
          </div>

          {/* Search */}
          <div className="w-[380px] flex justify-between items-center border border-gray-300 rounded-full pl-3 pr-2 py-1.5">
            <input
              type="text"
              className="w-full outline-none"
              placeholder="search for orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src="/images/user/store/search.png" alt="" className="w-5" />
          </div>

          {/* Loading / Empty / Orders */}
          {loading ? (
            <div className="h-[50vh] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#EB3D3F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <img
                className="w-35"
                src="/images/user/order/no-orders.png"
                alt=""
              />
              <div className="text-center">
                <p className="text-lg font-medium">
                  {emptyStateContent[active].title}
                </p>
                <p className="text-sm mt-2">
                  {emptyStateContent[active].description}
                </p>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-5 px-5 pt-5 pb-3 border border-gray-300 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-15">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm">
                        {new Date(order.createdAt).toDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="font-medium">Total</p>
                      <p className="font-medium">₹ {order.totalPrice}.00</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-2 text-end">
                      <p>Order #{order._id.slice(-14)}</p>
                      <p className="text-[#EB3D3F] font-medium text-sm cursor-pointer hover:underline">
                        View order details
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={item._id}
                      className={`${
                        order.items.length > 1 &&
                        index !== order.items.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      <p className="font-medium text-lg">
                        Arriving by{" "}
                        {new Date(item?.delivery?.estimatedDate).toDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                          <img
                            className="w-40 h-40 object-fill"
                            src={item.image}
                            alt=""
                          />
                          <div className="space-y-3">
                            <div>
                              <h2 className="text-lg font-medium">
                                {item.name}
                              </h2>
                              <p className="text-sm text-gray-500 font-medium">
                                {item.category} - {item.type}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                              <p className="font-medium">Sold by</p>
                              <p>{item.sellerId?.name || "Seller"}</p>

                              <p className="font-medium">Payment</p>
                              <p>{order.payment.method}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-5">
                          <button className="py-1 px-8 text-white bg-[#EB3D3F] rounded-md cursor-pointer">
                            Track Package
                          </button>
                          <button className="py-1 px-8 text-[#EB3D3F] border border-[#EB3D3F] rounded-md cursor-pointer">
                            View or Edit Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
