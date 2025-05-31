import Clock from "@/components/Clock";
import Weather from "@/components/Weather";
import CpuStats from "@/components/CpuStats";
import MemoryStats from "@/components/MemoryStats";
import TempStats from "@/components/TempStats";
import { fetchMetrics } from "@/lib/metrics";

export default async function DashboardPage() {
  const metrics = await fetchMetrics();

  return (
    <main className="grid grid-cols-1 md:grid-cols-6 gap-6 p-6 text-white bg-black min-h-screen">
      <section className="md:col-span-3 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <Weather />
      </section>
      <section className="md:col-span-3 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <Clock />
      </section>
      <section className="md:col-span-6 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <CpuStats metrics={metrics} />
      </section>
      <section className="md:col-span-6 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <MemoryStats metrics={metrics} />
      </section>
      <section className="md:col-span-6 bg-zinc-900 p-4 rounded-xl shadow-xl">
        <TempStats metrics={metrics} />
      </section>
    </main>
  );
}
