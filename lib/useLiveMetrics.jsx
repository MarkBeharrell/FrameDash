// lib/useLiveMetrics.jsx
"use client";

import { fetchMetrics } from "@/lib/fetchMetrics";
import { mergeWithGapMarkers } from "@/lib/mergeWithGapMarkers";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { useEffect, useState } from "react";

const REFRESH = parseInt(process.env.NEXT_PUBLIC_REFRESH) || 60000;

export function useLiveMetrics(pollInterval = REFRESH) {
  const [history, setHistory] = useState([]);
  const [live, setLive] = useState([]);

  useEffect(() => {
    // Fetch once on mount
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history", { cache: "no-store" });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load historical metrics:", err);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const newData = await fetchMetrics();
        if (!isMounted || !Array.isArray(newData)) return;

        setLive((prev) =>
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

  const merged = mergeWithGapMarkers(
    sortBy(history, (entry) => new Date(entry.time).getTime()),
    sortBy(live, (entry) => new Date(entry.time).getTime())
  );

  return merged;
}

