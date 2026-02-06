import { SupertrendConfig } from '@/context/types';

interface CompactSupertrendConfigProps {
  supertrendConfigs: SupertrendConfig[];
  onToggle: (id: string) => void;
  onATRLengthChange: (id: string, atrLength: number) => void;
  onFactorChange: (id: string, factor: number) => void;
  onUpLineWidthChange: (id: string, lineWidth: number) => void;
  onDownLineWidthChange: (id: string, lineWidth: number) => void;
  onUpLineColorChange: (id: string, color: string) => void;
  onDownLineColorChange: (id: string, color: string) => void;
  onUpBackgroundToggle: (id: string, show: boolean) => void;
  onDownBackgroundToggle: (id: string, show: boolean) => void;
  onUpBackgroundColorChange: (id: string, color: string) => void;
  onDownBackgroundColorChange: (id: string, color: string) => void;
}

export const CompactSupertrendConfig: React.FC<CompactSupertrendConfigProps> = ({
  supertrendConfigs,
  onToggle,
  onATRLengthChange,
  onFactorChange,
  onUpLineWidthChange,
  onDownLineWidthChange,
  onUpLineColorChange,
  onDownLineColorChange,
  onUpBackgroundToggle,
  onDownBackgroundToggle,
  onUpBackgroundColorChange,
  onDownBackgroundColorChange
}) => {
  const colorOptions = [
  '#26A69A', // Teal - Good for uptrend
  '#4CAF50', // Green - Good for uptrend
  '#00C853', // Light Green - Good for uptrend
  '#EF5350', // Red - Good for downtrend
  '#F44336', // Dark Red - Good for downtrend
  '#D32F2F', // Deep Red - Good for downtrend
];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-200">Supertrend</h3>
        <div className="text-sm text-gray-400">
          {supertrendConfigs.filter(st => st.show).length} active
        </div>
      </div>

      <div className="space-y-3">
        {supertrendConfigs.map((stConfig) => (
          <div key={stConfig.id} className="space-y-4 p-4 bg-gray-750 rounded-lg border border-gray-600">
            {/* Header with toggle and basic settings */}
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={stConfig.show}
                onChange={() => onToggle(stConfig.id)}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
              
              <span className="text-sm text-white font-medium">Supertrend</span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">ATR:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={stConfig.atrLength}
                  onChange={(e) => onATRLengthChange(stConfig.id, parseInt(e.target.value) || 10)}
                  className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Factor:</span>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={stConfig.factor}
                  onChange={(e) => onFactorChange(stConfig.id, parseFloat(e.target.value) || 3)}
                  className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Up Trend Settings */}
            <div className="space-y-2 pl-8 border-l-2 border-green-500/50">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-green-400">Up Trend</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Line Width:</span>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={stConfig.upTrend.lineWidth}
                    onChange={(e) => onUpLineWidthChange(stConfig.id, parseFloat(e.target.value) || 1.5)}
                    className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Line Color:</span>
                  <div className="flex gap-1">
                    {colorOptions.slice(0, 3).map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpLineColorChange(stConfig.id, color)}
                        className={`w-6 h-6 rounded border ${stConfig.upTrend.lineColor === color ? 'border-white ring-1 ring-white' : 'border-gray-500'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={stConfig.upTrend.background.show}
                    onChange={(e) => onUpBackgroundToggle(stConfig.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-green-500 focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-xs text-gray-400">Background</span>
                  {stConfig.upTrend.background.show && (
                    <input
                      type="color"
                      value={stConfig.upTrend.background.color}
                      onChange={(e) => onUpBackgroundColorChange(stConfig.id, e.target.value)}
                      className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Down Trend Settings */}
            <div className="space-y-2 pl-8 border-l-2 border-red-500/50">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-red-400">Down Trend</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Line Width:</span>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={stConfig.downTrend.lineWidth}
                    onChange={(e) => onDownLineWidthChange(stConfig.id, parseFloat(e.target.value) || 1.5)}
                    className="w-16 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Line Color:</span>
                  <div className="flex gap-1">
                    {colorOptions.slice(3).map((color) => (
                      <button
                        key={color}
                        onClick={() => onDownLineColorChange(stConfig.id, color)}
                        className={`w-6 h-6 rounded border ${stConfig.downTrend.lineColor === color ? 'border-white ring-1 ring-white' : 'border-gray-500'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={stConfig.downTrend.background.show}
                    onChange={(e) => onDownBackgroundToggle(stConfig.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-red-500 focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-xs text-gray-400">Background</span>
                  {stConfig.downTrend.background.show && (
                    <input
                      type="color"
                      value={stConfig.downTrend.background.color}
                      onChange={(e) => onDownBackgroundColorChange(stConfig.id, e.target.value)}
                      className="w-6 h-6 rounded border border-gray-500 cursor-pointer bg-transparent"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};