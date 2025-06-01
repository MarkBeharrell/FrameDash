export async function fetchMetrics() {
  const res = await fetch("/api/metrics", { cache: "no-store" });
  const text = await res.text();

  const lines = text
    .split("\n")
    .filter(line => line.startsWith("collectd_") && !line.startsWith("#"));

  const parsed = lines.map(line => {
    const [metric, rawValue, timestampStr] = line.trim().split(/\s+/);
    const timestamp = Number(timestampStr);
    const match = metric.match(/collectd_(\w+)\{([^}]*)\}/);
    if (!match) return null;

    const [, type, labelsStr] = match;
    const labels = Object.fromEntries(
      labelsStr.split(",").map(l => l.split("=").map(x => x.replace(/"/g, "")))
    );

    return {
      type,
      labels,
      value: parseFloat(rawValue),
      timestamp,
    };
  }).filter(Boolean);

  // Group by minute-level timestamp
  const grouped = new Map();

  for (const metric of parsed) {
    const { timestamp, type, value, labels } = metric;

    // Normalize to the start of the minute
    const minuteTimestamp = Math.floor(timestamp / 60000) * 60000;

    if (!grouped.has(minuteTimestamp)) {
      grouped.set(minuteTimestamp, {
        cpuValues: [],
        memUsed: null,
        temps: [],
        time: new Date(minuteTimestamp),
      });
    }

    const group = grouped.get(minuteTimestamp);

    if (type === "cpu_percent") {
      if (labels.type === "user" || labels.type === "system") {
        group.cpuValues.push(parseFloat(value.toFixed(1)));
      }
    }

    if (type === "memory_percent" && labels.memory === "cached") {
      group.memUsed = parseFloat(value.toFixed(1));
    }

    if (type === "sensors_temperature") {
      if (value > 0 && value < 150) {
        group.temps.push(parseFloat(value.toFixed(1)));
      }
    }
  }

  const unified = [];
  for (const [, entry] of grouped) {
    const cpuUsage = entry.cpuValues.length > 0
      ? entry.cpuValues.reduce((a, b) => a + b, 0) / entry.cpuValues.length
      : null;

    const avgTemp = entry.temps.length > 0
      ? entry.temps.reduce((a, b) => a + b, 0) / entry.temps.length
      : null;

    unified.push({
      time: entry.time,
      cpuUsage,
      memoryUsed: entry.memUsed,
      avgTemp,
    });
  }

  return unified;
}
