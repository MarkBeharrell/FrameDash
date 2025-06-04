"use client";

// import axios from "axios";
// import dayjs from "dayjs";
import _ from "lodash";
import React from "react";

// import iconMap from "@/utils/iconMap";

// const API_KEY = "46cd22e08e095f49bf8689ebaa7c4b71";
// const CITY = "Burnham-on-Crouch,GB";
import { useWeather } from "@/lib/weatherContext";

export default function WeatherTimeWidget() {
  const { weather, now } = useWeather();

  // const [weather, setWeather] = useState(null);
  // const [now, setNow] = useState(dayjs());

  // const fetchWeather = useCallback(async () => {
  //   try {
  //     const [currentRes, forecastRes] = await Promise.all([
  //       axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
  //         params: { q: CITY, appid: API_KEY, units: "metric", lang: "en" }
  //       }),
  //       axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
  //         params: { q: CITY, appid: API_KEY, units: "metric", lang: "en" }
  //       })
  //     ]);

  //     const current = currentRes.data;
  //     const forecast = forecastRes.data;

  //     const forecastToday = _(forecast.list)
  //       .filter((item) => dayjs.unix(item.dt).isSame(now, "day"))
  //       .take(4)
  //       .map((f) => ({
  //         icon: `wi ${iconMap[_.get(f, "weather[0].icon", "01d")] || "wi-na"}`,
  //         temp: _.round(_.get(f, "main.temp", 0)),
  //         time: dayjs.unix(f.dt).format("HH:mm")
  //       }))
  //       .value();

  //     const tomorrowChunk = _.find(forecast.list, (item) =>
  //       dayjs.unix(item.dt).isSame(now.add(1, "day"), "day")
  //     );

  //     const forecastTomorrow = {
  //       icon: `wi ${iconMap[_.get(tomorrowChunk, "weather[0].icon", "01d")] || "wi-na"}`,
  //       temp: _.round(_.get(tomorrowChunk, "main.temp", 10)),
  //       desc: `${_.get(tomorrowChunk, "rain.3h", 0)} mm Rain`,
  //       time: dayjs.unix(_.get(tomorrowChunk, "dt", now.unix())).format("HH:mm")
  //     };

  //     const dailyGroups = _.groupBy(forecast.list, (entry) =>
  //       dayjs.unix(entry.dt).format("YYYY-MM-DD")
  //     );

  //     const forecast5Day = _(dailyGroups)
  //       .entries()
  //       .sortBy(([date]) => date)
  //       .take(5)
  //       .map(([date, entries]) => ({
  //         day: dayjs(date).format("ddd"),
  //         temp: _.round(_.meanBy(entries, "main.temp")),
  //         icon: `wi ${iconMap[_.get(_.first(entries), "weather[0].icon", "01d")] || "wi-na"}`
  //       }))
  //       .value();

  //     setWeather({
  //       sunrise: dayjs.unix(_.get(current, "sys.sunrise")).format("HH:mm"),
  //       sunset: dayjs.unix(_.get(current, "sys.sunset")).format("HH:mm"),
  //       city: _.get(current, "name"),
  //       temp: _.round(_.get(current, "main.temp")),
  //       description: _.get(current, "weather[0].description", ""),
  //       iconCode: _.get(current, "weather[0].icon", "01d"),
  //       wind: _.get(current, "wind.speed", 0),
  //       rain: _.get(current, "rain.1h", 0),
  //       pressure: _.get(current, "main.pressure", 0),
  //       humidity: _.get(current, "main.humidity", 0),
  //       aqi: "Good",
  //       forecastToday,
  //       forecastTomorrow,
  //       forecast5Day,
  //       sunriseRaw: current.sys.sunrise,
  //       sunsetRaw: current.sys.sunset
  //     });
  //   } catch (err) {
  //     console.error("Weather fetch failed:", err);
  //   }
  // }, [now]);

  // useEffect(() => {
  //   fetchWeather();
  //   const interval = setInterval(fetchWeather, 30 * 60 * 1000);
  //   const timeUpdater = setInterval(() => setNow(dayjs()), 1000);
  //   return () => {
  //     clearInterval(interval);
  //     clearInterval(timeUpdater);
  //   };
  // }, [fetchWeather]);

  if (!weather)
    return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <>
      {/* Top Section: Date Icon Temp */}
      <div className="mb-4 flex items-center justify-between space-x-8">
        <div className="flex flex-col text-right">
          <div className="text-2xl text-gray-500">
            {now.format("dddd")}
            <br />
            {now.format("D MMMM YYYY")}
          </div>
          <div className="text-4xl font-semibold">{now.format("HH:mm")}</div>
        </div>

        {/* Center: Icon + Description */}
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex h-[180px] w-[180px] items-center justify-center">
            <i className="wi wi-day-sunny text-9xl"></i>
          </div>
          <div className="w-full text-center text-lg capitalize text-gray-500">
            {weather.description}
          </div>
        </div>

        {/* Right: Temperature */}
        <div className="flex flex-row text-left font-normal">
          <span className="text-7xl">{weather.temp}</span>
          <span className="text-3xl text-gray-400">°C</span>
        </div>
      </div>

      {/* Conditions Row */}
      <div className="mb-4 flex flex-row items-center justify-between space-x-8 text-xl">
        <div>
          <i
            className="wi wi-humidity mr-1"
            style={{ fontFamily: "WeatherIcons" }}
          />
          {weather.humidity}
          <span className="text-gray-500">% </span>
        </div>
        <div>
          <i
            className="wi wi-strong-wind mr-1"
            style={{ fontFamily: "WeatherIcons" }}
          />
          {weather.wind}
          <span className="text-gray-500">m/s </span>
        </div>
        <div>
          <i
            className="wi wi-raindrop mr-1"
            style={{ fontFamily: "WeatherIcons" }}
          />
          {weather.rain}
          <span className="text-gray-500">mm </span>
        </div>
        <div>
          <i
            className="wi wi-sunrise mr-1"
            style={{ fontFamily: "WeatherIcons" }}
          />
          {weather.sunrise}
        </div>
        <div>
          <i
            className="wi wi-sunset mr-1"
            style={{ fontFamily: "WeatherIcons" }}
          />
          {weather.sunset}
        </div>
      </div>

      {/* 5-Day Outlook */}
      <div className="flex flex-col items-center justify-center text-sm">
        <div className="mb-2 text-lg font-medium text-gray-500">
          5-Day Outlook:
        </div>
        <div className="mb-4 flex flex-row items-center justify-between space-x-8 text-xl">
          {weather.forecast5Day.map((f, i) => (
            <div
              key={i}
              className="mx-1 flex flex-row items-center justify-between space-x-6"
            >
              <div className="font-medium">{f.day}</div>
              <i className={`${f.icon} text-xl`} />
              <div>
                {f.temp}
                <span className="text-gray-500">°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

