// lib/renderChartMarkers.js
import React from "react";
import { ReferenceArea, ReferenceLine } from "recharts";

export function renderChartMarkers(chartData) {
  const markers = [];

  for (let i = 0; i < chartData.length; i++) {
    const point = chartData[i];

    // Gap shaded area (optional smoothing)
    if (point.isGap) {
      const prev = chartData[i - 1];
      const next = chartData[i + 1];
      if (prev && next) {
        markers.push(
          <ReferenceArea
            key={`gap-area-${i}`}
            x1={prev.timestamp}
            x2={next.timestamp}
            strokeOpacity={0}
            fill="rgba(150, 150, 150, 0.25)"
          />
        );
        markers.push(
          <ReferenceLine
            key={`gap-line-${i}`}
            x={prev.timestamp}
            stroke="gray"
            strokeDasharray="3 3"
            label={{
              value: "Gap",
              position: "top",
              fontSize: 10,
              fill: "#888"
            }}
          />
        );
      }
    }

    // Day divider
    if (point.isDayDivider && point.label) {
      markers.push(
        <ReferenceLine
          key={`day-line-${i}`}
          x={point.timestamp}
          stroke="#666"
          strokeDasharray="4 1"
          label={{
            value: point.label,
            position: "top",
            fontSize: 12,
            fill: "#bbb"
          }}
        />
      );
    }

    // Live data start
    if (point.isLiveStart) {
      markers.push(
        <ReferenceLine
          key={`live-start-${i}`}
          x={point.timestamp}
          stroke="#00f"
          strokeDasharray="2 2"
          label={{
            value: "Live",
            position: "top",
            fontSize: 10,
            fill: "#00f"
          }}
        />
      );
    }
  }

  return markers;
}

