// DrawingTools.tsx - Updated with responsive design
'use client';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import {
  MousePointer2, // Select
  Minus, // Horizontal Line
  MoveVertical, // Vertical Line
  TrendingUp, // Trend Line
  Wind, // Fibonacci
  Square, // Rectangle
  Circle, // Circle
  RotateCcw, // Reset/Confirm
  ChevronRight, // Expand arrow
  ChevronLeft, // Collapse arrow
  Settings // Settings icon for reset
} from 'lucide-react';

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ onToolSelect, activeTool }) => {
  const { config, resetToDefaults } = useGlobalContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Auto-hide reset confirmation after 3 seconds
  useEffect(() => {
    if (showResetConfirm) {
      const timer = setTimeout(() => {
        setShowResetConfirm(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showResetConfirm]);

  const handleResetClick = () => {
    if (showResetConfirm) {
      resetToDefaults();
      setShowResetConfirm(false);
      // Also reset the active tool
      onToolSelect('select');
    } else {
      setShowResetConfirm(true);
    }
  };

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select', title: 'Select and move drawings' },
    { id: 'horizontalLine', icon: Minus, label: 'Horizontal', title: 'Horizontal Line' },
    { id: 'verticalLine', icon: MoveVertical, label: 'Vertical', title: 'Vertical Line' },
    { id: 'trendLine', icon: TrendingUp, label: 'Trend', title: 'Trend Line' },
    { id: 'fibonacci', icon: Wind, label: 'Fibonacci', title: 'Fibonacci Retracement' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', title: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle', title: 'Circle' },
  ];

  return (
    <>
      {/* Drawing Tools Container */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 flex items-center">
        {/* Tools Panel - Only shown when expanded */}
        {isExpanded && (
          <div className="flex flex-col w-10 md:w-12 bg-gray-800/95 border-r border-gray-700/50 backdrop-blur-sm rounded-l-lg shadow-lg">
            {/* Tools */}
            <div className="flex-1 flex flex-col items-center py-2 md:py-3 space-y-1 md:space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onToolSelect(tool.id);
                    setShowTooltip(null);
                  }}
                  onMouseEnter={() => setShowTooltip(tool.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className={`
                    relative w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md
                    transition-all duration-150 hover:scale-105 active:scale-95
                    ${activeTool === tool.id 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white'
                    }
                  `}
                  aria-label={tool.label}
                >
                  <tool.icon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                  
                  {/* Tooltip - Hidden on mobile, shown on desktop */}
                  {showTooltip === tool.id && (
                    <div className="hidden md:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                        {tool.title}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Reset Button at Bottom */}
            <div className="py-1 md:py-2 border-t border-gray-700/50">
              <button
                onClick={handleResetClick}
                onMouseEnter={() => setShowTooltip('reset')}
                onMouseLeave={() => setShowTooltip(null)}
                className={`
                  relative w-7 h-7 md:w-8 md:h-8 mx-auto flex items-center justify-center rounded-md
                  transition-all duration-150 hover:scale-105 active:scale-95
                  ${showResetConfirm 
                    ? 'bg-red-600/90 text-white animate-pulse' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white'
                  }
                `}
                aria-label="Reset settings"
              >
                {showResetConfirm ? (
                  <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                ) : (
                  <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                )}
                
                {/* Tooltip - Hidden on mobile, shown on desktop */}
                {showTooltip === 'reset' && (
                  <div className="hidden md:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                      {showResetConfirm ? 'Click to confirm reset' : 'Reset all settings'}
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Single Trigger Button - Responsive sizing */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-5 h-8 md:w-6 md:h-10 flex items-center justify-center
            transition-all duration-200 hover:scale-105 active:scale-95
            ${isExpanded 
              ? 'bg-gray-800/90 hover:bg-gray-800 text-gray-400 hover:text-white rounded-r-md' 
              : 'bg-gray-800/90 hover:bg-gray-800 text-gray-400 hover:text-white rounded-r-md shadow-lg'
            }
          `}
          aria-label={isExpanded ? "Collapse drawing tools" : "Expand drawing tools"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2} />
          ) : (
            <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2} />
          )}
        </button>
      </div>
    </>
  );
};

export default DrawingTools;