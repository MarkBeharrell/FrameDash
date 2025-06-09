// app/api/history/route.js
import { getDB } from "@/lib/db";
import dayjs from "dayjs";

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
    await compressDailySnapshots(db); // builds snapshots only, no deletion

    const snapshots = await db.all(
      "SELECT * FROM daily_snapshots ORDER BY date ASC"
    );

    console.log(snapshots);

    const rows = await db.all(
      `SELECT * FROM metrics WHERE DATE(time) = DATE('now', 'localtime') ORDER BY time ASC`
    );

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

    // const metrics = await db.all("SELECT * FROM metrics ORDER BY time ASC");

    // // Filter out metrics for dates already compressed into daily_snapshots
    // const compressedDates = new Set(snapshots.map((s) => s.date));

    // const liveData = metrics.filter((row) => {
    //   const date = new Date(row.time).toISOString().split("T")[0];
    //   return !compressedDates.has(date); // keep only rows not yet snapshotted
    // });

    // const data = [
    //   ...snapshots.map((row) => ({
    //     time: new Date(`${row.date}T00:00:00Z`),
    //     timestamp: new Date(`${row.date}T00:00:00Z`).getTime(),
    //     cpuUsage: row.cpuUsage,
    //     memoryUsed: row.memoryUsed,
    //     memoryFree: row.memoryFree,
    //     memoryCached: row.memoryCached,
    //     avgTemp: row.avgTemp,
    //     thermalZone1: row.thermalZone1,
    //     load1pct: row.load1pct ?? null
    //   })),
    //   ...liveData.map((row) => ({
    //     time: new Date(row.time),
    //     timestamp: new Date(row.time).getTime(),
    //     cpuUsage: row.cpuUsage,
    //     memoryUsed: row.memoryUsed,
    //     memoryFree: row.memoryFree,
    //     memoryCached: row.memoryCached,
    //     avgTemp: row.avgTemp,
    //     thermalZone1: row.thermalZone1,
    //     load1pct: row.load1pct ?? null
    //   }))
    // ];

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Failed to read metrics:", err);
    return new Response(JSON.stringify({ error: "Failed to read metrics" }), {
      status: 500
    });
  }
}

/**
 * Compresses older entries (e.g., > 1 day old) into a daily average.
 * Only keeps one row per day in `daily_snapshots`.
 */
export async function compressDailySnapshots(db) {
  const cutoff = dayjs().subtract(1, "day").startOf("day").toISOString();

  // Select all metrics before today
  const rows = await db.all(
    `SELECT * FROM metrics WHERE time < ? ORDER BY time ASC`,
    cutoff
  );

  if (rows.length === 0) return;

  // Group by day
  const grouped = rows.reduce((acc, row) => {
    const day = dayjs(row.time).format("YYYY-MM-DD");
    acc[day] = acc[day] || [];
    acc[day].push(row);
    return acc;
  }, {});

  for (const [day, entries] of Object.entries(grouped)) {
    const avg = (key) =>
      entries
        .map((e) => e[key])
        .filter((v) => typeof v === "number")
        .reduce((a, b) => a + b, 0) / entries.length;

    await db.run(
      `INSERT OR REPLACE INTO daily_snapshots
       (date, cpuUsage, memoryUsed, memoryFree, memoryCached, avgTemp, thermalZone1, load1pct)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      day,
      avg("cpuUsage"),
      avg("memoryUsed"),
      avg("memoryFree"),
      avg("memoryCached"),
      avg("avgTemp"),
      avg("thermalZone1"),
      avg("load1pct")
    );
  }

  // At query time (e.g. GET /api/history):
  // Use the snapshot row for any given day if it exists
  // Ignore all other rows from that day

  // Delete compressed rows
  // await db.run(`DELETE FROM metrics WHERE time < ?`, cutoff);
}
