// components/chart/ChartControls.tsx
'use client';
import { useGlobalContext, ChartType } from '@/context/GlobalContext';
import { useState, useRef, useEffect } from 'react';
import { CandleIcon, LineIcon, AreaIcon, BarIcon, ChevronDown, EditIcon, IndicatorsIcon } from './ChartIcons';
import { TimeFrameSelector } from '@/components/chart/TimeFrameSelector';
import { ChartTypeSelector } from '@/components/chart/ChartTypeSelector';
import { IndicatorsDialog } from '@/app/components/chart/indicators/IndicatorsDialog';
import { usePinnedTimeFrames } from '@/hooks/usePinnedTimeFrames';
import { useDropdown } from '@/hooks/useDropdown';

export default function ChartControls() {
  const { config, updateConfig  } = useGlobalContext();
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  
  const {
    pinnedTimeFrames,
    isCurrentTimeFramePinned,
    getDisplayTimeFrames,
    getAvailableTimeFrames,
    togglePinnedTimeFrame
  } = usePinnedTimeFrames(config.interval);

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
    updateConfig({ chartType });
  };

  const handleTimeFrameChange = (timeFrame: string) => {
    updateConfig({ interval: timeFrame });
  }

  return (
    <>
      <div className="chart-controls p-1 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <TimeFrameSelector
            isOpen={isTimeFrameOpen}
            onToggle={toggleTimeFrame}
            ref={timeFrameRef}
            currentInterval={config.interval}
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
            currentChartType={config.chartType}
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