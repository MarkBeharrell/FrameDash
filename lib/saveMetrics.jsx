// lib/saveMetrics.js
export async function saveMetrics(metric) {
  try {
    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(metric),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("saveMetrics failed:", err);
  }
}
