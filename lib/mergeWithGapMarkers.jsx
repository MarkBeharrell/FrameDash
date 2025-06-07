// lib/mergeWithGapMarkers.js
import dayjs from "dayjs";

export function mergeWithGapMarkers(history = [], live = []) {
  const combined = [...history, ...live];
  const withMarkers = [];
  let lastDay = null;
  const liveStartTime = live.length > 0 ? live[0].time : null;

  for (let i = 0; i < combined.length; i++) {
    const current = combined[i];
    const prev = combined[i - 1];

    const day = dayjs(current.time).format("YYYY-MM-DD");
    const timestamp = new Date(current.time).getTime();

    if (day !== lastDay) {
      withMarkers.push({
        time: current.time,
        timestamp,
        isDayDivider: true,
        label: dayjs(current.time).format("DD/MM/YYYY")
      });
      lastDay = day;
    }

    if (prev && dayjs(current.time).diff(dayjs(prev.time), "minute") > 5) {
      withMarkers.push({
        time: current.time,
        timestamp,
        isGap: true
      });
    }

    if (current.time === liveStartTime) {
      withMarkers.push({
        time: current.time,
        timestamp,
        isLiveStart: true
      });
    }

    withMarkers.push({ ...current, timestamp });
  }

  return withMarkers;
}
