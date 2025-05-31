"use client";

import _ from "lodash";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MemoryStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No memory data available.</p>;

  const chartData = _(metrics)
    .map(({ memory, value }) => ({
      name: memory.toUpperCase(),
      value: parseFloat(value),
    }))
    .value();

  const colors = {
    CACHED: "#3b82f6",
    USED: "#f59e0b",
    FREE: "#22c55e",
    BUFFERED: "#8b5cf6",
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Memory Usage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis tick={{ fill: "#ccc" }} />
          <Tooltip />
          <Legend />
          {chartData.map((entry) => {
            const color = colors[entry.name];
            return (
              <Line
                key={entry.name}
                type="monotone"
                dataKey="value"
                name={entry.name}
                stroke={color || "#999"}
                dot={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
