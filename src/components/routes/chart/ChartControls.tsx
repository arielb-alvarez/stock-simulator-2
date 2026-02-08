// components/chart/ChartControls.tsx
'use client';
import { useGlobalContext } from '@/context/GlobalContext';
import { ChartType } from '@/context/types';
import { useState } from 'react';
import { IndicatorsIcon } from './ChartIcons';
import { usePinnedTimeFrames } from '@/hooks/routes/charts/usePinnedTimeFrames';
import { useDropdown } from '@/hooks/routes/charts/useDropdown';
import { ChartTypeSelector } from './ChartTypeSelector';
import { IndicatorsDialog } from './indicators/IndicatorsDialog';
import { TimeFrameSelector } from './TimeFrameSelector';

export default function ChartControls() {
  const context = useGlobalContext();
  
  // Check if context is available
  if (!context) {
    console.error('GlobalContext is not available');
    return (
      <div className="chart-controls p-1 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-gray-700/50 animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-gray-700/50 animate-pulse rounded-md"></div>
          <div className="h-10 w-10 bg-gray-700/50 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  const { config, updateConfig, updateChartType } = context;
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  
  // Check if config exists before using it
  if (!config) {
    return (
      <div className="chart-controls p-1 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-gray-700/50 animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-gray-700/50 animate-pulse rounded-md"></div>
          <div className="h-10 w-10 bg-gray-700/50 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  // Provide default values if they don't exist
  const interval = config.interval || '1m';
  const chartType = config.chartType || 'candlestick';

  const {
    pinnedTimeFrames,
    isCurrentTimeFramePinned,
    getDisplayTimeFrames,
    getAvailableTimeFrames,
    togglePinnedTimeFrame
  } = usePinnedTimeFrames(interval);

  const {
    isOpen: isChartTypeOpen,
    toggle: toggleChartType,
    ref: chartTypeRef
  } = useDropdown();

  const {
    isOpen: isTimeFrameOpen,
    toggle: toggleTimeFrame,
    ref: timeFrameRef
  } = useDropdown();

  const handleChartTypeChange = (chartType: ChartType) => {
    if (updateChartType) {
      updateChartType(chartType);
    }
  };

  const handleTimeFrameChange = (timeFrame: string) => {
    if (updateConfig) {
      updateConfig({ ...config, interval: timeFrame });
    }
  }

  return (
    <>
      <div className="chart-controls p-1 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <TimeFrameSelector
            isOpen={isTimeFrameOpen}
            onToggle={toggleTimeFrame}
            ref={timeFrameRef}
            currentInterval={interval}
            pinnedTimeFrames={pinnedTimeFrames}
            isCurrentTimeFramePinned={isCurrentTimeFramePinned}
            displayTimeFrames={getDisplayTimeFrames()}
            availableTimeFrames={getAvailableTimeFrames()}
            onTimeFrameChange={handleTimeFrameChange}
            onTogglePinned={togglePinnedTimeFrame}
          />

          <ChartTypeSelector
            isOpen={isChartTypeOpen}
            onToggle={toggleChartType}
            ref={chartTypeRef}
            currentChartType={chartType}
            onChartTypeChange={handleChartTypeChange}
          />

          <button
            onClick={() => setIsIndicatorsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-md transition-all"
          >
            <IndicatorsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <IndicatorsDialog
        isOpen={isIndicatorsOpen}
        onClose={() => setIsIndicatorsOpen(false)}
      />
    </>
  );
}