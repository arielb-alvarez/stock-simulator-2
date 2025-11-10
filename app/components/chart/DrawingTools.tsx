// components/chart/DrawingTools.tsx
'use client';
import React from 'react';
import { useGlobalContext } from '@/context/GlobalContext';

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ onToolSelect, activeTool }) => {
  const { config } = useGlobalContext();

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-800 border-b border-gray-700">
      {/* Drawing Tools */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToolSelect('select')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Select
        </button>
        <button
          onClick={() => onToolSelect('horizontalLine')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'horizontalLine' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Horizontal
        </button>
        <button
          onClick={() => onToolSelect('verticalLine')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'verticalLine' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Vertical
        </button>
        <button
          onClick={() => onToolSelect('trendLine')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'trendLine' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Trend Line
        </button>
        <button
          onClick={() => onToolSelect('fibonacci')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'fibonacci' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Fibonacci
        </button>
        <button
          onClick={() => onToolSelect('rectangle')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={() => onToolSelect('circle')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Circle
        </button>
      </div>

      {/* RSI Toggles */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-600">
        <span className="text-xs text-gray-400 mr-1">RSI:</span>
        {config.indicators.rsi.map((rsi) => (
          <button
            key={rsi.id}
            onClick={() => onToolSelect(`rsi-toggle-${rsi.id}`)}
            className={`px-2 py-1 rounded text-xs ${
              rsi.show ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${
              activeTool === `rsi-toggle-${rsi.id}` ? 'ring-2 ring-blue-400' : ''
            }`}
            style={{ borderLeft: `3px solid ${rsi.lineColor}` }}
          >
            {rsi.name}
          </button>
        ))}
      </div>

      {/* Volume Toggle */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-600">
        <span className="text-xs text-gray-400 mr-1">Volume:</span>
        {config.indicators.volume.map((volume) => (
          <button
            key={volume.id}
            onClick={() => onToolSelect(`volume-toggle-${volume.id}`)}
            className={`px-2 py-1 rounded text-xs ${
              volume.show ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${
              activeTool === `volume-toggle-${volume.id}` ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            {volume.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrawingTools;