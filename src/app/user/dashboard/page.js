"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(null);
  const [weather, setWeather] = useState(null);

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
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4 mt-3">
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
              <div className="w-13 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <p>{weather.main.temp}°C</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <img
              className="w-6"
              src="/images/user/dashboard/location.png"
              alt=""
            />
            {!weather ? (
              <div className="w-25.5 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <p>
                {weather.name}, {weather.sys.country}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
