export async function GET() {
  try {
    const res = await fetch("http://10.0.0.1:9103/metrics", {
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response("Failed to fetch metrics", { status: 502 });
    }

    const text = await res.text();

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*", // Optional if you want to call this from other domains
      },
    });
  } catch (error) {
    return new Response("Error contacting collectd", { status: 500 });
  }
}
