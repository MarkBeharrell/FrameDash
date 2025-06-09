const REFRESH = parseInt(process.env.NEXT_PUBLIC_REFRESH) || 60000;
const API_URL = "http://localhost:3000/api/metrics";

const backgroundMetrics = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { "Cache-Control": "no-store" }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    console.log(
      `[${new Date().toISOString()}] Fetched ${Array.isArray(json) ? json.length : "N/A"} metrics`
    );
    console.log(json);
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] fetchMetrics failed:`,
      err.message
    );
  }
};

console.log("Background metric polling started...");
setInterval(backgroundMetrics, REFRESH);
