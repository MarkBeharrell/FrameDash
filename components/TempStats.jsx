"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import React from "react";

export default function TemperatureStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No temperature data available.</p>;

  const chartData = metrics
    .filter((m) => typeof m.avgTemp === "number")
    .map((entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm"),
    }));

  return (
    <>
      <h2 className="text-xl font-medium mb-2 text-gray-600">Average Temperature</h2>
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
          {/* <Tooltip
            formatter={(value) => `${value.toFixed(2)}°C`}
            labelFormatter={(label) => `Time: ${label}`}
          /> */}
          <Line
            type="monotone"
            dataKey="avgTemp"
            stroke="#f97316"
            dot={false}
            isAnimationActive={true}
            name="Avg Temp"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}




