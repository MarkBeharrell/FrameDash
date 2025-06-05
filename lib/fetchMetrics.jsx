import axios from "axios";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import mean from "lodash/mean";

const NUM_CORES = parseInt(process.env.NEXT_PUBLIC_NUM_CORES) || 6;
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

    const grouped = groupBy(
      parsed,
      (metric) => Math.floor(metric.timestamp / 60000) * 60000
    );

    const unified = map(grouped, (group, minuteTimestampStr) => {
      const time = new Date(Number(minuteTimestampStr));

      const cpuValues = group
        .filter(
          (m) =>
            m.type === "cpu_percent" &&
            (m.labels.type === "user" || m.labels.type === "system")
        )
        .map((m) => parseFloat(m.value.toFixed(1)));

      const cpuUsage = cpuValues.length > 0 ? mean(cpuValues) : null;

      const memUsed = group.find(
        (m) => m.type === "memory_percent" && m.labels.memory === "used"
      )?.value;

      const memFree = group.find(
        (m) => m.type === "memory_percent" && m.labels.memory === "free"
      )?.value;

      const memCached = group.find(
        (m) => m.type === "memory_percent" && m.labels.memory === "cached"
      )?.value;

      const load1 =
        group.find((m) => m.type === "load_shortterm")?.value ?? null;
      const load1pct = load1 ? (load1 / NUM_CORES) * 100 : null;

      const thermal = group.find(
        (m) =>
          m.type === "thermal_temperature" &&
          m.labels.thermal === "thermal_zone1"
      )?.value;

      const temps = group
        .filter(
          (m) =>
            m.type === "sensors_temperature" &&
            m.value > 0 &&
            m.value < 150 &&
            !["iwlwifi_1-virtual-0"].includes(m.labels.sensors)
        )
        .map((m) => parseFloat(m.value.toFixed(1)));

      const avgTemp = temps.length > 0 ? mean(temps) : null;

      return {
        time,
        cpuUsage,
        memoryUsed: memUsed ?? null,
        memoryFree: memFree ?? null,
        memoryCached: memCached ?? null,
        load1pct,
        thermalZone1: thermal ?? null,
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
