"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import React from 'react';

export default function MemoryStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No memory data available.</p>;

  const chartData = metrics
    .filter((m) => typeof m.memoryUsed === "number")
    .map((entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm"),
    }));

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Memory Usage</h2>
      <ResponsiveContainer width="100%"  height="100%">
                  <LineChart data={chartData}        >
          <XAxis dataKey="timeLabel" stroke="#ccc" tick={{ fill: "#ccc", fontSize: 13 }}tickMargin={12}
      padding={{ left: 5, right: 0 }} />
          <YAxis width={40}  domain={["auto", "auto"]} tick={{ fill: "#ccc" , fontSize: 13 }} tickMargin={8}  
           tickFormatter={(value) => value.toFixed(1)}padding={{ top: 5, bottom: 5 }} 
/>
          {/* <Tooltip
            formatter={(value) => `${value.toFixed(2)}%`}
            labelFormatter={(label) => `Time: ${label}`}
          /> */}
          <Line
            type="monotone"
            dataKey="memoryUsed"
            stroke="#3b82f6"
            dot={false}
            isAnimationActive={true}
            name="Memory Used"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
