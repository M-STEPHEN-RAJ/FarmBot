"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const SellerNotification = () => {

  const notifications = [
    "Email",
    "SMS",
    "App Push",
    "Promotions",
  ];

  const [toggles, setToggles] = useState(
    notifications.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {})
  );

  const toggleRefs = useRef({});

  const handleToggle = (type) => {
    setToggles((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    notifications.forEach((type) => {
      const handle = toggleRefs.current[type];
      if (handle) {
        gsap.to(handle, {
          x: toggles[type] ? 16 : 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  }, [toggles]);

  return (
    <div className="w-full max-w-[850px] mx-auto space-y-7">
        <h2 className="font-medium">Notification</h2>

      <div className="space-y-5 px-3">
        {notifications.map((type) => (
          <div
            key={type}
            className="flex justify-between items-center"
          >
            <p className="text-gray-700 font-medium">{type}</p>

            <div
              onClick={() => handleToggle(type)}
              className={`w-10 h-6 rounded-full p-1 cursor-pointer flex items-center ${
                toggles[type] ? "bg-[#EB3D3F]" : "bg-gray-300"
              } relative`}
            >
              <div
                ref={(el) => (toggleRefs.current[type] = el)}
                className="w-4 h-4 bg-white rounded-full shadow-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerNotification;
