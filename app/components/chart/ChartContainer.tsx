'use client';
import { useRef } from 'react';
import { useChartLifecycle } from './hooks/useChartLifecycle';
import { useDrawingTools } from './hooks/useDrawingTools';
import Chart from './Chart';

export default function ChartContainer() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const {
    isLoading,
    error,
    lastUpdateTime,
    chartRef,
    forceChartRefresh
  } = useChartLifecycle(chartContainerRef);

  const {
    activeDrawingTool,
    handleDrawingToolSelect
  } = useDrawingTools(chartRef);

  return (
    <Chart
      chartContainerRef={chartContainerRef}
      isLoading={isLoading}
      error={error}
      lastUpdateTime={lastUpdateTime}
      activeDrawingTool={activeDrawingTool}
      onDrawingToolSelect={handleDrawingToolSelect}
      onForceRefresh={forceChartRefresh}
    />
  );
}