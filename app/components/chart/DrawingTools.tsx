// components/chart/DrawingTools.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ onToolSelect, activeTool }) => {
  const { config, resetToDefaults } = useGlobalContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-800 border-b border-gray-700">
      {/* Drawing Tools */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 mr-1">Tools:</span>
        <button
          onClick={() => onToolSelect('select')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Select and move drawings"
        >
          Select
        </button>
        <button
          onClick={() => onToolSelect('horizontalLine')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'horizontalLine' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Horizontal Line"
        >
          Horizontal
        </button>
        <button
          onClick={() => onToolSelect('verticalLine')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'verticalLine' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Vertical Line"
        >
          Vertical
        </button>
        <button
          onClick={() => onToolSelect('trendLine')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'trendLine' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Trend Line"
        >
          Trend Line
        </button>
        <button
          onClick={() => onToolSelect('fibonacci')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'fibonacci' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Fibonacci Retracement"
        >
          Fibonacci
        </button>
        <button
          onClick={() => onToolSelect('rectangle')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Rectangle"
        >
          Rectangle
        </button>
        <button
          onClick={() => onToolSelect('circle')}
          className={`px-3 py-1 rounded text-sm ${
            activeTool === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Circle"
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
            title={`${rsi.name} (Period: ${rsi.period}) - ${rsi.show ? 'Visible' : 'Hidden'}`}
          >
            {rsi.name}
            {rsi.show && (
              <span className="ml-1 text-xs">✓</span>
            )}
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
            // title={`${volume.name} ${volume.show ? `with MA${volume.maPeriod}` : ''} - ${volume.show ? 'Visible' : 'Hidden'}`}
          >
            {volume.name}
            {volume.show && (
              <span className="ml-1 text-xs">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-600">
        <button
          onClick={handleResetClick}
          className={`px-3 py-1 rounded text-sm ${
            showResetConfirm 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Reset all settings to defaults"
        >
          {showResetConfirm ? 'Confirm Reset' : 'Reset Settings'}
        </button>
        {showResetConfirm && (
          <span className="text-xs text-yellow-400 ml-1">
            Click again to confirm
          </span>
        )}
      </div>

      {/* Persistence Status Indicator */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-600">
        <div className="flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          Auto-saved
        </div>
      </div>
    </div>
  );
};

export default DrawingTools;