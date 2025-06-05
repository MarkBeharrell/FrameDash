// app/api/save/route.js
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const db = await getDB();
    const metric = await req.json();

    await db.run(
      `
      INSERT INTO metrics (
        time, cpuUsage, memoryUsed, memoryFree, memoryCached, avgTemp, thermalZone1
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
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
