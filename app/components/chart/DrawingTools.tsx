// components/chart/DrawingTools.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
  LineIcon,
  HorizontalLineIcon,
  VerticalLineIcon,
  RayIcon,
  RectangleIcon,
  CircleIcon,
  TextIcon
} from './DrawingToolIcons';

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
  showRSI?: boolean; // This now comes from context
}

const tools = [
  { id: 'line', name: 'Line', icon: LineIcon },
  { id: 'horizontal-line', name: 'Horizontal Line', icon: HorizontalLineIcon },
  { id: 'vertical-line', name: 'Vertical Line', icon: VerticalLineIcon },
  { id: 'ray', name: 'Ray', icon: RayIcon },
  { id: 'rectangle', name: 'Rectangle', icon: RectangleIcon },
  { id: 'circle', name: 'Circle', icon: CircleIcon },
  { id: 'text', name: 'Text', icon: TextIcon },
];

export default function DrawingTools({ onToolSelect, activeTool }: DrawingToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      onToolSelect('');
    } else {
      onToolSelect(toolId);
    }
    setIsPopupOpen(false);
  };

  // Handle right-click to clear selected tool
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTool) {
      onToolSelect('');
      setIsPopupOpen(false);
    }
  };

  const getCurrentToolIcon = () => {
    const currentTool = tools.find(tool => tool.id === activeTool);
    if (currentTool) {
      const Icon = currentTool.icon;
      return <Icon />;
    }
    return <LineIcon />;
  };

  return (
    <>
      {/* Tools Panel */}
      <div
        className={`
          absolute left-0 top-0 z-10 h-full
          bg-[#0c0e14] border-r border-gray-700
          transition-transform duration-200 ease-in-out
          flex flex-col items-center py-3 w-10
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onContextMenu={handleRightClick} // Add right-click handler to the entire panel
      >
        {/* Main Line Button Container */}
        <div className="relative pr-2">
          {/* Main Line Button */}
          <button
            onClick={() => {
              if (activeTool) {
                onToolSelect('');
              } else {
                onToolSelect('line');
              }
            }}
            onContextMenu={handleRightClick} // Add right-click handler to main button
            className={`
              w-7 h-7 rounded flex items-center justify-center
              transition-all duration-150 ease-in-out
              ${activeTool 
                ? 'bg-bnb-yellow text-bnb-dark' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }
            `}
            title={activeTool ? `Active: ${tools.find(t => t.id === activeTool)?.name} (Right-click to clear)` : 'Line Tool'}
          >
            {getCurrentToolIcon()}
          </button>

          {/* Line Trigger Button - positioned to the right of main button */}
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            onContextMenu={handleRightClick} // Add right-click handler to trigger button
            className={`
              absolute right-0 top-1/2 transform -translate-y-1/2
              w-3 h-6 flex items-center justify-center
              text-gray-300 hover:bg-gray-700 hover:text-white
              transition-all duration-200 ease-in-out
              rounded
              ${isPopupOpen 
                ? 'bg-gray-700' 
                : 'bg-[#0c0e14]'
              }
            `}
            title="Show drawing tools"
          >
            {isPopupOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
          </button>
        </div>
      </div>

      {/* Tools Popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute left-[42px] top-3 bg-[#0c0e14] border border-gray-600 rounded shadow-lg py-2 z-30"
          onContextMenu={handleRightClick} // Add right-click handler to popup
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleToolClick('line')}
              onContextMenu={handleRightClick} // Add right-click handler to tool button
              className={`
                w-full px-3 py-2 flex items-center gap-2
                transition-all duration-150 ease-in-out
                ${activeTool === 'line' 
                  ? 'bg-bnb-yellow text-bnb-dark' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }
              `}
              title="Trend Line (Right-click to clear)"
            >
              <LineIcon />
              <span className="text-xs whitespace-nowrap">Trend Line</span>
            </button>
          </div>
        </div>
      )}

      {/* Original Sidebar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={handleRightClick} // Add right-click handler to sidebar trigger
        className={`
          absolute bottom-20 z-20 flex items-center justify-center
          transition-all duration-200 ease-in-out
          bg-[#0c0e14] border border-gray-600
          text-gray-300 hover:bg-gray-700 hover:text-white
          shadow-lg w-3 h-10 rounded
          ${isOpen 
            ? 'left-8'  // Attached to right of open panel
            : 'left-1'   // At left edge when closed
          }
        `}
        title={isOpen ? "Hide Drawing Tools" : "Show Drawing Tools"}
      >
        {isOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
      </button>
    </>
  );
}