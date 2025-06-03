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
      <section className="col-span-6 rounded-md border border-solid border-gray-700 flex flex-col justify-center items-center">
        <WeatherTimeWidget />
      </section>

      <section className="col-span-2 p-4 rounded-md border border-solid border-gray-700 h-full flex flex-col">
        <CpuStats metrics={metrics} />
      </section>

      <section className="col-span-2 p-4 rounded-md border border-solid border-gray-700 h-full flex flex-col">
        <MemoryStats metrics={metrics} />
      </section>

      <section className="col-span-2 p-4 rounded-md border border-solid border-gray-700 h-full flex flex-col">
        <TempStats metrics={metrics} />
      </section>
    </>
  );
}






