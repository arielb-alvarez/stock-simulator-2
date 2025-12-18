// components/chart/indicators/CompactMFIConfig.tsx
import { MFIConfig } from '@/context/GlobalContext';

interface CompactMFIConfigProps {
  mfiConfigs: MFIConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactMFIConfig: React.FC<CompactMFIConfigProps> = ({
  mfiConfigs,
  onToggle,
  onPeriodChange,
  onLineSizeChange,
  onColorChange,
}) => {
  // Line width options - 4 different numeric options
  const lineWidthOptions = [1.0, 1.5, 2.0, 2.5];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-200">Money Flow Index</h3>
        <div className="text-sm text-gray-400">
          {mfiConfigs.filter(mfi => mfi.show).length} active
        </div>
      </div>

      <div className="space-y-4">
        {mfiConfigs.map((mfiConfig) => (
          <div key={mfiConfig.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                checked={mfiConfig.show}
                onChange={() => onToggle(mfiConfig.id)}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                value={mfiConfig.name}
                onChange={(e) => {
                  // Optionally add name change handler if needed
                  // For now, we'll keep it read-only or you can add a handler
                }}
                className="flex-1 bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Period */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Period:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={mfiConfig.period}
                  onChange={(e) => onPeriodChange(mfiConfig.id, parseInt(e.target.value) || 14)}
                  className="w-20 bg-gray-700 border border-gray-500 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* Line Width Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Width:</span>
                <select
                  value={mfiConfig.lineSize}
                  onChange={(e) => onLineSizeChange(mfiConfig.id, parseFloat(e.target.value))}
                  className="w-24 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  {lineWidthOptions.map((width) => (
                    <option key={width} value={width}>
                      {width.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Color */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Color:</span>
                <input
                  type="color"
                  value={mfiConfig.lineColor}
                  onChange={(e) => onColorChange(mfiConfig.id, e.target.value)}
                  className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
              </div>

              {/* Overbought/Oversold Levels */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Overbought: {mfiConfig.overbought}</span>
                  <span className="text-gray-400">Oversold: {mfiConfig.oversold}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full"
                    style={{
                      background: `linear-gradient(to right, ${mfiConfig.oversoldLineColor} 0%, ${mfiConfig.lineColor} 20%, ${mfiConfig.lineColor} 80%, ${mfiConfig.overboughtLineColor} 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};