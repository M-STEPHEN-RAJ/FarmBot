"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { gsap } from "gsap";

const SchemeDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEligibility, setShowEligibility] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);

  const processTabs =
    scheme?.applicationProcess?.mode === "Both"
      ? ["Online", "Offline"]
      : [scheme?.applicationProcess?.mode];

  const [activeProcess, setActiveProcess] = useState(null);

  const tabRefs = useRef([]);
  const indicatorRef = useRef(null);

  const fetchScheme = async () => {
    try {
      const res = await fetch(`/api/scheme/${id}`);
      const data = await res.json();
      setScheme(data.scheme);
    } catch (err) {
      console.error("Error fetching scheme:", err);
    }
    setLoading(false);
  };

  const checkEligibility = () => {
    if (!scheme?.eligibilityQuestions) return null;

    for (let q of scheme.eligibilityQuestions) {
      if (answers[q.field] !== q.expectedValue) {
        return false;
      }
    }

    return true;
  };

  const handleAnswer = (value) => {
    const q = scheme.eligibilityQuestions[currentQuestion];

    const newAnswers = { ...answers, [q.field]: value };
    setAnswers(newAnswers);

    if (value !== q.expectedValue) {
      setResult(false);
      return;
    }

    if (currentQuestion === scheme.eligibilityQuestions.length - 1) {
      setResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  useEffect(() => {
    if (id) fetchScheme();
  }, [id]);

  useEffect(() => {
    if (scheme?.applicationProcess?.mode) {
      if (scheme.applicationProcess.mode === "Both") {
        setActiveProcess("Online");
      } else {
        setActiveProcess(scheme.applicationProcess.mode);
      }
    }
  }, [scheme]);

  useEffect(() => {
    const index = processTabs.indexOf(activeProcess);
    const tab = tabRefs.current[index];

    if (tab && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: tab.offsetLeft,
        width: tab.offsetWidth,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  }, [activeProcess]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!scheme) {
    return <div className="p-4">Scheme not found</div>;
  }

  return (
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4 space-y-5">
      <div className="w-full flex items-start mt-3">
        <div
          onClick={() => router.push("/user/scheme")}
          className="rounded-full p-2 hover:bg-gray-200 cursor-pointer"
        >
          <img className="w-5" src="/images/user/store/back.png" alt="" />
        </div>
      </div>

      <div className="flex gap-6">
        <img
          src={scheme.imageUrl}
          className="w-28 h-28 object-cover rounded-md"
        />

        <div>
          <h1 className="text-xl font-semibold">{scheme.title}</h1>
          <p className="text-sm text-gray-600 mt-2">
            {scheme.shortDescription}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {scheme.views} views •{" "}
            {new Date(scheme.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{scheme.description}</p>
      </div>

      {/* Eligibility */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Check Eligibility</h2>
        <button
          onClick={() => setShowEligibility(true)}
          className="bg-[#166831] text-white px-5 py-1.5 rounded-md hover:opacity-90 cursor-pointer"
        >
          Check Now
        </button>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Benefits</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-600">
          {scheme.benefits.map((benefit, i) => (
            <li key={i}>{benefit}</li>
          ))}
        </ul>
      </div>

      {/* Documents */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Documents Required</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-600">
          {scheme.documentsRequired.map((doc, i) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
      </div>

      {/* Application Process */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Application Process</h2>

        {/* Tabs */}
        <div className="relative flex border-b border-gray-300 w-fit">
          <span
            ref={indicatorRef}
            className="absolute bottom-0 h-[2px] bg-[#166831]"
            style={{ width: 0 }}
          />

          {processTabs.map((tab, index) => (
            <p
              key={tab}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => setActiveProcess(tab)}
              className={`cursor-pointer pb-2 px-6 transition-colors ${
                activeProcess === tab
                  ? "text-[#166831] font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </p>
          ))}
        </div>

        {/* Steps */}
        {activeProcess && (
          <div className="space-y-3">
            <ul className="list-decimal ml-6 space-y-1 text-gray-600">
              {scheme.applicationProcess.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>

            {activeProcess === "Online" &&
              scheme.applicationProcess.onlineLink && (
                <a
                  href={scheme.applicationProcess.onlineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[#166831] font-medium hover:underline"
                >
                  Apply Online
                </a>
              )}
          </div>
        )}
      </div>

      {/* Eligibility Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white border-l border-l-gray-300 transform transition-transform duration-300 z-50
  ${showEligibility ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Eligibility Check</h2>

            <div
              onClick={() => setShowEligibility(false)}
              className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
            >
              <img className="w-5 h-5" src="/images/user/scheme/close.png" />
            </div>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-6 overflow-y-auto">
            {result === null ? (
              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of{" "}
                  {scheme.eligibilityQuestions.length}
                </p>

                <p className="text-lg font-medium">
                  {scheme.eligibilityQuestions[currentQuestion].question}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="px-5 py-1 border rounded-md hover:bg-[#166831] hover:text-white cursor-pointer"
                  >
                    Yes
                  </button>

                  <button
                    onClick={() => handleAnswer(false)}
                    className="px-5 py-1 border rounded-md hover:bg-red-600 hover:text-white cursor-pointer"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center mt-5">
                {result ? (
                  <div className="bg-green-100 text-green-700 p-4 rounded-md font-medium">
                    You are eligible for this scheme
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 p-4 rounded-md font-medium">
                    You are not eligible for this scheme
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
