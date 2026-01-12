// DrawingTools.tsx - Updated with better positioning
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
      {/* Drawing Tools Panel */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30">
        {/* Main Tools Panel */}
        <div className={`
          flex transition-all duration-300 ease-in-out
          ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          {/* Tools Column */}
          <div className="flex flex-col w-12 bg-gray-800/95 border-r border-gray-700/50 backdrop-blur-sm rounded-r-lg shadow-lg">
            {/* Tools */}
            <div className="flex-1 flex flex-col items-center py-3 space-y-2">
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
                    relative w-8 h-8 flex items-center justify-center rounded-md
                    transition-all duration-150 hover:scale-105 active:scale-95
                    ${activeTool === tool.id 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white'
                    }
                  `}
                  aria-label={tool.label}
                >
                  <tool.icon size={16} strokeWidth={2} />
                  
                  {/* Tooltip */}
                  {showTooltip === tool.id && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                        {tool.title}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Reset Button at Bottom */}
            <div className="py-2 border-t border-gray-700/50">
              <button
                onClick={handleResetClick}
                onMouseEnter={() => setShowTooltip('reset')}
                onMouseLeave={() => setShowTooltip(null)}
                className={`
                  relative w-8 h-8 mx-auto flex items-center justify-center rounded-md
                  transition-all duration-150 hover:scale-105 active:scale-95
                  ${showResetConfirm 
                    ? 'bg-red-600/90 text-white animate-pulse' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white'
                  }
                `}
                aria-label="Reset settings"
              >
                {showResetConfirm ? (
                  <RotateCcw size={16} strokeWidth={2} className="animate-spin" />
                ) : (
                  <Settings size={16} strokeWidth={2} />
                )}
                
                {/* Tooltip */}
                {showTooltip === 'reset' && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                      {showResetConfirm ? 'Click to confirm reset' : 'Reset all settings'}
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="w-6 h-10 flex items-center justify-center bg-gray-800/90 hover:bg-gray-800 text-gray-400 hover:text-white rounded-r-md transition-colors self-center"
            aria-label="Collapse drawing tools"
          >
            <ChevronLeft size={12} strokeWidth={2} />
          </button>
        </div>

        {/* Small Trigger Button when collapsed */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-6 h-10 flex items-center justify-center bg-gray-800/90 hover:bg-gray-800 text-gray-400 hover:text-white rounded-r-md shadow-lg transition-all hover:scale-105"
            aria-label="Expand drawing tools"
          >
            <ChevronRight size={12} strokeWidth={2} />
          </button>
        )}
      </div>
    </>
  );
};

export default DrawingTools;