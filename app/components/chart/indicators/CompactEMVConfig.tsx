// components/chart/indicators/CompactEMVConfig.tsx
import React from 'react';
import { EMVConfig } from '@/context/GlobalContext';

interface CompactEMVConfigProps {
  emvConfigs: EMVConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onDivisorChange: (id: string, divisor: number) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactEMVConfig: React.FC<CompactEMVConfigProps> = ({
  emvConfigs,
  onToggle,
  onPeriodChange,
  onDivisorChange,
  onLineSizeChange,
  onColorChange,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">EMV (Ease of Movement)</h3>
      <div className="text-sm text-gray-400">
        {emvConfigs.filter(emv => emv.show).length} active
      </div>
    </div>

    <div className="space-y-4">
      {emvConfigs.map((emvConfig) => (
        <div key={emvConfig.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={emvConfig.show}
              onChange={() => onToggle(emvConfig.id)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{emvConfig.name}</div>
            </div>
          </div>

          {/* Period and Divisor Configuration */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Period</label>
              <input
                type="number"
                min="1"
                max="50"
                value={emvConfig.period}
                onChange={(e) => onPeriodChange(emvConfig.id, parseInt(e.target.value) || 14)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Divisor</label>
              <input
                type="number"
                min="100"
                max="10000000"
                step="100"
                value={emvConfig.divisor}
                onChange={(e) => onDivisorChange(emvConfig.id, parseInt(e.target.value) || 10000)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Line Style */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Line Style</h4>
            
            <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-300">EMV Line</span>
                <input
                  type="color"
                  value={emvConfig.lineColor}
                  onChange={(e) => onColorChange(emvConfig.id, e.target.value)}
                  className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
              </div>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={emvConfig.lineSize}
                onChange={(e) => onLineSizeChange(emvConfig.id, parseFloat(e.target.value) || 1.5)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 space-y-2">
              <p>
                <span className="text-gray-300">EMV Formula:</span> EMV = [Midpoint Move / (Volume Ratio / Distance Moved)]
              </p>
              <p>
                <span className="text-gray-300">Midpoint Move:</span> Current Midpoint - Previous Midpoint
              </p>
              <p>
                <span className="text-gray-300">Volume Ratio:</span> Volume / Divisor
              </p>
              <p>
                <span className="text-gray-300">Distance Moved:</span> High - Low
              </p>
              <p className="mt-2 text-gray-300">
                Positive EMV: Rising with ease | Negative EMV: Falling with ease
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);