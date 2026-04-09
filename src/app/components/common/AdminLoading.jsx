"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

const Loading = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/admin-loading-animation.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-100">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: 100, height: 100 }}
      />
    </div>
  );
};

export default Loading;
