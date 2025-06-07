// lib/fetchMetrics.jsx
export async function fetchMetrics() {
  try {
    const res = await fetch("/api/metrics", {
      headers: { "Cache-Control": "no-store" }
    });

    return await res.json();
  } catch (err) {
    console.error("fetchMetrics failed:", err.message);
    return [];
  }
}
