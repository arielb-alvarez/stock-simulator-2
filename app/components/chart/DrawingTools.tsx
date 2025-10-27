// components/chart/DrawingTools.tsx
'use client';
import { useState } from 'react';

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
}

// Icons
const ArrowRightIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <path d="M2 1l3 3-3 3" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <path d="M6 1L3 4l3 3" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);

const LineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 13L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HorizontalLineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const VerticalLineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 13L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RectangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const CircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const TextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <text x="3" y="12" fontSize="9" fontFamily="Arial, sans-serif">A</text>
  </svg>
);

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

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      onToolSelect('');
    } else {
      onToolSelect(toolId);
    }
  };

  return (
    <>
      {/* Tools Panel */}
      <div
        className={`
          absolute left-0 top-0 z-10 h-full
          bg-[#0c0e14] border-r border-gray-700
          transition-transform duration-200 ease-in-out
          flex flex-col items-center py-3 space-y-1
          ${isOpen ? 'translate-x-0 w-9' : '-translate-x-full w-9'}
        `}
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`
                w-7 h-7 rounded flex items-center justify-center
                transition-all duration-150 ease-in-out
                ${isActive 
                  ? 'bg-bnb-yellow text-bnb-dark' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }
              `}
              title={tool.name}
            >
              <Icon />
            </button>
          );
        })}
      </div>

      {/* Trigger Button - Very small */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute bottom-20 z-20 flex items-center justify-center
          transition-all duration-200 ease-in-out
          bg-[#0c0e14] border border-gray-600
          text-gray-300 hover:bg-gray-700 hover:text-white
          shadow-lg w-3 h-10
          ${isOpen 
            ? 'left-9 rounded-r-sm border-l-0'  // Attached to right of open panel
            : 'left-1 rounded'   // At left edge when closed
          }
        `}
        title={isOpen ? "Hide Drawing Tools" : "Show Drawing Tools"}
      >
        {isOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
      </button>
    </>
  );
}