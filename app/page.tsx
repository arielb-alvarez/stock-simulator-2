// page.tsx
import MainChart from "@/components/chart/Chart";
import ChartControls from "@/components/chart/ChartControls";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-shrink-0">
        <ChartControls />
      </div>
      
      {/* This container must have explicit height */}
      <div className="h-[calc(100vh-41px)]"> {/* Adjust based on ChartControls height */}
        <MainChart />
      </div>
    </main>
  );
}