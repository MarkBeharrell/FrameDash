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

export default function MemoryStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No memory data available.</p>;

  const chartData = metrics
    .filter((m) => typeof m.memoryUsed === "number")
    .map((entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm:ss"),
    }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Memory Usage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="timeLabel" stroke="#ccc" />
          <YAxis domain={["auto", "auto"]} tick={{ fill: "#ccc" }} />
          <Tooltip
            formatter={(value) => `${value.toFixed(2)}%`}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="memoryUsed"
            stroke="#3b82f6"
            dot={false}
            isAnimationActive={false}
            name="Memory Used"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
