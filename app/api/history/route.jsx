// app/api/history/route.js
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const db = await getDB();
    const metric = await req.json();

    await db.run(
      `INSERT INTO metrics (
        time, cpuUsage, memoryUsed, memoryFree, memoryCached, avgTemp, thermalZone1
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      metric.time,
      metric.cpuUsage,
      metric.memoryUsed,
      metric.memoryFree,
      metric.memoryCached,
      metric.avgTemp,
      metric.thermalZone1
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to save metric:", err);
    return new Response(JSON.stringify({ error: "Failed to save metric" }), {
      status: 500
    });
  }
}

export async function GET() {
  try {
    const db = await getDB();
    const rows = await db.all("SELECT * FROM metrics ORDER BY time ASC");

    const data = rows.map((row) => ({
      time: new Date(row.time),
      cpuUsage: row.cpuUsage,
      memoryUsed: row.memoryUsed,
      memoryFree: row.memoryFree,
      memoryCached: row.memoryCached,
      avgTemp: row.avgTemp,
      thermalZone1: row.thermalZone1,
      load1pct: row.load1pct ?? null
    }));

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Failed to read metrics:", err);
    return new Response(JSON.stringify({ error: "Failed to read metrics" }), {
      status: 500
    });
  }
}
