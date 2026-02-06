// components/chart/indicators/CompactBBConfig.tsx
import { BBConfig } from "@/context/types";

interface CompactBBConfigProps {
  bbConfigs: BBConfig[];
  onToggle: (id: string) => void;
  onPeriodChange: (id: string, period: number) => void;
  onStdDevChange: (id: string, stdDev: number) => void;
  onUpdateBB: (id: string, updates: Partial<BBConfig>) => void;
}

export const CompactBBConfig: React.FC<CompactBBConfigProps> = ({
  bbConfigs,
  onToggle,
  onPeriodChange,
  onStdDevChange,
  onUpdateBB
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-gray-200">Bollinger Bands</h3>
      <div className="text-sm text-gray-400">
        {bbConfigs.filter(bb => bb.show).length} active
      </div>
    </div>

    <div className="space-y-4">
      {bbConfigs.map((bbConfig) => (
        <div key={bbConfig.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={bbConfig.show}
              onChange={() => onToggle(bbConfig.id)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-sm text-white font-medium">{bbConfig.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Period:</span>
              <input
                type="number"
                min="1"
                max="200"
                value={bbConfig.period}
                onChange={(e) => onPeriodChange(bbConfig.id, parseInt(e.target.value) || 20)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Multiplier:</span>
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={bbConfig.stdDev}
                onChange={(e) => onStdDevChange(bbConfig.id, parseFloat(e.target.value) || 2)}
                className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'upLine', label: 'UP Line', config: bbConfig.upLine },
              { key: 'middleLine', label: 'MB Line', config: bbConfig.middleLine },
              { key: 'downLine', label: 'DN Line', config: bbConfig.downLine }
            ].map((line) => (
              <div key={line.key} className="flex items-center gap-4 p-3 bg-gray-800 rounded border border-gray-700">
                <span className="text-sm text-gray-400 w-16">{line.label}</span>
                <input
                  type="color"
                  value={line.config.color}
                  onChange={(e) => {
                    onUpdateBB(bbConfig.id, { 
                      [line.key]: { ...line.config, color: e.target.value }
                    });
                  }}
                  className="w-8 h-8 rounded border border-gray-500 cursor-pointer bg-transparent"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Width:</span>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={line.config.lineWidth}
                    onChange={(e) => {
                      onUpdateBB(bbConfig.id, { 
                        [line.key]: { ...line.config, lineWidth: parseFloat(e.target.value) || 1.5 }
                      });
                    }}
                    className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);