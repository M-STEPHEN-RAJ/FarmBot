"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddCropModal from "@/app/components/user/dashboard/Modal/AddCropModal";
import { API } from "@/app/utils/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [currentTime, setCurrentTime] = useState(null);
  const [weather, setWeather] = useState(null);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(new Date().getFullYear());
  const [openYear, setOpenYear] = useState(false);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [openCrop, setOpenCrop] = useState(false);
  const [todayAdvice, setTodayAdvice] = useState("");
  const [lang, setLang] = useState("en-IN");
  const [langLoading, setLangLoading] = useState(true);

  const [openAddModal, setOpenAddModal] = useState(false);

  const activeCrop = dashboard?.crops?.[selectedCropIndex];

  const cropStartDate = activeCrop?.startDate;
  const harvestDays = activeCrop?.harvestDays;

  const fetchCurrentUser = async () => {
    try {
      setLangLoading(true);

      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      if (res.data?.user?.preferredLanguage === "ta") {
        setLang("ta-IN");
      } else {
        setLang("en-IN");
      }
    } catch (err) {
      console.error("Failed to fetch user language");
    } finally {
      setLangLoading(false);
    }
  };

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

  const fetchDashboard = async () => {
    try {
      setLoadingDashboard(true);
      const res = await axios.get("/api/dashboard");

      setDashboard(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoadingDashboard(false);
    }
  };

  const updateLanguage = async (newLang) => {
    try {
      await axios.patch(
        `${API}/me`,
        {
          preferredLanguage: newLang === "ta-IN" ? "ta" : "en",
        },
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Failed to update language", err);
    }
  };

  const generateTodayAdvice = async () => {
    try {
      if (!weather || !activeCrop) {
        toast.error("Weather or crop not ready");
        return;
      }
      const res = await axios.post(
        "/api/dashboard/today",
        {
          cropIndex: selectedCropIndex,

          lang,

          date: new Date().toISOString(),

          crop: {
            name: activeCrop.name,
            startDate: activeCrop.startDate,
            harvestDays: activeCrop.harvestDays,
            daysRemaining: activeCrop.daysRemaining,
            progress: activeCrop.progress,
          },

          weather: {
            temp: weather.main.temp,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
            condition: weather.weather[0].description,
            location: `${weather.name}, ${weather.sys.country}`,
          },

          disease: activeCrop.health ?? null,
        },
        {
          withCredentials: true,
        },
      );
      setTodayAdvice(res.data.advice);

      toast.success("Today's task generated!");
      fetchDashboard();
    } catch (err) {
      toast.error("Failed to generate today task");
    }
  };

  useEffect(() => {
    fetchWeather();
    fetchDashboard();
    fetchCurrentUser();
  }, []);

  const heatmapDays = useMemo(() => {
    if (!cropStartDate || !harvestDays) return [];

    const blocks = [];

    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    let current = new Date(yearStart);
    let prevMonth = current.getMonth();

    const startWeekday = current.getDay();
    for (let i = 0; i < startWeekday; i++) {
      blocks.push({ empty: true });
    }

    while (current <= yearEnd) {
      const month = current.getMonth();

      if (month !== prevMonth) {
        for (let i = 0; i < 7; i++) {
          blocks.push({ monthGap: true });
        }
        prevMonth = month;
      }

      const cropStart = new Date(cropStartDate);
      cropStart.setHours(0, 0, 0, 0);
      const cropEnd = new Date(cropStart);
      cropEnd.setDate(cropStart.getDate() + harvestDays - 1);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);

      let color = "bg-gray-200";

      if (current >= cropStart && current <= cropEnd) {
        if (current <= today) {
          color =
            "bg-green-800 cursor-pointer transition-all duration-200 hover:scale-110";
        } else {
          color =
            "bg-green-300 cursor-pointer transition-all duration-200 hover:scale-110";
        }
      }

      blocks.push({
        date: new Date(current),
        color,
      });

      current.setDate(current.getDate() + 1);
    }

    return blocks;
  }, [year, cropStartDate, harvestDays]);

  const isTodayGenerated = useMemo(() => {
    if (!activeCrop?.todayAdvice?.generatedForDate) return false;

    const generated = new Date(activeCrop.todayAdvice.generatedForDate);
    const today = new Date();

    return (
      generated.getFullYear() === today.getFullYear() &&
      generated.getMonth() === today.getMonth() &&
      generated.getDate() === today.getDate()
    );
  }, [activeCrop]);

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
            {loadingDashboard ? (
              <div className="w-16 h-[34.5px] bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <p className="text-3xl font-bold">{activeCrop?.progress ?? 0}%</p>
            )}
            {loadingDashboard ? (
              <div className="w-40 h-4 bg-gray-200 rounded-md animate-pulse mt-2" />
            ) : (
              <p className="text-sm">
                Day {activeCrop.harvestDays - activeCrop.daysRemaining} of{" "}
                {activeCrop.harvestDays}
              </p>
            )}
          </div>
        </div>
        <div className="h-[120px] flex flex-col gap-3 px-4 py-2 border border-gray-300 rounded-md">
          <h2>Days Remaining</h2>
          <div className="space-y-1">
            {loadingDashboard ? (
              <div className="w-20 h-[34.5px] bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <p className="text-3xl font-bold">
                {activeCrop?.daysRemaining ?? 0}
                <span className="text-lg font-bold"> Days</span>
              </p>
            )}
            {loadingDashboard ? (
              <div className="w-44 h-4 bg-gray-200 rounded-md animate-pulse mt-2" />
            ) : (
              <p className="text-sm">
                Harvest: {new Date(activeCrop.harvestDate).toDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="h-[120px] flex flex-col gap-[17px] px-4 py-2 border border-gray-300 rounded-md">
          <h2>Crop Health</h2>
          <div className="space-y-1">
            {loadingDashboard ? (
              <>
                <div className="w-44 h-6 bg-gray-200 rounded-md animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse mt-3" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold truncate">
                  {activeCrop?.health?.result ?? "No Scan"}
                </p>
                <p className="text-sm">
                  Confidence:{" "}
                  {activeCrop?.health?.confidence
                    ? `${Math.round(activeCrop.health.confidence)}%`
                    : "—"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="h-[120px] flex flex-col gap-3 px-4 py-2 border border-gray-300 rounded-md">
          <h2>Total Plants</h2>
          <div className="space-y-1">
            <p className="text-3xl font-bold">
              {dashboard?.crops?.length ?? 0}
            </p>
            <p className="text-sm">Currently monitored</p>
          </div>
        </div>
      </div>
      <div className="h-[200px] px-4 py-2 space-y-4 border border-gray-300 rounded-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <p className="font-medium">Plant Name</p>

            <div className="relative">
              <div
                onClick={() => setOpenCrop((v) => !v)}
                className="flex items-center justify-between gap-4 px-3 py-0.5 border border-gray-300 rounded-md cursor-pointer
        hover:bg-gray-50 select-none min-w-[120px]"
              >
                <p className="truncate capitalize">
                  {activeCrop?.name ?? "Select Crop"}
                </p>

                <svg
                  className={`w-4 h-4 transition-transform ${
                    openCrop ? "rotate-180" : ""
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

              {openCrop && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                  {dashboard?.crops?.map((crop, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCropIndex(idx);
                        setOpenCrop(false);
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm rounded-md capitalize
              ${
                idx === selectedCropIndex
                  ? "hover:bg-gray-100 font-semibold"
                  : "hover:bg-gray-50"
              }`}
                    >
                      {crop.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              onClick={() => setOpenAddModal(true)}
              className="flex justify-center items-center h-6 w-6 text-lg font-medium bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              +
            </div>
          </div>
          <div className="flex items-center gap-5">
            {loadingDashboard ? (
              <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <p>Total Days: {harvestDays}</p>
            )}
            <div className="relative">
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

              {openYear && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
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
            {loadingDashboard
              ? Array.from({ length: 455 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm bg-gray-200 animate-pulse"
                  />
                ))
              : heatmapDays.map((d, i) => (
                  <div
                    key={i}
                    title={d.date ? d.date.toDateString() : ""}
                    className={`w-3 h-3 rounded-sm ${
                      d.monthGap || d.empty ? "bg-transparent" : d.color
                    }`}
                  />
                ))}
          </div>

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
      <div className="px-5 py-3 border border-gray-300 rounded-md space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">What to do Today?</h2>
          <div className="flex gap-3">
            {!isTodayGenerated && (
              <>
                <div
                  onClick={() => {
                    if (langLoading) return;

                    const newLang = lang === "en-IN" ? "ta-IN" : "en-IN";
                    setLang(newLang);
                    updateLanguage(newLang);
                  }}
                  className={`w-8 h-8 flex justify-center items-center rounded-full cursor-pointer 
  ${
    langLoading
      ? "bg-gray-100 animate-pulse hover:bg-gray-300"
      : "hover:bg-gray-100"
  }`}
                >
                  {!langLoading && (
                    <p className="font-semibold">
                      {lang === "en-IN" ? "en" : "த"}
                    </p>
                  )}
                </div>

                <div
                  onClick={generateTodayAdvice}
                  className="text-white bg-[#166831] px-4 py-1 rounded-md cursor-pointer"
                >
                  Ask FarmBot AI
                </div>
              </>
            )}
          </div>
        </div>
        {loadingDashboard ? (
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : activeCrop?.todayAdvice ? (
          <div className="p-2">
            <div
              className="space-y-1"
              dangerouslySetInnerHTML={{
                __html: todayAdvice || activeCrop?.todayAdvice?.content,
              }}
            />
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xl font-medium">No Tasks generated for today.</p>
            <p className="text-sm text-gray-400 mt-1">
              Click "Ask FarmBot AI" and get what to do Today
            </p>
          </div>
        )}
      </div>
      <AddCropModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};

export default Dashboard;
