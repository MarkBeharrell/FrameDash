"use client"

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import _ from "lodash";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API;
const CITY = process.env.NEXT_PUBLIC_CITY || "Burnham-on-Crouch,GB";

export default function WeatherTimeWidget() {
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(dayjs());

  const fetchWeather = async () => {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=en`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric&lang=en`
        ),
      ]);

      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      const forecastToday = _(forecast.list)
        .filter((item) => dayjs.unix(item.dt).isSame(now, "day"))
        .take(4)
        .map((f) => ({
          icon: `wi wi-owm-${_.get(f, "weather[0].id", "800")}`,
          temp: _.round(_.get(f, "main.temp", 0)),
          time: dayjs.unix(f.dt).format("HH:mm"),
        }))
        .value();

      const tomorrowChunk = _.find(forecast.list, (item) =>
        dayjs.unix(item.dt).isSame(now.add(1, "day"), "day")
      );

      const forecastTomorrow = {
        icon: `wi wi-owm-${_.get(tomorrowChunk, "weather[0].id", "800")}`,
        temp: _.round(_.get(tomorrowChunk, "main.temp", 10)),
        desc: `${_.get(tomorrowChunk, "rain.3h", 0)} mm Rain`,
        time: dayjs.unix(_.get(tomorrowChunk, "dt", now.unix())).format("HH:mm"),
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
          icon: `wi wi-owm-${_.get(_.first(entries), "weather[0].id", "800")}`,
        }))
        .value();

      setWeather({
        sunrise: dayjs.unix(_.get(current, "sys.sunrise")).format("HH:mm"),
        sunset: dayjs.unix(_.get(current, "sys.sunset")).format("HH:mm"),
        city: _.get(current, "name"),
        temp: _.round(_.get(current, "main.temp")),
        description: _.get(current, "weather[0].description", ""),
        iconCode: _.get(current, "weather[0].id", "800"),
        wind: _.get(current, "wind.speed", 0),
        rain: _.get(current, "rain.1h", 0),
        pressure: _.get(current, "main.pressure", 0),
        humidity: _.get(current, "main.humidity", 0),
        aqi: "Good",
        forecastToday,
        forecastTomorrow,
        forecast5Day,
      });
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    const timeUpdater = setInterval(() => setNow(dayjs()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timeUpdater);
    };
  }, []);

  if (!weather) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 rounded-xl shadow bg-white text-gray-800 max-w-4xl mx-auto space-y-6">
      {/* Date & Time */}
      <div className="text-center">
        <div className="text-xl font-semibold">{now.format("dddd, D MMMM YYYY")}</div>
        <div className="text-4xl font-bold">{now.format("HH:mm:ss")}</div>
      </div>

      {/* Current Weather */}
      <div className="flex justify-around items-center text-xl">
        <div className="text-center">
          <div className="text-lg">{weather.city}</div>
          <div className="text-6xl font-bold">{weather.temp}°C</div>
          <div className="capitalize">{weather.description}</div>
        </div>
        <i className={`wi wi-owm-${weather.iconCode} text-6xl`} />
        <div className="text-sm text-left space-y-1">
          <div><i className="wi wi-humidity mr-1" /> {weather.humidity}% Humidity</div>
          <div><i className="wi wi-strong-wind mr-1" /> {weather.wind} m/s Wind</div>
          <div><i className="wi wi-raindrop mr-1" /> {weather.rain} mm Rain</div>
          <div><i className="wi wi-barometer mr-1" /> {weather.pressure} hPa</div>
          <div><i className="wi wi-sunrise mr-1" /> {weather.sunrise}</div>
          <div><i className="wi wi-sunset mr-1" /> {weather.sunset}</div>
        </div>
      </div>

      {/* Today Forecast */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-1">Later Today:</div>
        <div className="flex justify-around items-center text-sm">
          {weather.forecastToday.map((f, i) => (
            <div key={i} className="flex flex-col items-center mx-2">
              <div>{f.time}</div>
              <i className={`${f.icon} text-2xl`} />
              <div>{f.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tomorrow */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-1">Tomorrow:</div>
        <div className="flex justify-start gap-4 items-center text-sm">
          <i className={`${weather.forecastTomorrow.icon} text-2xl`} />
          <div className="text-sm">{weather.forecastTomorrow.desc}</div>
          <div className="text-lg font-bold">{weather.forecastTomorrow.temp}°C</div>
          <div>{weather.forecastTomorrow.time}</div>
        </div>
      </div>

      {/* 5 Day Outlook */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-1">5-Day Outlook:</div>
        <div className="flex justify-around items-center text-sm">
          {weather.forecast5Day.map((f, i) => (
            <div key={i} className="flex flex-col items-center mx-2">
              <div className="font-medium">{f.day}</div>
              <i className={`${f.icon} text-xl`} />
              <div>{f.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
