// components/chart/indicators/CompactVWAPConfig.tsx
import { VWAPConfig } from '@/context/GlobalContext';

interface CompactVWAPConfigProps {
  vwapConfigs: VWAPConfig[];
  onToggle: (id: string) => void;
  onLengthChange: (id: string, length: number) => void;
  onLineSizeChange: (id: string, lineSize: number) => void;
  onColorChange: (id: string, color: string) => void;
}

export const CompactVWAPConfig: React.FC<CompactVWAPConfigProps> = ({
  vwapConfigs,
  onToggle,
  onLengthChange,
  onLineSizeChange,
  onColorChange
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">VWAP</h3>
      <div className="text-sm text-gray-400">
        {vwapConfigs.filter(vwap => vwap.show).length} active
      </div>
    </div>

    <div className="space-y-3">
      {vwapConfigs.map((vwapConfig) => (
        <div key={vwapConfig.id} className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
          <input
            type="checkbox"
            checked={vwapConfig.show}
            onChange={() => onToggle(vwapConfig.id)}
            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
          
          <span className="text-sm text-white font-medium min-w-[80px]">VWAP</span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Length:</span>
            <input
              type="number"
              min="0"
              max="1000"
              value={vwapConfig.length}
              onChange={(e) => onLengthChange(vwapConfig.id, parseInt(e.target.value) || 20)}
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
              value={vwapConfig.lineSize}
              onChange={(e) => onLineSizeChange(vwapConfig.id, parseFloat(e.target.value) || 1.5)}
              className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={vwapConfig.color}
              onChange={(e) => onColorChange(vwapConfig.id, e.target.value)}
              className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);