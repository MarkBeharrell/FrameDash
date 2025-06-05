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

export default function CpuStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No CPU data available.</p>;

  const chartData = map(
    filter(metrics, (m) => typeof m.cpuUsage === "number"),
    (entry) => ({
      ...entry,
      timeLabel: dayjs(entry.time).format("HH:mm")
    })
  );

  const lastValue = last(chartData);
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const cpuChangePct =
    lastValue && prev
      ? ((lastValue.cpuUsage - prev.cpuUsage) / prev.cpuUsage) * 100
      : null;
  const statColor = getTrendColor(lastValue?.cpuUsage, prev?.cpuUsage);

  return (
    <>
      <h2 className="mb-2 text-base font-medium text-gray-600">CPU Usage</h2>
      <div
        className={`absolute right-[10px] top-[10px] mb-1 text-2xl font-bold !text-${statColor}-500`}
      >
        {lastValue?.cpuUsage?.toFixed(1) ?? "--"}
        <span className="text-sm font-normal text-gray-400">%</span>
        {cpuChangePct !== null && (
          <span className="ml-2 text-sm font-medium">
            {cpuChangePct > 0 ? "+" : ""}
            {cpuChangePct.toFixed(1)}%
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
            tickFormatter={(value) => value.toFixed(2)}
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
