// DrawingTools.tsx - Updated with right/left arrow icons and smaller trigger
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
  Settings, // Settings icon for reset
  ChevronsRight, // Right arrow for line tools
  ChevronsLeft // Left arrow for line tools
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
  const [containerHeight, setContainerHeight] = useState('100%');
  const [showLineTools, setShowLineTools] = useState(false);

  // Define line tools separately
  const lineTools = [
    { id: 'horizontalLine', icon: Minus, label: 'Horizontal', title: 'Horizontal Line' },
    { id: 'verticalLine', icon: MoveVertical, label: 'Vertical', title: 'Vertical Line' },
    { id: 'trendLine', icon: TrendingUp, label: 'Trend', title: 'Trend Line' },
  ];

  // Get current line tool (either selected or first one)
  const getCurrentLineTool = () => {
    // Check if activeTool is a line tool
    const isActiveToolLine = lineTools.some(tool => tool.id === activeTool);
    if (isActiveToolLine) {
      return lineTools.find(tool => tool.id === activeTool) || lineTools[0];
    }
    return lineTools[0];
  };

  const currentLineTool = getCurrentLineTool();

  // Handle line tool selection
  const handleLineToolSelect = (toolId: string) => {
    onToolSelect(toolId);
    setShowLineTools(false);
  };

  // Toggle line tools popup
  const toggleLineTools = () => {
    if (!showLineTools) {
      // If opening line tools, auto-select the first line tool if no line tool is currently active
      const isActiveToolLine = lineTools.some(tool => tool.id === activeTool);
      if (!isActiveToolLine) {
        onToolSelect(lineTools[0].id);
      }
    }
    setShowLineTools(!showLineTools);
  };

  // Auto-hide reset confirmation after 3 seconds
  useEffect(() => {
    if (showResetConfirm) {
      const timer = setTimeout(() => {
        setShowResetConfirm(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showResetConfirm]);

  // Auto-hide line tools popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.line-tools-container') && showLineTools) {
        setShowLineTools(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLineTools]);

  // Calculate container height to match chart container
  useEffect(() => {
    const calculateHeight = () => {
      // Get the chart container element
      const chartContainer = document.querySelector('[class*="min-h-0"]') || 
                             document.querySelector('.flex-1');
      
      if (chartContainer) {
        const rect = chartContainer.getBoundingClientRect();
        // Set height to match the chart container's height
        setContainerHeight(`${rect.height}px`);
      }
    };

    // Calculate initially
    calculateHeight();

    // Recalculate on resize
    window.addEventListener('resize', calculateHeight);
    
    // Recalculate when expanded state changes
    if (isExpanded) {
      // Small delay to ensure DOM is updated
      setTimeout(calculateHeight, 100);
    }

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, [isExpanded]);

  const handleResetClick = () => {
    if (showResetConfirm) {
      resetToDefaults();
      setShowResetConfirm(false);
      // Also reset the active tool
      onToolSelect('select');
      setShowLineTools(false);
    } else {
      setShowResetConfirm(true);
    }
  };

  // Other tools (excluding line tools)
  const otherTools = [
    { id: 'select', icon: MousePointer2, label: 'Select', title: 'Select and move drawings' },
    { id: 'fibonacci', icon: Wind, label: 'Fibonacci', title: 'Fibonacci Retracement' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', title: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle', title: 'Circle' },
  ];

  // Dynamic height for line tools popup (based on number of buttons)
  const lineToolsPopupHeight = lineTools.length * 40 + 20; // 40px per button + padding

  return (
    <>
      {/* Drawing Tools Container - Positioned absolutely within the chart container */}
      <div className="absolute left-0 top-0 h-full z-30 flex items-center">
        {/* Tools Panel - Only shown when expanded */}
        {isExpanded && (
          <div 
            className="flex flex-col w-10 md:w-12 bg-gray-800/95 border-r border-gray-700/50 backdrop-blur-sm"
            style={{ height: containerHeight }}
          >
            {/* Tools Section - Takes available space */}
            <div className="flex-1 flex flex-col py-2 md:py-3">
              <div className="flex flex-col items-center space-y-1 md:space-y-2">
                {/* Other tools first */}
                {otherTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onToolSelect(tool.id);
                      setShowTooltip(null);
                      setShowLineTools(false); // Close line tools if open
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

                {/* Line Tools Group */}
                <div className="relative line-tools-container">
                  {/* Main Line Tool Button */}
                  <button
                    onClick={() => handleLineToolSelect(currentLineTool.id)}
                    onMouseEnter={() => setShowTooltip('currentLineTool')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className={`
                      relative w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md
                      transition-all duration-150 hover:scale-105 active:scale-95
                      ${lineTools.some(tool => tool.id === activeTool)
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white'
                      }
                    `}
                    aria-label={currentLineTool.label}
                  >
                    <currentLineTool.icon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                    
                    {/* Tooltip */}
                    {showTooltip === 'currentLineTool' && (
                      <div className="hidden md:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                          {currentLineTool.title}
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Side Popup Trigger Button - Positioned absolutely to the right - Made smaller */}
                  <button
                    onClick={toggleLineTools}
                    className={`
                      absolute -right-1.5 top-1/2 transform -translate-y-1/2
                      w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center rounded-sm
                      transition-all duration-150 hover:scale-125 active:scale-95
                      ${showLineTools 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
                      }
                      ${lineTools.some(tool => tool.id === activeTool)
                        ? 'border border-blue-400/50' 
                        : ''
                      }
                      shadow-sm
                    `}
                    aria-label={showLineTools ? "Close line tools" : "Open line tools"}
                  >
                    {showLineTools ? (
                      <ChevronsLeft className="w-2 h-2 md:w-2.5 md:h-2.5" strokeWidth={2.5} />
                    ) : (
                      <ChevronsRight className="w-2 h-2 md:w-2.5 md:h-2.5" strokeWidth={2.5} />
                    )}
                  </button>

                  {/* Line Tools Side Popup */}
                  {showLineTools && (
                    <div 
                      className="absolute left-full top-0 ml-2 z-50"
                      style={{ height: `${lineToolsPopupHeight}px` }}
                    >
                      <div className="bg-gray-800/95 backdrop-blur-sm rounded-md border border-gray-700/50 shadow-xl py-2">
                        <div className="flex flex-col items-center space-y-1 px-1">
                          {lineTools.map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => handleLineToolSelect(tool.id)}
                              onMouseEnter={() => setShowTooltip(`line-${tool.id}`)}
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
                              
                              {/* Tooltip for line tools in popup */}
                              {showTooltip === `line-${tool.id}` && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none">
                                  <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                    {tool.title}
                                  </div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reset Button at Bottom */}
            <div className="py-2 border-t border-gray-700/50">
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
                  <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" strokeWidth={2} />
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