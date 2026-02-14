// components/chart/indicators/CompactMAConfig.tsx
import React from 'react';
import { MAConfig } from '@/context/types';

interface CompactMAConfigProps {
  configs: MAConfig[];
  title: string;
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactMAConfig: React.FC<CompactMAConfigProps> = React.memo(({ 
  configs, 
  title, 
  onToggle, 
  onPeriodChange, 
  onLineSizeChange, 
  onColorChange 
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">{title}</h3>
      <div className="text-sm text-gray-400">
        {configs.filter(c => c.show).length} active
      </div>
    </div>

    <div className="space-y-3">
      {configs.map((config) => (
        <div key={config.id} className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
          <input
            type="checkbox"
            checked={config.show}
            onChange={() => onToggle(config.id)}
            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
          
          <span className="text-sm text-white font-medium min-w-[80px]">{config.name}</span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Period:</span>
            <input
              type="number"
              min="1"
              max="200"
              value={config.period}
              onChange={(e) => onPeriodChange(config.id, parseInt(e.target.value) || 20)}
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
              value={config.lineSize}
              onChange={(e) => onLineSizeChange(config.id, parseFloat(e.target.value) || 1.5)}
              className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.color}
              onChange={(e) => onColorChange(config.id, e.target.value)}
              className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
));

CompactMAConfig.displayName = 'CompactMAConfig';