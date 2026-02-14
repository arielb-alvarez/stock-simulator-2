// components/routes/chart/indicators/CompactMTMConfig.tsx
import React from 'react';
import { MTMConfig } from '@/context/types';

interface CompactMTMConfigProps {
  mtmConfigs: MTMConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onPriceTypeChange: (id: string, priceType: MTMConfig['priceType']) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

const priceTypeOptions = [
  { value: 'close', label: 'Close' },
  { value: 'high', label: 'High' },
  { value: 'low', label: 'Low' },
  { value: 'open', label: 'Open' },
  { value: 'hl2', label: 'HL/2 (High+Low/2)' },
  { value: 'hlc3', label: 'HLC/3 (High+Low+Close/3)' },
  { value: 'ohlc4', label: 'OHLC/4 (Open+High+Low+Close/4)' },
];

export const CompactMTMConfig: React.FC<CompactMTMConfigProps> = React.memo(({
  mtmConfigs,
  onToggle,
  onPeriodChange,
  onPriceTypeChange,
  onLineSizeChange,
  onColorChange,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">Momentum (MTM)</h3>
      <div className="text-sm text-gray-400">
        {mtmConfigs.filter(mtm => mtm.show).length} active
      </div>
    </div>

    <div className="space-y-4">
      {mtmConfigs.map((mtmConfig) => (
        <div key={mtmConfig.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={mtmConfig.show}
              onChange={() => onToggle(mtmConfig.id)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{mtmConfig.name}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Period</label>
              <input
                type="number"
                min="1"
                max="50"
                value={mtmConfig.period}
                onChange={(e) => onPeriodChange(mtmConfig.id, parseInt(e.target.value) || 10)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Price Type</label>
              <select
                value={mtmConfig.priceType}
                onChange={(e) => onPriceTypeChange(mtmConfig.id, e.target.value as MTMConfig['priceType'])}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                {priceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Line Style</h4>
            
            <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-300">MTM Line</span>
                <input
                  type="color"
                  value={mtmConfig.lineColor}
                  onChange={(e) => onColorChange(mtmConfig.id, e.target.value)}
                  className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
              </div>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={mtmConfig.lineSize}
                onChange={(e) => onLineSizeChange(mtmConfig.id, parseFloat(e.target.value) || 1.5)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 space-y-2">
              <p className="text-gray-300 font-medium">MTM Formula:</p>
              <p className="pl-2">MTM = Current Price - Price N periods ago</p>
              <p className="text-gray-300 font-medium mt-2">Interpretation:</p>
              <p className="pl-2">• Positive MTM: Momentum is upward</p>
              <p className="pl-2">• Negative MTM: Momentum is downward</p>
              <p className="pl-2">• Zero line crossovers can signal trend changes</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

CompactMTMConfig.displayName = 'CompactMTMConfig';