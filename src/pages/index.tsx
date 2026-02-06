import CLayoutCharts from '@/components/common/c-layout-charts'
import MainChart from '@/components/routes/chart'
import ChartControls from '@/components/routes/chart/ChartControls'

const CCharts = () => {

  return (
    <CLayoutCharts>
      <main className="min-h-screen bg-background flex flex-col">
        <div className="flex-shrink-0">
          <ChartControls />
        </div>

        {/* This container must have explicit height */}
        <div className="h-[calc(100vh-41px)]"> {/* Adjust based on ChartControls height */}
          <MainChart />
        </div>
      </main>
    </CLayoutCharts>
  )
}

export default CCharts