"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState([]);

  const refs = useRef([]);

  const toggleFAQ = (index) => {
    if (openIndex.includes(index)) {
      // CLOSE
      gsap.to(refs.current[index], {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.inOut",
      });

      setOpenIndex(openIndex.filter((i) => i !== index));
    } else {
      // OPEN
      gsap.fromTo(
        refs.current[index],
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        }
      );

      setOpenIndex([...openIndex, index]);
    }
  };

  return (
    <>
      <div className="relative flex flex-col justify-center items-center w-full h-full bg-white pt-5 pb-20">
        <div className="absolute -left-8 -top-5">
          <img src="/images/landing/faq1-bg.png" alt="" className="w-80" />
        </div>

        <div className="absolute -right-5 top-80">
          <img src="/images/landing/faq2-bg.png" alt="" className="w-70" />
        </div>

        <div className="relative flex flex-col justify-center items-center gap-10 max-w-7xl z-10 py-5">
          <div className="text-center space-y-3">
            <h2 className="font-bold text-3xl">
              Frequently Asked
              <br /> Questions
            </h2>
            <p className="text-sm font-medium text-gray-500">
              If you're new to FarmBot or looking to improve the checkout
              <br /> experience on your site, this guide will help you learn
              more about our
              <br /> platform and it's features.
            </p>
          </div>

          <div className="space-y-3 w-[900px]">
            {/* 1 */}
            <div onClick={() => toggleFAQ(1)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">What is FarmBot?</h2>
                <div className="p-2 hover:bg-gray-200 rounded-full">
                  <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex.includes(1) ? "rotate-180" : ""}`} />
                </div>
              </div>
              <div ref={(el) => (refs.current[1] = el)} style={{ height: 0, overflow: "hidden" }}>
                <p className="text-sm">
                  FarmBot is an AI-powered assistant that helps farmers monitor crops, detect diseases, and get smart recommendations.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div onClick={() => toggleFAQ(2)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">How does disease detection work?</h2>
                <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                  <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex.includes(2) ? "rotate-180" : ""}`} />
                </div>
              </div>
              <div ref={(el) => (refs.current[2] = el)} style={{ height: 0, overflow: "hidden" }}>
                <p className="text-sm">
                  It uses AI models to analyze plant images and identify diseases instantly with high accuracy.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div onClick={() => toggleFAQ(3)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Can FarmBot suggest fertilizers?</h2>
                <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                  <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex.includes(3) ? "rotate-180" : ""}`} />
                </div>
              </div>
              <div ref={(el) => (refs.current[3] = el)} style={{ height: 0, overflow: "hidden" }}>
                <p className="text-sm">
                  Yes, it recommends fertilizers based on crop type, soil condition, and climate data.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div onClick={() => toggleFAQ(4)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Is FarmBot beginner friendly?</h2>
                <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                  <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex.includes(4) ? "rotate-180" : ""}`} />
                </div>
              </div>
              <div ref={(el) => (refs.current[4] = el)} style={{ height: 0, overflow: "hidden" }}>
                <p className="text-sm">
                  Yes, the platform is simple and designed for both beginners and experienced farmers.
                </p>
              </div>
            </div>

            {/* 5 */}
            <div onClick={() => toggleFAQ(5)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Does it require IoT devices?</h2>
                <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                  <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex.includes(5) ? "rotate-180" : ""}`} />
                </div>
              </div>
              <div ref={(el) => (refs.current[5] = el)} style={{ height: 0, overflow: "hidden" }}>
                <p className="text-sm">
                  No, your current FarmBot version works without IoT and uses AI models instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;