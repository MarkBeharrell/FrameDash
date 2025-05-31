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

export default function TempStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No temperature data available.</p>;

  const chartData = _(metrics)
    .groupBy("sensor")
    .map((entries, sensor) => {
      const latest = _.maxBy(entries, "timestamp");
      return {
        name: sensor,
        value: parseFloat(latest.value),
      };
    })
    .value();

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Temperature</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis unit="°C" tick={{ fill: "#ccc" }} />
          <Tooltip />
          <Legend />
          {chartData.map((entry) => (
            <Line
              key={entry.name}
              type="monotone"
              dataKey="value"
              name={entry.name}
              stroke="#ef4444"
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
