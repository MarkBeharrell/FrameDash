"use client";
import "@/lib/polyfills";

import CpuStats from "@/components/CpuStats";
import MemoryStats from "@/components/MemoryStats";
import TempStats from "@/components/TempStats";
import WeatherTimeWidget from "@/components/WeatherTimeWidget";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import React from "react";

export default function DashboardPage() {
  const metrics = useLiveMetrics(60000);

  return (
    <>
      <section className="col-span-6 flex flex-col items-center justify-center rounded-md border border-solid border-gray-200 dark:border-gray-800">
        <WeatherTimeWidget />
      </section>

      <section className="relative col-span-2 flex h-full flex-col rounded-md border border-solid border-gray-200 p-4 dark:border-gray-800">
        <CpuStats metrics={metrics} />
      </section>

      <section className="relative col-span-2 flex h-full flex-col rounded-md border border-solid border-gray-200 p-4 dark:border-gray-800">
        <MemoryStats metrics={metrics} />
      </section>

      <section className="relative col-span-2 flex h-full flex-col rounded-md border border-solid border-gray-200 p-4 dark:border-gray-800">
        <TempStats metrics={metrics} />
      </section>
    </>
  );
}

