// components/routes/chart/indicators/CompactKDJConfig.tsx
import { KDJConfig } from '@/context/types';
import { useState, useCallback } from 'react';

interface CompactKDJConfigProps {
  kdjConfigs: KDJConfig[];
  onToggle: (id: string) => void;
  onUpdateKDJ: (id: string, updates: Partial<KDJConfig>) => void;
}

export const CompactKDJConfig: React.FC<CompactKDJConfigProps> = ({
  kdjConfigs,
  onToggle,
  onUpdateKDJ,
}) => {
  // Local state for debouncing updates (optional, can help performance)
  const [localConfigs, setLocalConfigs] = useState<Record<string, Partial<KDJConfig>>>({});

  // Generic update handler
  const handleUpdate = useCallback((id: string, field: keyof KDJConfig, value: any) => {
    // Apply constraints based on field type
    let constrainedValue = value;
    
    switch (field) {
      case 'period':
      case 'kPeriod':
      case 'dPeriod':
        constrainedValue = Math.max(1, Math.min(100, parseInt(value) || 9));
        break;
      case 'overbought':
        constrainedValue = Math.max(50, Math.min(100, parseInt(value) || 80));
        break;
      case 'oversold':
        constrainedValue = Math.max(0, Math.min(50, parseInt(value) || 20));
        break;
      case 'kLineSize':
      case 'dLineSize':
      case 'jLineSize':
        constrainedValue = Math.max(0.5, Math.min(5, parseFloat(value) || 1.5));
        break;
      default:
        constrainedValue = value;
    }

    // Update immediately
    onUpdateKDJ(id, { [field]: constrainedValue });
  }, [onUpdateKDJ]);

  // Color change handler
  const handleColorChange = useCallback((id: string, line: 'K' | 'D' | 'J', color: string) => {
    const field = `${line.toLowerCase()}LineColor` as 'kLineColor' | 'dLineColor' | 'jLineColor';
    onUpdateKDJ(id, { [field]: color });
  }, [onUpdateKDJ]);

  return (
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

            {/* Period Configuration */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Period (n)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={kdjConfig.period}
                  onChange={(e) => handleUpdate(kdjConfig.id, 'period', e.target.value)}
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
                  onChange={(e) => handleUpdate(kdjConfig.id, 'kPeriod', e.target.value)}
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
                  onChange={(e) => handleUpdate(kdjConfig.id, 'dPeriod', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Overbought/Oversold Levels */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Overbought</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={kdjConfig.overbought}
                  onChange={(e) => handleUpdate(kdjConfig.id, 'overbought', e.target.value)}
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
                  onChange={(e) => handleUpdate(kdjConfig.id, 'oversold', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Line Styles */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Line Styles</h4>
              
              {/* K Line */}
              <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-300">K Line</span>
                  <input
                    type="color"
                    value={kdjConfig.kLineColor}
                    onChange={(e) => handleColorChange(kdjConfig.id, 'K', e.target.value)}
                    className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                  />
                </div>
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={kdjConfig.kLineSize}
                  onChange={(e) => handleUpdate(kdjConfig.id, 'kLineSize', e.target.value)}
                  className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* D Line */}
              <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-300">D Line</span>
                  <input
                    type="color"
                    value={kdjConfig.dLineColor}
                    onChange={(e) => handleColorChange(kdjConfig.id, 'D', e.target.value)}
                    className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                  />
                </div>
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={kdjConfig.dLineSize}
                  onChange={(e) => handleUpdate(kdjConfig.id, 'dLineSize', e.target.value)}
                  className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* J Line */}
              <div className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-300">J Line</span>
                  <input
                    type="color"
                    value={kdjConfig.jLineColor}
                    onChange={(e) => handleColorChange(kdjConfig.id, 'J', e.target.value)}
                    className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                  />
                </div>
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={kdjConfig.jLineSize}
                  onChange={(e) => handleUpdate(kdjConfig.id, 'jLineSize', e.target.value)}
                  className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};