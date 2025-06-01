"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

export default function CpuStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No CPU data available.</p>;

  const chartData = metrics
    .filter((m) => typeof m.cpuUsage === "number")
    .map((entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm"),
    }));

  return (
    <>
      <h2 className="text-xl font-bold mb-2">CPU Usage</h2>
      <ResponsiveContainer width="100%"  height="100%">
        <LineChart data={chartData}        >
          <XAxis dataKey="timeLabel" stroke="#ccc" tick={{ fill: "#ccc", fontSize: 13 }} tickMargin={12} 
      padding={{ left: 5, right: 0 }} />
          <YAxis  width={40}  domain={["auto", "auto"]} tick={{ fill: "#ccc" , fontSize: 13 }}  
           tickFormatter={(value) => value.toFixed(2)}padding={{ top: 5, bottom: 5 }} tickMargin={8}
/>
          {/* <Tooltip
            formatter={(value) => `${value.toFixed(2)}%`}
            labelFormatter={(label) => `Time: ${label}`}
          /> */}
          <Line
            type="monotone"
            dataKey="cpuUsage"
            stroke="#ec4899"
            dot={false}
            isAnimationActive={true}
            name="CPU Usage"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
