// components/chart/indicators/CompactSARConfig.tsx
import React from 'react';
import { SARConfig } from '@/context/types';

interface CompactSARConfigProps {
  sarConfigs: SARConfig[];
  onToggle: (id: string) => void;
  onStartChange: (id: string, start: number) => void;
  onMaximumChange: (id: string, maximum: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactSARConfig: React.FC<CompactSARConfigProps> = React.memo(({
  sarConfigs,
  onToggle,
  onStartChange,
  onMaximumChange,
  onColorChange
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">SAR (Stop and Reverse)</h3>
      <div className="text-sm text-gray-400">
        {sarConfigs.filter(sar => sar.show).length} active
      </div>
    </div>

    <div className="space-y-3">
      {sarConfigs.map((sarConfig) => (
        <div key={sarConfig.id} className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
          <input
            type="checkbox"
            checked={sarConfig.show}
            onChange={() => onToggle(sarConfig.id)}
            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
          
          <span className="text-sm text-white font-medium min-w-[80px]">SAR</span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Start:</span>
            <input
              type="number"
              min="0.001"
              max="0.1"
              step="0.001"
              value={sarConfig.start}
              onChange={(e) => onStartChange(sarConfig.id, parseFloat(e.target.value) || 0.02)}
              className="w-20 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Max:</span>
            <input
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              value={sarConfig.maximum}
              onChange={(e) => onMaximumChange(sarConfig.id, parseFloat(e.target.value) || 0.2)}
              className="w-20 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={sarConfig.color}
              onChange={(e) => onColorChange(sarConfig.id, e.target.value)}
              className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
));

CompactSARConfig.displayName = 'CompactSARConfig';