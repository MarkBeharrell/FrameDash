// "use client";

import { getGapMarkers } from "@/lib/getGapMarkers";
import { getTrendValue } from "@/lib/getTrendValue";
import { getValidPoints } from "@/lib/getValidPoints";
import dayjs from "dayjs";
import map from "lodash/map";
import React from "react";
import {
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

export default function CpuStats({ metrics }) {
  if (!metrics || metrics.length === 0) return <p>No CPU data available.</p>;

  const { validPoints, fixedTicks } = getValidPoints(metrics, 10);

  const chartData = map(validPoints, (entry) => ({
    ...entry,
    timestamp: new Date(entry.time).valueOf()
  }));

  const gapMarkers = getGapMarkers(metrics);

  const { lastValue, changePct, statColor } = getTrendValue(
    chartData,
    "cpuUsage"
  );

  return (
    <>
      <h2 className="mb-2 text-base font-medium text-gray-600">CPU Usage</h2>
      <div
        className={`!text-${statColor}-500 absolute right-[10px] top-[10px] mb-1 text-2xl font-bold`}
      >
        {lastValue?.cpuUsage?.toFixed(1) ?? "--"}
        <span className="text-sm font-normal text-gray-400">%</span>
        {changePct !== null && (
          <span className="ml-2 text-sm font-medium">
            {changePct > 0 ? "+" : ""}
            {changePct.toFixed(1)}%
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ right: 10, left: 0, bottom: 10 }}>
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={[fixedTicks[0], fixedTicks[fixedTicks.length - 1]]}
            ticks={fixedTicks}
            tickFormatter={(val) => dayjs(val).format("HH:mm")}
            stroke="#888"
            tick={{
              fill: "#888",
              fontSize: 12,
              // @ts-ignore
              angle: -65,
              textAnchor: "end"
            }}
            tickMargin={3}
            interval={0}
          />

          <YAxis
            width={40}
            domain={["auto", "auto"]}
            tick={{ fill: "#888", fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(2)}
            padding={{ top: 5, bottom: 5 }}
            tickMargin={8}
            interval={0}
          />

          {gapMarkers.map((gap, idx) => {
            const currentIndex = chartData.findIndex(
              (e) => e.timestamp === gap.timestamp
            );

            const x1 = chartData[currentIndex - 1]?.timestamp;
            const x2 = chartData[currentIndex + 1]?.timestamp;

            if (!x1 || !x2) return null;

            return [
              <ReferenceArea
                key={`gap-area-${idx}`}
                x1={x1}
                x2={x2}
                strokeOpacity={0}
                fill="rgba(150, 150, 150, 0.25)"
              />,
              <ReferenceLine
                key={`gap-line-start-${idx}`}
                x={x1}
                stroke="gray"
                strokeDasharray="3 3"
                label={{
                  value: "Gap Start",
                  position: "top",
                  fontSize: 10,
                  fill: "#888"
                }}
              />,
              <ReferenceLine
                key={`gap-line-end-${idx}`}
                x={x2}
                stroke="gray"
                strokeDasharray="3 3"
                label={{
                  value: "Gap End",
                  position: "top",
                  fontSize: 10,
                  fill: "#888"
                }}
              />
            ];
          })}

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

// export default function CpuStats({ metrics }) {
//   if (!metrics || metrics.length === 0) return <p>No CPU data available.</p>;

//   const chartData = sortBy(
//     metrics.map((entry) => ({
//       ...entry,
//       timestamp: new Date(entry.time).getTime()
//     })),
//     (e) => [e.timestamp, e.cpuUsage == null ? 0 : 1] // ensure data rows come after markers
//   );

//   const today = dayjs().format("YYYY-MM-DD");

//   const gapMarkers = metrics
//     .filter((m) => m.isGap && dayjs(m.time).format("YYYY-MM-DD") === today)
//     .map((m) => ({
//       timestamp: new Date(m.time).getTime()
//     }));

//   const lastValue = last(chartData);
//   const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;
//   const cpuChangePct =
//     lastValue && prev
//       ? ((lastValue.cpuUsage - prev.cpuUsage) / prev.cpuUsage) * 100
//       : null;
//   const statColor = getTrendColor(lastValue?.cpuUsage, prev?.cpuUsage);

//   return (
//     <>
//       <h2 className="mb-2 text-base font-medium text-gray-600">CPU Usage</h2>
//       <div
//         className={`!text-${statColor}-500 absolute right-[10px] top-[10px] mb-1 text-2xl font-bold`}
//       >
//         {lastValue?.cpuUsage?.toFixed(1) ?? "--"}
//         <span className="text-sm font-normal text-gray-400">%</span>
//         {cpuChangePct !== null && (
//           <span className="ml-2 text-sm font-medium">
//             {cpuChangePct > 0 ? "+" : ""}
//             {cpuChangePct.toFixed(1)}%
//           </span>
//         )}
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={chartData}>
//           <XAxis
//             dataKey="timestamp"
//             type="number"
//             domain={["auto", "auto"]}
//             stroke="#888"
//             tick={{ fill: "#888", fontSize: 13 }}
//             tickMargin={12}
//             tickFormatter={(val, index) => {
//               const point = chartData[index];
//               if (point?.isDayDivider && point?.label) return point.label;
//               return dayjs(val).format("HH:mm");
//             }}
//           />
//           <YAxis
//             width={40}
//             domain={["auto", "auto"]}
//             tick={{ fill: "#888", fontSize: 13 }}
//             tickFormatter={(value) => value.toFixed(2)}
//             padding={{ top: 5, bottom: 5 }}
//             tickMargin={8}
//           />

//           {chartData.map((entry, idx) =>
//             entry.isDayDivider ? (
//               <ReferenceLine
//                 key={`day-${idx}`}
//                 x={entry.timestamp}
//                 stroke="#666"
//                 strokeDasharray="4 1"
//                 label={{
//                   value: entry.label,
//                   position: "top",
//                   fontSize: 12,
//                   fill: "#bbb"
//                 }}
//               />
//             ) : entry.isLiveStart ? (
//               <ReferenceLine
//                 key={`live-${idx}`}
//                 x={entry.timestamp}
//                 stroke="#00f"
//                 strokeDasharray="2 2"
//                 label={{
//                   value: "Live",
//                   position: "top",
//                   fontSize: 10,
//                   fill: "#00f"
//                 }}
//               />
//             ) : null
//           )}

//           {gapMarkers.map((gap, idx) => {
//             const currentIndex = chartData.findIndex(
//               (e) => e.timestamp === gap.timestamp
//             );
//             const x1 = chartData[currentIndex - 1]?.timestamp;
//             const x2 = chartData[currentIndex + 1]?.timestamp;
//             if (!x1 || !x2) return null;
//             return [
//               <ReferenceArea
//                 key={`gap-area-${idx}`}
//                 x1={x1}
//                 x2={x2}
//                 strokeOpacity={0}
//                 fill="rgba(150, 150, 150, 0.25)"
//               />,
//               <ReferenceLine
//                 key={`gap-start-${idx}`}
//                 x={x1}
//                 stroke="gray"
//                 strokeDasharray="3 3"
//                 label={{
//                   value: "Gap Start",
//                   position: "top",
//                   fontSize: 10,
//                   fill: "#888"
//                 }}
//               />,
//               <ReferenceLine
//                 key={`gap-end-${idx}`}
//                 x={x2}
//                 stroke="gray"
//                 strokeDasharray="3 3"
//                 label={{
//                   value: "Gap End",
//                   position: "top",
//                   fontSize: 10,
//                   fill: "#888"
//                 }}
//               />
//             ];
//           })}

//           <Line
//             type="monotone"
//             dataKey="cpuUsage"
//             stroke="#ec4899"
//             dot={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </>
//   );
// }
