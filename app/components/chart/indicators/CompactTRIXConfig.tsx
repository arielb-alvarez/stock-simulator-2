// components/chart/indicators/CompactTRIXConfig.tsx
import { TRIXConfig } from '@/context/GlobalContext';

interface CompactTRIXConfigProps {
  trixConfigs: TRIXConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactTRIXConfig: React.FC<CompactTRIXConfigProps> = ({
  trixConfigs,
  onToggle,
  onPeriodChange,
  onLineSizeChange,
  onColorChange
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">TRIX (Triple Exponential)</h3>
      <div className="text-sm text-gray-400">
        {trixConfigs.filter(trix => trix.show).length} active
      </div>
    </div>

    <div className="space-y-3">
      {trixConfigs.map((trixConfig) => (
        <div key={trixConfig.id} className="grid grid-cols-12 gap-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
          {/* Checkbox and Name */}
          <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={trixConfig.show}
              onChange={() => onToggle(trixConfig.id)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-sm text-white font-medium truncate">{trixConfig.name}</span>
          </div>

          {/* Period Input */}
          <div className="col-span-6 sm:col-span-3">
            <label className="block text-xs text-gray-400 mb-1">Period</label>
            <input
              type="number"
              min="1"
              max="200"
              step="1"
              value={trixConfig.period}
              onChange={(e) => onPeriodChange(trixConfig.id, parseInt(e.target.value) || 14)}
              className="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          {/* Width Input */}
          <div className="col-span-6 sm:col-span-3">
            <label className="block text-xs text-gray-400 mb-1">Width</label>
            <input
              type="number"
              min="0.5"
              max="5"
              step="0.5"
              value={trixConfig.lineSize}
              onChange={(e) => onLineSizeChange(trixConfig.id, parseFloat(e.target.value) || 1.5)}
              className="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          {/* Color Picker */}
          <div className="col-span-12 sm:col-span-3 flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={trixConfig.color}
                  onChange={(e) => onColorChange(trixConfig.id, e.target.value)}
                  className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
                  style={{ minWidth: '32px' }}
                />
                <span className="text-xs text-gray-300 truncate">{trixConfig.color}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
      <p>TRIX measures the percentage change of a triple exponential moving average. Values oscillate around zero.</p>
      <p className="mt-1">• Positive values: Bullish momentum</p>
      <p>• Negative values: Bearish momentum</p>
    </div>
  </div>
);