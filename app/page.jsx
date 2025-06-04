"use client";
import "@/lib/polyfills";

import WeatherTimeWidget from "@/components/WeatherTimeWidget";
import CpuStats from "@/components/CpuStats";
import MemoryStats from "@/components/MemoryStats";
import TempStats from "@/components/TempStats";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import React from "react";

export default function DashboardPage() {
  const metrics = useLiveMetrics(5000);

  return (
    <>
      <section className="col-span-6 flex flex-col items-center justify-center rounded-md border border-solid border-gray-700">
        <WeatherTimeWidget />
      </section>

      <section className="col-span-2 flex h-full flex-col rounded-md border border-solid border-gray-700 p-4">
        <CpuStats metrics={metrics} />
      </section>

      <section className="col-span-2 flex h-full flex-col rounded-md border border-solid border-gray-700 p-4">
        <MemoryStats metrics={metrics} />
      </section>

      <section className="col-span-2 flex h-full flex-col rounded-md border border-solid border-gray-700 p-4">
        <TempStats metrics={metrics} />
      </section>
    </>
  );
}
