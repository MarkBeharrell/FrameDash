// app/api/metrics/route.jsx
import { getDB } from "@/lib/db";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import mean from "lodash/mean";

const NUM_CORES = parseInt(process.env.NEXT_PUBLIC_NUM_CORES) || 6;

export async function GET() {
  try {
    const res = await fetch("http://10.0.0.1:9103/metrics", {
      cache: "no-store"
    });

    if (!res.ok) {
      return new Response("Failed to fetch metrics", { status: 502 });
    }

    const rawText = await res.text();
    const lines = rawText
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
      (m) => Math.floor(m.timestamp / 60000) * 60000
    );

    const db = await getDB();

    const unified = map(grouped, (group, minuteTimestampStr) => {
      const time = new Date(Number(minuteTimestampStr));

      const cpuValues = group
        .filter(
          (m) =>
            m.type === "cpu_percent" &&
            ["user", "system"].includes(m.labels.type)
        )
        .map((m) => parseFloat(m.value.toFixed(1)));

      const cpuUsage = cpuValues.length ? mean(cpuValues) : null;

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

      // Save to SQLite
      db.run(
        `INSERT INTO metrics (
          time, cpuUsage, memoryUsed, memoryFree, memoryCached, avgTemp, thermalZone1
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        time.toISOString(),
        cpuUsage,
        memUsed ?? null,
        memFree ?? null,
        memCached ?? null,
        avgTemp,
        thermal ?? null
      );

      return {
        time,
        cpuUsage,
        memoryUsed: memUsed ?? null,
        memoryFree: memFree ?? null,
        memoryCached: memCached ?? null,
        avgTemp,
        thermalZone1: thermal ?? null,
        load1pct
      };
    });

    return new Response(JSON.stringify(unified), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("metrics API error:", error.message);
    return new Response("Error fetching or processing metrics", {
      status: 500
    });
  }
}

function fromEntriesShim(iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
}
