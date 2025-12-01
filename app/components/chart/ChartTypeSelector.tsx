// components/chart/ChartTypeSelector.tsx
import { forwardRef } from 'react';
import { ChartType } from '@/context/GlobalContext';
import { CandleIcon, LineIcon, AreaIcon, BarIcon, ChevronDown } from './ChartIcons';

const CHART_TYPES: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'candle', label: 'Candlestick', icon: <CandleIcon /> },
  { value: 'line', label: 'Line', icon: <LineIcon /> },
  { value: 'area', label: 'Area', icon: <AreaIcon /> },
  { value: 'bar', label: 'Bar', icon: <BarIcon /> },
];

interface ChartTypeSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  currentChartType: ChartType;
  onChartTypeChange: (chartType: ChartType) => void;
}

// eslint-disable-next-line react/display-name
export const ChartTypeSelector = forwardRef<HTMLDivElement, ChartTypeSelectorProps>(
  ({ isOpen, onToggle, currentChartType, onChartTypeChange }, ref) => {
    const currentChartTypeConfig = CHART_TYPES.find(type => type.value === currentChartType);

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={onToggle}
          className={`
            flex items-center gap-2 px-3 py-2
            text-sm font-medium transition-all hover:bg-gray-700/30 rounded-md
            ${isOpen ? 'bg-gray-700/30' : ''}
          `}
          title={currentChartTypeConfig?.label}
        >
          <span className="text-gray-300">
            {currentChartTypeConfig?.icon}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 p-2 min-w-[140px]">
            <div className="flex flex-col gap-1">
              {CHART_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => onChartTypeChange(type.value)}
                  className={`
                    flex items-center gap-3 p-2 rounded-md transition-all text-sm
                    hover:bg-gray-700/50 w-full text-left
                    ${currentChartType === type.value
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
    );
  }
);