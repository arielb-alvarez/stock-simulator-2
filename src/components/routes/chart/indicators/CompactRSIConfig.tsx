// components/chart/indicators/CompactRSIConfig.tsx
import React from 'react';
import { RSIConfig } from '@/context/types';

interface CompactRSIConfigProps {
  rsiConfigs: RSIConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactRSIConfig: React.FC<CompactRSIConfigProps> = React.memo(({
  rsiConfigs,
  onToggle,
  onPeriodChange,
  onLineSizeChange,
  onColorChange
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">RSI</h3>
      <div className="text-sm text-gray-400">
        {rsiConfigs.filter(rsi => rsi.show).length} active
      </div>
    </div>

    <div className="space-y-3">
      {rsiConfigs.map((rsiConfig) => (
        <div key={rsiConfig.id} className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
          <input
            type="checkbox"
            checked={rsiConfig.show}
            onChange={() => onToggle(rsiConfig.id)}
            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
          
          <span className="text-sm text-white font-medium min-w-[60px]">RSI</span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Period:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={rsiConfig.period}
              onChange={(e) => onPeriodChange(rsiConfig.id, parseInt(e.target.value) || 14)}
              className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Width:</span>
            <input
              type="number"
              min="0.5"
              max="5"
              step="0.5"
              value={rsiConfig.lineSize}
              onChange={(e) => onLineSizeChange(rsiConfig.id, parseFloat(e.target.value) || 1.5)}
              className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={rsiConfig.lineColor}
              onChange={(e) => onColorChange(rsiConfig.id, e.target.value)}
              className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
));

CompactRSIConfig.displayName = 'CompactRSIConfig';