"use client";

import { fetchMetrics } from "@/lib/fetchMetrics";
import { mergeWithGapMarkers } from "@/lib/mergeWithGapMarkers";
import { saveMetrics } from "@/lib/saveMetrics";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { useEffect, useState } from "react";

const REFRESH = parseInt(process.env.NEXT_PUBLIC_REFRESH) || 10000;

export function useLiveMetrics(pollInterval = REFRESH) {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const newData = await fetchMetrics();
        if (!isMounted || !Array.isArray(newData)) return;

        for (const metric of newData) {
          await saveMetrics(metric); // Save each metric to DB
        }

        setMetrics((prev) =>
          uniqBy([...prev, ...newData], (entry) =>
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

  return mergeWithGapMarkers(
    [],
    sortBy(metrics, (entry) => new Date(entry.time).getTime())
  );
}
