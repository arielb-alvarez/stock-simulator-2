// components/chart/ChartControls.tsx
'use client';
import { useGlobalContext, ChartType } from '@/context/GlobalContext';
import { useState, useRef, useEffect } from 'react';
import { CandleIcon, LineIcon, AreaIcon, BarIcon, ChevronDown, EditIcon } from './ChartIcons';

const ALL_TIME_FRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
  { label: '1M', value: '1M' },
];

const CHART_TYPES: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'candle', label: 'Candlestick', icon: <CandleIcon /> },
  { value: 'line', label: 'Line', icon: <LineIcon /> },
  { value: 'area', label: 'Area', icon: <AreaIcon /> },
  { value: 'bar', label: 'Bar', icon: <BarIcon /> },
];

export default function ChartControls() {
  const { config, updateConfig } = useGlobalContext();
  const [isChartTypeOpen, setIsChartTypeOpen] = useState(false);
  const [isTimeFrameOpen, setIsTimeFrameOpen] = useState(false);
  const [isEditingPinned, setIsEditingPinned] = useState(false);
  const [pinnedTimeFrames, setPinnedTimeFrames] = useState<string[]>(['15m', '1h', '4h', '1d', '1w']);
  
  const chartTypeRef = useRef<HTMLDivElement>(null);
  const timeFrameRef = useRef<HTMLDivElement>(null);

  // Track if current timeframe is pinned
  const isCurrentTimeFramePinned = pinnedTimeFrames.includes(config.interval);

  // Get displayed timeframes - only pinned timeframes are always displayed
  const getDisplayTimeFrames = () => {
    return ALL_TIME_FRAMES.filter(tf => pinnedTimeFrames.includes(tf.value));
  };

  const getAvailableTimeFrames = () => {
    return ALL_TIME_FRAMES.filter(tf => !pinnedTimeFrames.includes(tf.value));
  };

  const handleTimeFrameChange = (timeFrame: string) => {
    updateConfig({ interval: timeFrame });
    setIsTimeFrameOpen(false);
    setIsEditingPinned(false);
  };

  const handleChartTypeChange = (chartType: ChartType) => {
    updateConfig({ chartType });
    setIsChartTypeOpen(false);
  };

  const togglePinnedTimeFrame = (timeFrame: string) => {
    if (pinnedTimeFrames.includes(timeFrame)) {
      setPinnedTimeFrames(prev => prev.filter(tf => tf !== timeFrame));
    } else {
      setPinnedTimeFrames(prev => [...prev, timeFrame]);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartTypeRef.current && !chartTypeRef.current.contains(event.target as Node)) {
        setIsChartTypeOpen(false);
      }
      if (timeFrameRef.current && !timeFrameRef.current.contains(event.target as Node)) {
        setIsTimeFrameOpen(false);
        setIsEditingPinned(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentChartType = CHART_TYPES.find(type => type.value === config.chartType);

  return (
    <div className="chart-controls">
      <div className="flex items-center gap-4">
        {/* Time Frame Selector */}
        <div className="relative" ref={timeFrameRef}>
          <div className="flex items-center bg-gray-700/30 rounded-md p-1">
            {/* Display only pinned timeframes */}
            {getDisplayTimeFrames().map((timeFrame) => (
              <button
                key={timeFrame.value}
                onClick={() => handleTimeFrameChange(timeFrame.value)}
                className={`
                  px-2 py-1 text-xs font-medium transition-all min-w-[36px] rounded
                  ${config.interval === timeFrame.value
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/30'
                  }
                `}
              >
                {timeFrame.label}
              </button>
            ))}
            
            {/* Current unpinned timeframe (if any) displayed before dropdown */}
            {!isCurrentTimeFramePinned && config.interval && (
              <button
                onClick={() => handleTimeFrameChange(config.interval)}
                className="px-2 py-1 text-xs font-medium min-w-[36px] rounded bg-yellow-500/20 text-yellow-400"
              >
                {ALL_TIME_FRAMES.find(tf => tf.value === config.interval)?.label || config.interval}
              </button>
            )}
            
            {/* Dropdown Trigger */}
            <button
              onClick={() => setIsTimeFrameOpen(!isTimeFrameOpen)}
              className={`
                flex items-center justify-center px-2 py-1 transition-all
                text-gray-400 hover:text-gray-200 rounded hover:bg-gray-600/30
                ${isTimeFrameOpen ? 'bg-gray-600/30' : ''}
              `}
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Timeframe Dropdown Menu */}
          {isTimeFrameOpen && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 min-w-[200px]">
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <span className="text-sm font-medium text-gray-300">Timeframes</span>
                <button
                  onClick={() => setIsEditingPinned(!isEditingPinned)}
                  className={`
                    flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all
                    ${isEditingPinned 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }
                  `}
                >
                  <EditIcon className="w-3 h-3" />
                  {isEditingPinned ? 'Done' : 'Edit'}
                </button>
              </div>

              <div className="p-2">
                {/* Pinned Timeframes Section */}
                {pinnedTimeFrames.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">Pinned</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {ALL_TIME_FRAMES.filter(tf => pinnedTimeFrames.includes(tf.value)).map((timeFrame) => (
                        <button
                          key={timeFrame.value}
                          onClick={() => isEditingPinned 
                            ? togglePinnedTimeFrame(timeFrame.value)
                            : handleTimeFrameChange(timeFrame.value)
                          }
                          className={`
                            flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all
                            ${isEditingPinned
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : config.interval === timeFrame.value
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                            }
                          `}
                        >
                          {isEditingPinned ? (
                            <span className="text-sm">− {timeFrame.label}</span>
                          ) : (
                            timeFrame.label
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Timeframes Section */}
                {getAvailableTimeFrames().length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">
                        {isEditingPinned ? 'Click + to pin' : 'Available'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {getAvailableTimeFrames().map((timeFrame) => (
                        <button
                          key={timeFrame.value}
                          onClick={() => isEditingPinned 
                            ? togglePinnedTimeFrame(timeFrame.value)
                            : handleTimeFrameChange(timeFrame.value)
                          }
                          className={`
                            flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all
                            ${isEditingPinned
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : config.interval === timeFrame.value
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                            }
                          `}
                        >
                          {isEditingPinned ? `+ ${timeFrame.label}` : timeFrame.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chart Type Selector */}
        <div className="relative" ref={chartTypeRef}>
          <button
            onClick={() => setIsChartTypeOpen(!isChartTypeOpen)}
            className={`
              flex items-center gap-2 px-3 py-2
              text-sm font-medium transition-all hover:bg-gray-700/30 rounded-md
              ${isChartTypeOpen ? 'bg-gray-700/30' : ''}
            `}
            title={currentChartType?.label}
          >
            <span className="text-gray-300">
              {currentChartType?.icon}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isChartTypeOpen && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 p-2 min-w-[140px]">
              <div className="flex flex-col gap-1">
                {CHART_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleChartTypeChange(type.value)}
                    className={`
                      flex items-center gap-3 p-2 rounded-md transition-all text-sm
                      hover:bg-gray-700/50 w-full text-left
                      ${config.chartType === type.value
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'text-gray-300 hover:text-gray-200'
                      }
                    `}
                  >
                    <span className="text-gray-300 flex-shrink-0">
                      {type.icon}
                    </span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}