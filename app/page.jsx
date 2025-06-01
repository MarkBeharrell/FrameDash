import WeatherTimeWidget from "@/components/WeatherTimeWidget";
import CpuStats from "@/components/CpuStats";
import MemoryStats from "@/components/MemoryStats";
import TempStats from "@/components/TempStats";
import { fetchMetrics } from "@/lib/fetchMetrics";

export default async function DashboardPage() {
  const metrics = await fetchMetrics();

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
