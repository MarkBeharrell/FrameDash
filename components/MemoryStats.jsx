"use client";

import getTrendColor from "@/lib/getTrendColour";
import dayjs from "dayjs";
import filter from "lodash/filter";
import last from "lodash/last";
import map from "lodash/map";
import React from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

export default function MemoryStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No memory data available.</p>;

  const chartData = map(
    filter(
      metrics,
      (m) =>
        typeof m.memoryUsed === "number" ||
        typeof m.memoryFree === "number" ||
        typeof m.memoryCached === "number"
    ),
    (entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm")
    })
  );

  const lastValue = last(chartData);
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const memChangePct =
    lastValue && prev
      ? ((lastValue.memoryUsed - prev.memoryUsed) / prev.memoryUsed) * 100
      : null;
  const statColor = getTrendColor(lastValue?.memoryUsed, prev?.memoryUsed);

  return (
    <>
      <h2 className="mb-2 text-base font-medium text-gray-600">Memory Usage</h2>
      <div
        className={`!text- absolute right-[10px] top-[10px] mb-1 text-2xl font-bold${statColor}-500`}
      >
        {lastValue?.memoryUsed?.toFixed(1) ?? "--"}
        <span className="text-sm font-normal text-gray-400">%</span>
        {memChangePct !== null && (
          <span className="ml-2 text-sm font-medium">
            {memChangePct > 0 ? "+" : ""}
            {memChangePct.toFixed(1)}%
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="timeLabel"
            stroke="#888"
            tick={{ fill: "#888", fontSize: 13 }}
            tickMargin={12}
            padding={{ left: 5, right: 0 }}
          />
          <YAxis
            width={40}
            domain={["auto", "auto"]}
            tick={{ fill: "#888", fontSize: 13 }}
            tickFormatter={(value) => value.toFixed(1)}
            padding={{ top: 5, bottom: 5 }}
            tickMargin={8}
          />
          {chartData.map(
            (entry, idx) =>
              entry.isGap && (
                <ReferenceLine
                  key={`gap-${idx}`}
                  x={entry.timeLabel}
                  stroke="gray"
                  strokeDasharray="3 3"
                  label={{
                    value: "Gap",
                    position: "top",
                    fontSize: 10,
                    fill: "#888"
                  }}
                />
              )
          )}
          <Line
            type="monotone"
            dataKey="memoryUsed"
            stroke="#3b82f6"
            dot={false}
            isAnimationActive={true}
            name="Used"
          />
          <Line
            type="monotone"
            dataKey="memoryFree"
            stroke="#10b981"
            dot={false}
            isAnimationActive={true}
            name="Free"
          />
          <Line
            type="monotone"
            dataKey="memoryCached"
            stroke="#f59e0b"
            dot={false}
            isAnimationActive={true}
            name="Cached"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
