// components/chart/TimeFrameSelector.tsx
import { forwardRef, useState } from 'react';
import { ChevronDown, EditIcon } from './ChartIcons';

interface TimeFrameSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  currentInterval: string;
  pinnedTimeFrames: string[];
  isCurrentTimeFramePinned: boolean;
  displayTimeFrames: Array<{ label: string; value: string }>;
  availableTimeFrames: Array<{ label: string; value: string }>;
  onTimeFrameChange: (timeFrame: string) => void;
  onTogglePinned: (timeFrame: string) => void;
}

// eslint-disable-next-line react/display-name
export const TimeFrameSelector = forwardRef<HTMLDivElement, TimeFrameSelectorProps>(
  ({
    isOpen,
    onToggle,
    currentInterval,
    pinnedTimeFrames,
    isCurrentTimeFramePinned,
    displayTimeFrames,
    availableTimeFrames,
    onTimeFrameChange,
    onTogglePinned
  }, ref) => {
    const [isEditingPinned, setIsEditingPinned] = useState(false);

    return (
      <div className="relative" ref={ref}>
        <div className="flex items-center bg-gray-700/30 rounded-md p-1">
          {displayTimeFrames.map((timeFrame) => (
            <button
              key={timeFrame.value}
              onClick={() => onTimeFrameChange(timeFrame.value)}
              className={`
                px-2 py-1 text-xs font-medium transition-all min-w-[36px] rounded
                ${currentInterval === timeFrame.value
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/30'
                }
              `}
            >
              {timeFrame.label}
            </button>
          ))}
          
          {!isCurrentTimeFramePinned && currentInterval && (
            <button
              onClick={() => onTimeFrameChange(currentInterval)}
              className="px-2 py-1 text-xs font-medium min-w-[36px] rounded bg-yellow-500/20 text-yellow-400"
            >
              {displayTimeFrames.find(tf => tf.value === currentInterval)?.label || currentInterval}
            </button>
          )}
          
          <button
            onClick={onToggle}
            className={`
              flex items-center justify-center px-2 py-1 transition-all
              text-gray-400 hover:text-gray-200 rounded hover:bg-gray-600/30
              ${isOpen ? 'bg-gray-600/30' : ''}
            `}
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 min-w-[200px]">
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
              {pinnedTimeFrames.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">Pinned</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {displayTimeFrames.map((timeFrame) => (
                      <button
                        key={timeFrame.value}
                        onClick={() => isEditingPinned 
                          ? onTogglePinned(timeFrame.value)
                          : onTimeFrameChange(timeFrame.value)
                        }
                        className={`
                          flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all
                          ${isEditingPinned
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : currentInterval === timeFrame.value
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                          }
                        `}
                      >
                        {isEditingPinned ? `− ${timeFrame.label}` : timeFrame.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableTimeFrames.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {isEditingPinned ? 'Click + to pin' : 'Available'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {availableTimeFrames.map((timeFrame) => (
                      <button
                        key={timeFrame.value}
                        onClick={() => isEditingPinned 
                          ? onTogglePinned(timeFrame.value)
                          : onTimeFrameChange(timeFrame.value)
                        }
                        className={`
                          flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all
                          ${isEditingPinned
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : currentInterval === timeFrame.value
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
    );
  }
);