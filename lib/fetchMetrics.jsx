export async function fetchMetrics() {
  const res = await fetch("http://10.0.0.1:9103/metrics", { cache: "no-store" });
  const text = await res.text();
  const lines = text.split("\n").filter(line => line.startsWith("collectd_") && !line.startsWith("#"));

  const parsed = lines.map(line => {
    const [metric, rawValue, timestamp] = line.trim().split(/\s+/);
    const match = metric.match(/collectd_(\w+)\{([^}]*)\}/);
    if (!match) return null;

    const [, type, labelsStr] = match;
    const labels = Object.fromEntries(
      labelsStr.split(",").map((l) => l.split("=").map(x => x.replace(/"/g, "")))
    );

    return {
      type,
      labels,
      value: parseFloat(rawValue),
      timestamp: Number(timestamp),
    };
  }).filter(Boolean);

  // Group by timestamp
  const grouped = new Map();

  for (const metric of parsed) {
    const { timestamp, type, value, labels } = metric;
    const key = timestamp;
    if (!grouped.has(key)) grouped.set(key, { cpuValues: [], memUsed: null, temps: [], time: new Date(timestamp) });

    const group = grouped.get(key);

    if (type === "cpu_percent") {
      if (labels.type === "user" || labels.type === "system") {
        group.cpuValues.push(value);
      }
    }

    if (type === "memory_percent" && labels.memory === "used") {
      group.memUsed = value;
    }

    if (type === "sensors_temperature") {
      if (value > 0 && value < 150) group.temps.push(value);
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







