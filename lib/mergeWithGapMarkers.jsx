// lib/mergeWithGapMarkers.jsx

import dayjs from "dayjs";

export function mergeWithGapMarkers(history = [], live = []) {
  const combined = [...history, ...live];
  const withSeparators = [];

  for (let i = 0; i < combined.length; i++) {
    const current = combined[i];
    const prev = combined[i - 1];

    withSeparators.push(current);

    if (prev && dayjs(current.time).diff(dayjs(prev.time), "minute") > 5) {
      withSeparators.push({
        time: current.time,
        timeLabel: dayjs(current.time).format("HH:mm"),
        isGap: true
      });
    }
  }

  return withSeparators;
}
