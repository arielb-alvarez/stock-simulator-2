// components/routes/chart/indicators/CompactKDJConfig.tsx
import React from 'react';
import { KDJConfig } from '@/context/types';

interface CompactKDJConfigProps {
  kdjConfigs: KDJConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onKPeriodChange: (id: string, kPeriod: number) => void;
  onDPeriodChange: (id: string, dPeriod: number) => void;
  onKLineSizeChange: (id: string, lineSize: number) => void;
  onDLineSizeChange: (id: string, lineSize: number) => void;
  onJLineSizeChange: (id: string, lineSize: number) => void;
  onKColorChange: (id: string, color: string) => void;
  onDColorChange: (id: string, color: string) => void;
  onJColorChange: (id: string, color: string) => void;
  onOverboughtChange?: (id: string, value: number) => void;
  onOversoldChange?: (id: string, value: number) => void;
}

export const CompactKDJConfig: React.FC<CompactKDJConfigProps> = React.memo(({
  kdjConfigs,
  onToggle,
  onPeriodChange,
  onKPeriodChange,
  onDPeriodChange,
  onKLineSizeChange,
  onDLineSizeChange,
  onJLineSizeChange,
  onKColorChange,
  onDColorChange,
  onJColorChange,
  onOverboughtChange,
  onOversoldChange,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">KDJ (Stochastic)</h3>
      <div className="text-sm text-gray-400">
        {kdjConfigs.filter(kdj => kdj.show).length} active
      </div>
    </div>

    <div className="space-y-4">
      {kdjConfigs.map((kdjConfig) => (
        <div key={kdjConfig.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={kdjConfig.show}
              onChange={() => onToggle(kdjConfig.id)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{kdjConfig.name}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Period (n)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={kdjConfig.period}
                onChange={(e) => onPeriodChange(kdjConfig.id, parseInt(e.target.value) || 9)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">K Period (m1)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={kdjConfig.kPeriod}
                onChange={(e) => onKPeriodChange(kdjConfig.id, parseInt(e.target.value) || 3)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">D Period (m2)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={kdjConfig.dPeriod}
                onChange={(e) => onDPeriodChange(kdjConfig.id, parseInt(e.target.value) || 3)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Overbought</label>
              <input
                type="number"
                min="50"
                max="100"
                value={kdjConfig.overbought}
                onChange={(e) => onOverboughtChange?.(kdjConfig.id, parseInt(e.target.value) || 80)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Oversold</label>
              <input
                type="number"
                min="0"
                max="50"
                value={kdjConfig.oversold}
                onChange={(e) => onOversoldChange?.(kdjConfig.id, parseInt(e.target.value) || 20)}
                className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Line Styles</h4>
            
            <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-300">K Line</span>
                <input
                  type="color"
                  value={kdjConfig.kLineColor}
                  onChange={(e) => onKColorChange(kdjConfig.id, e.target.value)}
                  className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
              </div>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={kdjConfig.kLineSize}
                onChange={(e) => onKLineSizeChange(kdjConfig.id, parseFloat(e.target.value) || 1.5)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-300">D Line</span>
                <input
                  type="color"
                  value={kdjConfig.dLineColor}
                  onChange={(e) => onDColorChange(kdjConfig.id, e.target.value)}
                  className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
              </div>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={kdjConfig.dLineSize}
                onChange={(e) => onDLineSizeChange(kdjConfig.id, parseFloat(e.target.value) || 1.5)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-300">J Line</span>
                <input
                  type="color"
                  value={kdjConfig.jLineColor}
                  onChange={(e) => onJColorChange(kdjConfig.id, e.target.value)}
                  className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
              </div>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={kdjConfig.jLineSize}
                onChange={(e) => onJLineSizeChange(kdjConfig.id, parseFloat(e.target.value) || 1.5)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

CompactKDJConfig.displayName = 'CompactKDJConfig';