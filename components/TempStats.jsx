"use client";

import dayjs from "dayjs";
import filter from "lodash/filter";
import map from "lodash/map";
import React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function TemperatureStats({ metrics }) {
  if (!metrics || metrics.length === 0)
    return <p>No temperature data available.</p>;

  const chartData = map(
    filter(
      metrics,
      (m) => typeof m.avgTemp === "number" || typeof m.thermalZone1 === "number"
    ),
    (entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm")
    })
  );

  return (
    <>
      <h2 className="mb-2 text-xl font-medium text-gray-600">
        System Temperature
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="timeLabel"
            stroke="#888"
            tick={{ fill: "#888", fontSize: 13 }}
            tickMargin={12}
            padding={{ left: 0, right: 5 }}
          />
          <YAxis
            width={40}
            domain={["auto", "auto"]}
            tick={{ fill: "#888", fontSize: 13 }}
            tickFormatter={(value) => value.toFixed(1)}
            padding={{ top: 5, bottom: 5 }}
            tickMargin={8}
          />
          <Line
            type="monotone"
            dataKey="avgTemp"
            stroke="#f97316"
            dot={false}
            isAnimationActive={true}
            name="Avg Sensor Temp"
          />
          <Line
            type="monotone"
            dataKey="thermalZone1"
            stroke="#10b981"
            dot={false}
            isAnimationActive={true}
            name="Thermal Zone 1"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
