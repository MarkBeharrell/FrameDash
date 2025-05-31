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

export default function CpuStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No CPU data available.</p>;

  const groupedByCpu = _(metrics)
    .groupBy("cpu")
    .mapValues((entries, cpu) => {
      const result = { name: `CPU ${cpu}` };
      entries.forEach(({ type, value }) => {
        result[type] = parseFloat(value);
      });
      return result;
    })
    .values()
    .value();

  const lineColors = {
    idle: "#22c55e",
    user: "#3b82f6",
    system: "#f59e0b",
    wait: "#ef4444",
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">CPU Usage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={groupedByCpu}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis domain={[0, 100]} tick={{ fill: "#ccc" }} />
          <Tooltip />
          <Legend />
          {Object.entries(lineColors).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
