// components/chart/indicators/CompactVolumeConfig.tsx
import React from 'react';
import { VolumeConfig, VolumeMAConfig } from '@/context/types';

interface CompactVolumeConfigProps {
  volumeConfigs: VolumeConfig[];
  onToggle: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onUpColorChange: (id: string, color: string) => void;
  onDownColorChange: (id: string, color: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onUpdateVolumeMA: (volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => void;
  onToggleVolumeMA: (volumeId: string, maId: string) => void;
}

export const CompactVolumeConfig: React.FC<CompactVolumeConfigProps> = React.memo(({
  volumeConfigs,
  onToggle,
  onNameChange,
  onUpColorChange,
  onDownColorChange,
  onOpacityChange,
  onUpdateVolumeMA,
  onToggleVolumeMA
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">Volume</h3>
      <div className="text-sm text-gray-400">
        {volumeConfigs.filter(volume => volume.show).length} active
      </div>
    </div>

    <div className="space-y-4">
      {volumeConfigs.map((volumeConfig) => (
        <div key={volumeConfig.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={volumeConfig.show}
              onChange={() => onToggle(volumeConfig.id)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="text"
              value={volumeConfig.name}
              onChange={(e) => onNameChange(volumeConfig.id, e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Up:</span>
              <input
                type="color"
                value={volumeConfig.upColor}
                onChange={(e) => onUpColorChange(volumeConfig.id, e.target.value)}
                className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Down:</span>
              <input
                type="color"
                value={volumeConfig.downColor}
                onChange={(e) => onDownColorChange(volumeConfig.id, e.target.value)}
                className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Opacity:</span>
              <input
                type="number"
                min="0.1"
                max="1"
                step="0.1"
                value={volumeConfig.opacity}
                onChange={(e) => onOpacityChange(volumeConfig.id, parseFloat(e.target.value) || 0.6)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-400 font-medium">MA Lines:</div>
            {volumeConfig.maLines.map((maConfig) => (
              <div key={maConfig.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                <input
                  type="checkbox"
                  checked={maConfig.show}
                  onChange={() => onToggleVolumeMA(volumeConfig.id, maConfig.id)}
                  className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-300">MA {maConfig.period}</span>
                <input
                  type="color"
                  value={maConfig.color}
                  onChange={(e) => onUpdateVolumeMA(volumeConfig.id, maConfig.id, { color: e.target.value })}
                  className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={maConfig.lineSize}
                  onChange={(e) => onUpdateVolumeMA(volumeConfig.id, maConfig.id, { lineSize: parseFloat(e.target.value) || 1.5 })}
                  className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
));

CompactVolumeConfig.displayName = 'CompactVolumeConfig';