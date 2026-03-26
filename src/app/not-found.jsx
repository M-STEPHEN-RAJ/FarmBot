"use client";

import Lottie from "lottie-react";
import animationData from "../../public/lottie/error-404-animation.json";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      
      <div className="w-[300px]">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <h1 className="text-2xl font-semibold mt-4">Page Not Found</h1>
      <p className="text-gray-500 mt-2">
        The page you are looking for doesn't exist.
      </p>

      <button
        onClick={() => router.push("/user/login")}
        className="mt-5 px-5 py-2 bg-[#166831] text-white rounded-md hover:bg-[#166831]/90 cursor-pointer"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;