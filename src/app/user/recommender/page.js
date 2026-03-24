"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";
import RecommenderSidebar from "@/app/components/user/recommender/RecommenderSidebar";
import Lottie from "lottie-react";
import recommenderAnimation from "../../../../public/lottie/recommender-animation.json";

const RecommenderHome = () => {
  const router = useRouter();

  const [form, setForm] = React.useState({
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [langLoading, setLangLoading] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCurrentUser = async () => {
    try {
      setLangLoading(true);

      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      if (res.data?.user?.preferredLanguage) {
        setLang(res.data.user.preferredLanguage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load language");
    } finally {
      setLangLoading(false);
    }
  };

  const updateLanguage = async (newLang) => {
    if (newLang === lang) return;

    try {
      await axios.patch(
        `${API}/me`,
        { preferredLanguage: newLang },
        { withCredentials: true },
      );

      setLang(newLang);
      toast.success("Language updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update language");
    }
  };

  const handlePredict = async () => {
    const { temperature, humidity, ph, rainfall } = form;

    if (!temperature || !humidity || !ph || !rainfall) {
      return toast.error("Please fill all fields!");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/recommender/predict`,
        {
          temperature: Number(temperature),
          humidity: Number(humidity),
          ph: Number(ph),
          rainfall: Number(rainfall),
        },
        { withCredentials: true },
      );

      toast.success("Prediction Success!");

      router.push(`/user/recommender/${res.data._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/recommender/ai`, {
        withCredentials: true,
      });

      const data = res.data.data;

      setForm({
        temperature: data.temperature,
        humidity: data.humidity,
        ph: data.ph,
        rainfall: data.rainfall,
      });

      toast.success("AI filled the data!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch AI data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <RecommenderSidebar />

      <div className="flex-1 relative flex items-center justify-center p-4">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white">
            <Lottie
              animationData={recommenderAnimation}
              loop
              className="w-64 h-64"
            />
          </div>
        ) : (
          <div className="w-full max-w-[700px] flex flex-col justify-center items-center gap-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium">Crop Recommendation</h2>
              {/* <p className="text-sm text-gray-600 text-center">
              Please Enter the data
            </p> */}
            </div>

            <div className="w-full space-y-5">
              <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-medium" htmlFor="temperature">
                    Temperature (°C):
                  </label>
                  <input
                    name="temperature"
                    id="temperature"
                    className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
                    type="number"
                    value={form.temperature}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-medium" htmlFor="humidity">
                    Humidity (%):
                  </label>
                  <input
                    name="humidity"
                    id="humidity"
                    className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
                    type="number"
                    value={form.humidity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-medium" htmlFor="ph">
                    pH Level:
                  </label>
                  <input
                    name="ph"
                    id="ph"
                    className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
                    type="number"
                    value={form.ph}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-medium" htmlFor="rainfall">
                    Rainfall (mm):
                  </label>
                  <input
                    name="rainfall"
                    id="rainfall"
                    className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
                    type="number"
                    value={form.rainfall}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-around gap-12">
              <button
                onClick={handleAskAI}
                className="w-42 px-4 py-1.5 font-medium border border-[#166831] text-[#166831] rounded-md cursor-pointer"
              >
                Ask FarmBot AI
              </button>
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-42 px-4 py-1.5 text-white bg-[#166831] rounded-md cursor-pointer"
              >
                Get Prediction
              </button>
            </div>

            <div className="w-full max-w-[400px] flex justify-between items-center px-5 py-1 rounded-2xl border border-gray-300">
              <h2 className="font-medium text-lg">Select Language</h2>
              <button
                disabled={langLoading}
                onClick={() => updateLanguage(lang === "en" ? "ta" : "en")}
                className={`w-10 h-10 rounded-full font-semibold transition cursor-pointer hover:bg-gray-200
      ${langLoading ? "opacity-50 cursor-not-allowed" : ""}
    `}
              >
                {lang === "en" ? "en" : "த"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommenderHome;
