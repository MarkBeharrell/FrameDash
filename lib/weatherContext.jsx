"use client";

import iconMap from "@/utils/iconMap";
import axios from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

const WeatherContext = createContext({
  weather: null,
  now: null
});

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(dayjs());

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API;
  const CITY = process.env.NEXT_PUBLIC_CITY || "London,GB";
  // const API_KEY = "46cd22e08e095f49bf8689ebaa7c4b71";
  // const CITY = "Burnham-on-Crouch,GB";

  const fetchWeather = useCallback(async () => {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: { q: CITY, appid: API_KEY, units: "metric", lang: "en" }
        }),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: { q: CITY, appid: API_KEY, units: "metric", lang: "en" }
        })
      ]);

      const current = currentRes.data;
      const forecast = forecastRes.data;

      const forecastToday = _(forecast.list)
        .filter((item) => dayjs.unix(item.dt).isSame(now, "day"))
        .take(4)
        .map((f) => ({
          icon: `wi ${iconMap[_.get(f, "weather[0].icon", "01d")] || "wi-na"}`,
          temp: _.round(_.get(f, "main.temp", 0)),
          time: dayjs.unix(f.dt).format("HH:mm")
        }))
        .value();

      const tomorrowChunk = _.find(forecast.list, (item) =>
        dayjs.unix(item.dt).isSame(now.add(1, "day"), "day")
      );

      const forecastTomorrow = {
        icon: `wi ${iconMap[_.get(tomorrowChunk, "weather[0].icon", "01d")] || "wi-na"}`,
        temp: _.round(_.get(tomorrowChunk, "main.temp", 10)),
        desc: `${_.get(tomorrowChunk, "rain.3h", 0)} mm Rain`,
        time: dayjs.unix(_.get(tomorrowChunk, "dt", now.unix())).format("HH:mm")
      };

      const dailyGroups = _.groupBy(forecast.list, (entry) =>
        dayjs.unix(entry.dt).format("YYYY-MM-DD")
      );

      const forecast5Day = _(dailyGroups)
        .entries()
        .sortBy(([date]) => date)
        .take(5)
        .map(([date, entries]) => ({
          day: dayjs(date).format("ddd"),
          temp: _.round(_.meanBy(entries, "main.temp")),
          icon: `wi ${iconMap[_.get(_.first(entries), "weather[0].icon", "01d")] || "wi-na"}`
        }))
        .value();

      setWeather({
        sunrise: dayjs.unix(current.sys.sunrise).format("HH:mm"),
        sunset: dayjs.unix(current.sys.sunset).format("HH:mm"),
        sunriseRaw: current.sys.sunrise,
        sunsetRaw: current.sys.sunset,
        city: current.name,
        temp: _.round(current.main.temp),
        description: _.get(current, "weather[0].description", ""),
        iconCode: _.get(current, "weather[0].icon", "01d"),
        wind: _.get(current, "wind.speed", 0),
        rain: _.get(current, "rain.1h", 0),
        pressure: _.get(current, "main.pressure", 0),
        humidity: _.get(current, "main.humidity", 0),
        aqi: "Good",
        forecastToday,
        forecastTomorrow,
        forecast5Day
      });
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  }, [API_KEY, CITY, now]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    const timeUpdater = setInterval(() => setNow(dayjs()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timeUpdater);
    };
  }, [fetchWeather]);

  return (
    <WeatherContext.Provider value={{ weather, now }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
