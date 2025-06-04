"use client";

import iconMap from "@/utils/iconMap";
import axios from "axios";
import dayjs from "dayjs";
import {
  entries,
  filter,
  find,
  first,
  get,
  groupBy,
  map,
  meanBy,
  round,
  sortBy,
  take
} from "lodash";
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

      const forecastToday = map(
        take(
          filter(forecast.list, (item) =>
            dayjs.unix(item.dt).isSame(now, "day")
          ),
          4
        ),
        (f) => ({
          icon: `wi ${iconMap[get(f, "weather[0].icon", "01d")] || "wi-na"}`,
          temp: round(get(f, "main.temp", 0)),
          time: dayjs.unix(f.dt).format("HH:mm")
        })
      );

      const tomorrowChunk = find(forecast.list, (item) =>
        dayjs.unix(item.dt).isSame(now.add(1, "day"), "day")
      );

      const forecastTomorrow = {
        icon: `wi ${iconMap[get(tomorrowChunk, "weather[0].icon", "01d")] || "wi-na"}`,
        temp: round(get(tomorrowChunk, "main.temp", 10)),
        desc: `${get(tomorrowChunk, "rain.3h", 0)} mm Rain`,
        time: dayjs.unix(get(tomorrowChunk, "dt", now.unix())).format("HH:mm")
      };

      const dailyGroups = groupBy(forecast.list, (entry) =>
        dayjs.unix(entry.dt).format("YYYY-MM-DD")
      );

      const forecast5Day = map(
        take(
          sortBy(entries(dailyGroups), ([date]) => date),
          5
        ),
        ([date, entriesForDate]) => ({
          day: dayjs(date).format("ddd"),
          temp: round(meanBy(entriesForDate, "main.temp")),
          icon: `wi ${iconMap[get(first(entriesForDate), "weather[0].icon", "01d")] || "wi-na"}`
        })
      );

      setWeather({
        sunrise: dayjs.unix(current.sys.sunrise).format("HH:mm"),
        sunset: dayjs.unix(current.sys.sunset).format("HH:mm"),
        sunriseRaw: current.sys.sunrise,
        sunsetRaw: current.sys.sunset,
        city: current.name,
        temp: round(current.main.temp),
        description: get(current, "weather[0].description", ""),
        iconCode: get(current, "weather[0].icon", "01d"),
        wind: get(current, "wind.speed", 0),
        rain: get(current, "rain.1h", 0),
        pressure: get(current, "main.pressure", 0),
        humidity: get(current, "main.humidity", 0),
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
