// lib/getMetricsHistory.jsx
import { getDB } from "@/lib/db";

export default async function getMetricsHistory(req, res) {
  try {
    const db = await getDB();
    const rows = await db.all("SELECT * FROM metrics ORDER BY time ASC");

    const data = rows.map((row) => ({
      time: new Date(row.timestamp),
      cpuUsage: row.cpuUsage,
      memoryUsed: row.memoryUsed,
      memoryFree: row.memoryFree,
      memoryCached: row.memoryCached,
      avgTemp: row.avgTemp,
      thermalZone1: row.thermalZone1,
      load1pct: row.load1pct
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error("Error reading history:", err);
    res.status(500).json({ error: "Could not read history." });
  }
}
