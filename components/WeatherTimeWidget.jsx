"use client";

import { useWeather } from "@/lib/weatherContext";
import iconMap from "@/utils/iconMap";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export default function WeatherTimeWidget() {
  const { weather } = useWeather();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weather)
    return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <>
      {/* Top Section: Date Icon Temp */}
      <div className="relative mb-4 flex">
        <div className="absolute left-[-150px] top-[45px] flex flex-col text-right">
          <div className="text-2xl text-gray-500">
            {now.format("dddd")}
            <br />
            {now.format("D MMMM YYYY")}
          </div>
          <div className="text-4xl font-semibold">{now.format("HH:mm")}</div>
        </div>

        {/* Center: Icon + Description */}
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex h-[180px] w-[180px] items-end justify-center">
            <i
              className={`wi ${iconMap[weather.iconCode] || "wi-na"} text-9xl`}
            ></i>
          </div>
          <div className="w-full pt-[10px] text-center text-lg capitalize text-gray-500">
            {weather.description}
          </div>
        </div>

        {/* Right: Temperature */}
        <div className="absolute right-[-110px] top-[55px] flex flex-row text-left font-normal">
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
              className="mx-1 flex flex-row items-center justify-between space-x-3"
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

