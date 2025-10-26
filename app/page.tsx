// page.tsx
import Chart from "@/components/chart/Chart";
import ChartControls from "@/components/chart/ChartControls";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Chart Controls - Fixed at top */}
      <div className="flex-shrink-0">
        <ChartControls />
      </div>
      
      {/* Chart - Takes remaining space */}
      <div className="flex-1 min-h-0">
        <Chart />
      </div>
    </main>
  );
}