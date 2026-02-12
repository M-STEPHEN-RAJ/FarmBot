"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(null);
  const [weather, setWeather] = useState(null);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(new Date().getFullYear());
  const [openYear, setOpenYear] = useState(false);

  const cropStartDate = "2026-02-12";
  const harvestDays = 90;

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=8.7139&lon=77.7567&appid=c90c42c92b87b8c6431e6b6568e23bd0`,
      );
      setWeather(res.data);
    } catch (error) {
      console.error("Weather API error:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const heatmapDays = useMemo(() => {
    const blocks = [];

    const yearStart = new Date(year, 0, 1); // Jan 1
    const yearEnd = new Date(year, 11, 31); // Dec 31

    let current = new Date(yearStart);
    let prevMonth = current.getMonth();

    // Align Jan 1 to Sunday
    const startWeekday = current.getDay();
    for (let i = 0; i < startWeekday; i++) {
      blocks.push({ empty: true });
    }

    while (current <= yearEnd) {
      const month = current.getMonth();

      // 🔹 Month gap (one full column)
      if (month !== prevMonth) {
        for (let i = 0; i < 7; i++) {
          blocks.push({ monthGap: true });
        }
        prevMonth = month;
      }

      // Crop progress calculation
      const cropStart = new Date(cropStartDate);
      const diff =
        Math.floor((current - cropStart) / (1000 * 60 * 60 * 24)) + 1;

      let color = "bg-gray-100";

      if (diff > 0 && diff <= harvestDays) {
        const p = diff / harvestDays;
        if (p <= 0.25) color = "bg-green-200 cursor-pointer transition-all duration-200 hover:scale-115";
        else if (p <= 0.5) color = "bg-green-300 cursor-pointer transition-all duration-200 hover:scale-115";
        else if (p <= 0.75) color = "bg-green-500 cursor-pointer transition-all duration-200 hover:scale-115";
        else color = "bg-green-700 cursor-pointer transition-all duration-200 hover:scale-115";
      }

      blocks.push({
        date: new Date(current),
        color,
      });

      current.setDate(current.getDate() + 1);
    }

    return blocks;
  }, [year, cropStartDate, harvestDays]);

  const yearOptions = useMemo(
    () => [currentYear - 1, currentYear, currentYear + 1],
    [currentYear],
  );

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1150px] flex flex-col gap-8 pr-4 py-4 mt-3">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-1 text-gray-700 font-medium">
          {!currentTime ? (
            <>
              <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-50 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            </>
          ) : (
            <>
              <p>{currentTime.toLocaleDateString("en-IN", dateOptions)},</p>
              <p>{currentTime.toLocaleTimeString("en-IN")}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            {!weather ? (
              <div className="w-35 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <>
                <img
                  className="w-8"
                  src="/images/user/dashboard/clouds.png"
                  alt=""
                />
                <p>{weather.weather[0].description}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 py-1">
            <img
              className="w-6"
              src="/images/user/dashboard/humidity.png"
              alt=""
            />
            {!weather ? (
              <div className="w-8 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <p>{weather.main.humidity}%</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <img className="w-6" src="/images/user/dashboard/wind.png" alt="" />
            {!weather ? (
              <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <p>{weather.wind.speed} m/s</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <img
              className="w-6"
              src="/images/user/dashboard/temperature.png"
              alt=""
            />
            {!weather ? (
              <div className="w-16.5 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <p>{weather.main.temp} °C</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <img
              className="w-6"
              src="/images/user/dashboard/location.png"
              alt=""
            />
            {!weather ? (
              <div className="w-27 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <p>
                {weather.name}, {weather.sys.country}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        <div className="h-[120px] flex flex-col gap-3 px-4 py-2 border border-gray-300 rounded-md">
          <h2>Crop Progress</h2>
          <div className="space-y-1">
            <p className="text-3xl font-bold">87%</p>
            <p className="text-sm">Day 61 of 90</p>
          </div>
        </div>
        <div className="h-[120px] flex flex-col gap-3 px-4 py-2 border border-gray-300 rounded-md">
          <h2>Days Remaining</h2>
          <div className="space-y-1">
            <p className="text-3xl font-bold">29 <span className="text-lg font-bold">Days</span></p>
            <p className="text-sm">Harvest: May 13</p>
          </div>
        </div>
        <div className="h-[120px] flex flex-col gap-3 px-4 py-2 border border-gray-300 rounded-md">
          <h2>Crop Health</h2>
          <div className="space-y-1">
            <p className="text-3xl font-bold truncate">Healthy</p>
            <p className="text-sm">Confidence: 94%</p>
          </div>
        </div>
        <div className="h-[120px] flex flex-col gap-3 px-4 py-2 border border-gray-300 rounded-md">
          <h2>Total Predictions</h2>
          <div className="space-y-1">
            <p className="text-3xl font-bold">03</p>
            <p className="text-sm">Across all AI models</p>
          </div>
        </div>
      </div>
      <div className="h-[200px] px-4 py-2 space-y-4 border border-gray-300 rounded-md">
        <div className="flex justify-between">
          <p>Plant Name</p>
          <div className="flex items-center gap-5">
            <p>Total Days: {harvestDays}</p>
            <div className="relative">
              {/* Selected year display */}
              <div
                onClick={() => setOpenYear((v) => !v)}
                className="flex justify-between items-center gap-4 px-2 py-0.5 border border-gray-300 rounded-md cursor-pointer
               hover:bg-gray-50 select-none"
              >
                <p className="">{year}</p>

                <svg
                  className={`w-4 h-4 transition-transform ${
                    openYear ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown */}
              {openYear && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-md">
                  {yearOptions.map((y) => (
                    <div
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setOpenYear(false);
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm rounded-md
            ${y === year ? "bg-gray-100 hover:bg-gray-200 font-semibold" : "hover:bg-gray-50"}`}
                    >
                      {y}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {heatmapDays.map((d, i) => (
              <div
                key={i}
                title={d.date ? d.date.toDateString() : ""}
                className={`w-3 h-3 rounded-sm ${
                  d.monthGap || d.empty ? "bg-transparent" : d.color
                }`}
              />
            ))}
          </div>

          {/* MONTH LABELS (BOTTOM) */}
          <div className="flex text-xs text-gray-400 pl-1">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m, i) => (
              <div key={i} className="px-6.5 mr-4.5">
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
