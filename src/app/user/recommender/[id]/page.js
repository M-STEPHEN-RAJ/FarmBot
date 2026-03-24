"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";
import RecommenderSidebar from "@/app/components/user/recommender/RecommenderSidebar";

const Recommender = () => {
  const params = useParams();
  const selectedId = params?.id;

  const pdfRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedId) return;

      setLoading(true);
      try {
        const res = await axios.get(`${API}/recommender/${selectedId}`, {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load details!");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedId]);

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    const element = pdfRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollY: -window.scrollY,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,

      onclone: (doc) => {
        doc.querySelectorAll("*").forEach((el) => {
          const style = window.getComputedStyle(el);

          if (style.color.includes("lab")) el.style.color = "#000";
          if (style.backgroundColor.includes("lab"))
            el.style.backgroundColor = "#fff";
          if (style.borderColor.includes("lab")) el.style.borderColor = "#ccc";
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`crop-${data?.crop || "result"}.pdf`);
  };

  const handleSpeak = () => {
    if (!data?.explanation) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const text = new DOMParser().parseFromString(data.explanation, "text/html")
      .body.textContent;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.onend = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);

    setSpeaking(true);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      <RecommenderSidebar selectedId={selectedId} />

      <div
        onClick={downloadPDF}
        className="absolute bottom-10 right-10 p-2 bg-[#166831] rounded-full cursor-pointer"
      >
        <img className="w-7" src="/images/user/scanner/download.png" />
      </div>

      <div
        onClick={handleSpeak}
        className={`absolute bottom-25 right-10 p-3 rounded-full cursor-pointer ${
          speaking ? "bg-[#166831]" : "bg-white border border-[#166831]"
        }`}
      >
        <img
          className="w-6"
          src={
            speaking
              ? "/images/user/scanner/speaker-active.png"
              : "/images/user/scanner/speaker.png"
          }
        />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto p-4 pb-10">
        {loading ? (
          <p className="text-center mt-10 text-gray-400">Loading...</p>
        ) : data ? (
          <div ref={pdfRef} className="w-full max-w-[850px] mx-auto space-y-6">
            <div className="space-y-5">
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-[#166831]">
                  {data.crop}
                </h2>
              </div>

              <div className="flex flex-col space-y-5">
                <div className="flex">
                  <div className="flex-1">
                    <b>Temperature:</b> {data.temperature}°C
                  </div>
                  <div className="flex-1">
                    <b>Humidity:</b> {data.humidity}%
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <b>pH:</b> {data.ph}
                  </div>
                  <div className="flex-1">
                    <b>Rainfall:</b> {data.rainfall} mm
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Explanation:</h3>
              <div
                className="mt-2 text-gray-800"
                dangerouslySetInnerHTML={{ __html: data.explanation }}
              />
            </div>
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-400">
            Select a recommendation
          </p>
        )}
      </div>
    </div>
  );
};

export default Recommender;
