"use client";

import { useEffect, useRef, useState } from "react";
import { fetchMetrics } from "@/lib/fetchMetrics";

export function useLiveMetrics(pollInterval = 10000) {
  const [metrics, setMetrics] = useState([]);
  const seenTimestamps = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const newData = await fetchMetrics();
        if (!isMounted || !Array.isArray(newData)) return;

        const fresh = newData.filter((entry) => {
          const time = new Date(entry.time).getTime();
          if (seenTimestamps.current.has(time)) return false;
          seenTimestamps.current.add(time);
          return true;
        });

        if (fresh.length > 0) {
          setMetrics((prev) => [...prev, ...fresh]);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
    const intervalId = setInterval(poll, pollInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [pollInterval]);

  return metrics;
}
