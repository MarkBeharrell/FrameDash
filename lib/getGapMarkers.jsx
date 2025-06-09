//  Gaps using raw time, mapped to timestamps too

export function getGapMarkers(metrics) {
  return metrics
    .filter((m) => m.isGap)
    .map((m) => ({
      time: m.time,
      timestamp: new Date(m.time).valueOf()
    }));
}
