export async function fetchMetrics() {
const res = await fetch("http://10.0.0.1:9103/metrics", { cache: "no-store" });
  const text = await res.text();
  const lines = text.split("\n");

  const parsed = lines
    .filter((line) => line.startsWith("collectd_") && !line.startsWith("#"))
    .map((line) => {
      const [metric, rawValue, timestamp] = line.trim().split(/\s+/);
      const nameMatch = metric.match(/collectd_(\w+)\{([^}]*)\}/);
      if (!nameMatch) return null;

      const [, type, labelsStr] = nameMatch;
      const labels = Object.fromEntries(
        labelsStr.split(",").map((l) => l.split("=").map((x) => x.replace(/"/g, "")))
      );

      return {
        metric,
        type,
        ...labels,
        value: parseFloat(rawValue),
        timestamp,
      };
    })
    .filter(Boolean);

  return parsed;
}
