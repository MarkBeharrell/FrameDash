"use client";

import { fetchMetrics } from "@/lib/fetchMetrics";
import _ from "lodash";
import { useEffect, useState } from "react";

export function useLiveMetrics(pollInterval = 10000) {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const newData = await fetchMetrics();
        if (!isMounted || !Array.isArray(newData)) return;

        setMetrics((prev) =>
          _.uniqBy([...prev, ...newData], (entry) =>
            new Date(entry.time).getTime()
          )
        );
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

  return _.sortBy(metrics, (entry) => new Date(entry.time).getTime());
}
