'use client';

import WeatherTimeWidget from "@/components/WeatherTimeWidget";
import CpuStats from "@/components/CpuStats";
import MemoryStats from "@/components/MemoryStats";
import TempStats from "@/components/TempStats";
import { useLiveMetrics } from "@/lib/useLiveMetrics";

export default function DashboardPage() {
  const metrics = useLiveMetrics(5000);

  return (
    <>
      <section className="md:col-span-6 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <WeatherTimeWidget />
      </section>
      <section className="md:col-span-2 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <CpuStats metrics={metrics} />
      </section>
      <section className="md:col-span-2 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <MemoryStats metrics={metrics} />
      </section>
      <section className="md:col-span-2 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <TempStats metrics={metrics} />
      </section>
    </>
  );
}
