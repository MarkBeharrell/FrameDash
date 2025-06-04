import axios from "axios";
import _ from "lodash";

export async function fetchMetrics() {
  try {
    const res = await axios.get("/api/metrics", {
      headers: { "Cache-Control": "no-store" }
    });

    const text = res.data;

    const lines = text
      .split("\n")
      .filter((line) => line.startsWith("collectd_") && !line.startsWith("#"));

    const parsed = lines
      .map((line) => {
        const [metric, rawValue, timestampStr] = line.trim().split(/\s+/);
        const timestamp = Number(timestampStr);
        const match = metric.match(/collectd_(\w+)\{([^}]*)\}/);
        if (!match) return null;

        const [, type, labelsStr] = match;

        const labels = fromEntriesShim(
          labelsStr
            .split(",")
            .map((l) => l.split("=").map((x) => x.replace(/"/g, "")))
        );

        return {
          type,
          labels,
          value: parseFloat(rawValue),
          timestamp
        };
      })
      .filter(Boolean);

    // ✅ Group by floored minute timestamp
    const grouped = _.groupBy(
      parsed,
      (metric) => Math.floor(metric.timestamp / 60000) * 60000
    );

    const unified = _.map(grouped, (group, minuteTimestampStr) => {
      const time = new Date(Number(minuteTimestampStr));

      const cpuValues = group
        .filter(
          (m) =>
            m.type === "cpu_percent" &&
            (m.labels.type === "user" || m.labels.type === "system")
        )
        .map((m) => parseFloat(m.value.toFixed(1)));

      const memUsedEntry = group.find(
        (m) => m.type === "memory_percent" && m.labels.memory === "cached"
      );

      const temps = group
        .filter(
          (m) =>
            m.type === "sensors_temperature" && m.value > 0 && m.value < 150
        )
        .map((m) => parseFloat(m.value.toFixed(1)));

      const cpuUsage = cpuValues.length > 0 ? _.mean(cpuValues) : null;

      const avgTemp = temps.length > 0 ? _.mean(temps) : null;

      return {
        time,
        cpuUsage,
        memoryUsed: memUsedEntry
          ? parseFloat(memUsedEntry.value.toFixed(1))
          : null,
        avgTemp
      };
    });

    return unified;
  } catch (error) {
    console.error("fetchMetrics failed:", error.message);
    return [];
  }
}

function fromEntriesShim(iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
}

