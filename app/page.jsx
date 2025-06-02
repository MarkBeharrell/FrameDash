'use client';
import "@/lib/polyfills"; 

import WeatherTimeWidget from "@/components/WeatherTimeWidget";
import CpuStats from "@/components/CpuStats";
import MemoryStats from "@/components/MemoryStats";
import TempStats from "@/components/TempStats";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import React from 'react';

export default function DashboardPage() {
  const metrics = useLiveMetrics(5000);

  return (
    < >

<section className="md:col-span-6 p-6 rounded-md border border-solid border-gray-700">
  <WeatherTimeWidget />
</section>

<section className="md:col-span-2  p-6 rounded-md border border-solid border-gray-700 h-full flex flex-col">
  <CpuStats metrics={metrics} />
</section>

<section className="md:col-span-2 p-6 rounded-md border border-solid border-gray-700 h-full flex flex-col">
  <MemoryStats metrics={metrics} />
</section>

<section className="md:col-span-2 p-6 rounded-md border border-solid border-gray-700 h-full flex flex-col">
  <TempStats metrics={metrics} />
</section>
    </>
  );
}
