// lib/db.js
import fs from "fs";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function getDB() {
  const dbPath = path.resolve(process.cwd(), "metrics.db");

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, ""); // Create file if not present
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      time TEXT NOT NULL,
      cpuUsage REAL,
      memoryUsed REAL,
      memoryFree REAL,
      memoryCached REAL,
      avgTemp REAL,
      thermalZone1 REAL,
      load1pct REAL
    );

    CREATE TABLE IF NOT EXISTS daily_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      cpuUsage REAL,
      memoryUsed REAL,
      memoryFree REAL,
      memoryCached REAL,
      avgTemp REAL,
      thermalZone1 REAL,
      load1pct REAL
    );
  `);

  return db;
}
