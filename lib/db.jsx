// lib/db.jsx
import { open } from "sqlite";
import sqlite3 from "sqlite3";

import fs from "fs";
import path from "path";

export async function getDB() {
  const dbPath = path.resolve(process.cwd(), "metrics.db");

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
  }

  const db = await open({
    filename: "./metrics.db",
    driver: sqlite3.Database
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          time TEXT NOT NULL,
          cpuUsage REAL,
          memoryUsed REAL,
          memoryFree REAL,
          memoryCached REAL,
          avgTemp REAL,
          thermalZone1 REAL
        )
      `);

  return db;
}
