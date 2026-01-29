"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import orderAnimation from "../../../../public/lottie/order-animation.json";

export default function Success() {

  const router = useRouter();

  const handleDone = () => {
    router.push("/user/order");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <Lottie
        className="w-64 h-64 mx-auto"
        animationData={orderAnimation}
        loop={false}
      />
      <div className="space-y-2 -mt-10">
        <h1 className="text-2xl text-center font-semibold text-green-600">
          Payment Successful!
        </h1>
        <p className="text-center text-gray-500">
          Your order has been placed successfully.
        </p>
      </div>
      <div className="flex gap-10 mt-10">
        <button className="w-32 border border-[#166831] text-[#166831] rounded-md px-4 py-1 font-medium cursor-pointer">Download</button>
        <button onClick={handleDone} className="w-32 text-white bg-[#166831] rounded-md px-4 py-1 font-medium cursor-pointer">Done</button>        
      </div>
    </div>
  );
}
