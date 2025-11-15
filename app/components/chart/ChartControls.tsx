'use client';
import { useGlobalContext, ChartType, RSIConfig, VolumeConfig, VolumeMAConfig } from '@/context/GlobalContext';
import { useState, useRef, useEffect } from 'react';
import { CandleIcon, LineIcon, AreaIcon, BarIcon, ChevronDown, EditIcon, IndicatorsIcon } from './ChartIcons';

const ALL_TIME_FRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
  { label: '1M', value: '1M' },
];

const CHART_TYPES: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'candle', label: 'Candlestick', icon: <CandleIcon /> },
  { value: 'line', label: 'Line', icon: <LineIcon /> },
  { value: 'area', label: 'Area', icon: <AreaIcon /> },
  { value: 'bar', label: 'Bar', icon: <BarIcon /> },
];

// Indicators Dialog Component
interface IndicatorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rsiConfigs: RSIConfig[];
  volumeConfigs: VolumeConfig[];
  onUpdateRSI: (id: string, updates: Partial<RSIConfig>) => void;
  onToggleRSI: (id: string) => void;
  onUpdateVolume: (id: string, updates: Partial<VolumeConfig>) => void;
  onToggleVolume: (id: string) => void;
  onUpdateVolumeMA: (volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => void;
  onToggleVolumeMA: (volumeId: string, maId: string) => void;
}

const IndicatorsDialog: React.FC<IndicatorsDialogProps> = ({
  isOpen,
  onClose,
  rsiConfigs,
  volumeConfigs,
  onUpdateRSI,
  onToggleRSI,
  onUpdateVolume,
  onToggleVolume,
  onUpdateVolumeMA,
  onToggleVolumeMA
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'sub'>('sub');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('rsi');

  if (!isOpen) return null;

  // RSI Handlers
  const handleToggleRSI = (rsiId: string) => {
    onToggleRSI(rsiId);
  };

  const handlePeriodChangeRSI = (rsiId: string, period: number) => {
    // Update the period - the GlobalContext will handle auto-updating the name
    onUpdateRSI(rsiId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeRSI = (rsiId: string, lineSize: number) => {
    onUpdateRSI(rsiId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeRSI = (rsiId: string, lineColor: string) => {
    onUpdateRSI(rsiId, { lineColor });
  };

  // Volume Handlers
  const handleToggleVolume = (volumeId: string) => {
    onToggleVolume(volumeId);
  };

  const handleNameChangeVolume = (volumeId: string, name: string) => {
    onUpdateVolume(volumeId, { name });
  };

  const handleUpColorChange = (volumeId: string, upColor: string) => {
    onUpdateVolume(volumeId, { upColor });
  };

  const handleDownColorChange = (volumeId: string, downColor: string) => {
    onUpdateVolume(volumeId, { downColor });
  };

  const handleOpacityChange = (volumeId: string, opacity: number) => {
    onUpdateVolume(volumeId, { opacity: Math.max(0.1, Math.min(1, opacity)) });
  };

  const handleUpdateVolumeMA = (volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => {
    onUpdateVolumeMA(volumeId, maId, updates);
  };

  const handleToggleVolumeMA = (volumeId: string, maId: string) => {
    onToggleVolumeMA(volumeId, maId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-[90vw] max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Indicators</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'main'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Main Indicator
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'sub'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sub Indicator
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {activeTab === 'main' ? (
            /* Main Indicator Content - Blank for now */
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-lg">Main Indicator configuration coming soon...</p>
            </div>
          ) : (
            /* Sub Indicator Content */
            <>
              {/* Vertical Menu */}
              <div className="w-48 border-r border-gray-700 bg-gray-750">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">INDICATORS</h3>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveSubMenu('rsi')}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                        activeSubMenu === 'rsi'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                      }`}
                    >
                      RSI
                    </button>
                    <button
                      onClick={() => setActiveSubMenu('volume')}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                        activeSubMenu === 'volume'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                      }`}
                    >
                      Volume
                    </button>
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeSubMenu === 'rsi' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-200">RSI Indicators</h3>
                      <div className="text-sm text-gray-400">
                        {rsiConfigs.filter(rsi => rsi.show).length} of {rsiConfigs.length} active
                      </div>
                    </div>

                    {/* RSI Configuration Table */}
                    <div className="bg-gray-750 rounded-lg border border-gray-700 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-16">
                              Show
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                              Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-24">
                              Period
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-24">
                              Line Width
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-32">
                              Color
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rsiConfigs.map((rsiConfig) => (
                            <tr 
                              key={rsiConfig.id} 
                              className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30 transition-colors"
                            >
                              {/* Checkbox for visibility */}
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  checked={rsiConfig.show}
                                  onChange={() => handleToggleRSI(rsiConfig.id)}
                                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
                                />
                              </td>
                              
                              {/* Static RSI Name */}
                              <td className="py-3 px-4">
                                <span className="text-white font-medium">RSI</span>
                              </td>
                              
                              {/* Editable Period */}
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={rsiConfig.period}
                                  onChange={(e) => handlePeriodChangeRSI(rsiConfig.id, parseInt(e.target.value) || 14)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                />
                              </td>
                              
                              {/* Editable Line Width */}
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0.5"
                                  max="5"
                                  step="0.5"
                                  value={rsiConfig.lineSize}
                                  onChange={(e) => handleLineSizeChangeRSI(rsiConfig.id, parseFloat(e.target.value) || 1.5)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                />
                              </td>
                              
                              {/* Color Picker */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={rsiConfig.lineColor}
                                    onChange={(e) => handleColorChangeRSI(rsiConfig.id, e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-600 cursor-pointer bg-transparent"
                                  />
                                  <span className="text-xs text-gray-400 font-mono">
                                    {rsiConfig.lineColor}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSubMenu === 'volume' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-200">Volume Indicators</h3>
                      <div className="text-sm text-gray-400">
                        {volumeConfigs.filter(volume => volume.show).length} of {volumeConfigs.length} active
                      </div>
                    </div>

                    {/* Volume Configuration */}
                    <div className="space-y-4">
                      {volumeConfigs.map((volumeConfig) => (
                        <div key={volumeConfig.id} className="bg-gray-750 rounded-lg border border-gray-700 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={volumeConfig.show}
                                onChange={() => handleToggleVolume(volumeConfig.id)}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
                              />
                              <h4 className="text-md font-medium text-white">{volumeConfig.name}</h4>
                            </div>
                          </div>

                          {/* Basic Volume Settings */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {/* Up Color */}
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Up Color</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={volumeConfig.upColor}
                                  onChange={(e) => handleUpColorChange(volumeConfig.id, e.target.value)}
                                  className="w-10 h-10 rounded border border-gray-600 cursor-pointer bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={volumeConfig.upColor}
                                  onChange={(e) => handleUpColorChange(volumeConfig.id, e.target.value)}
                                  className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 font-mono text-xs"
                                />
                              </div>
                            </div>

                            {/* Down Color */}
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Down Color</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={volumeConfig.downColor}
                                  onChange={(e) => handleDownColorChange(volumeConfig.id, e.target.value)}
                                  className="w-10 h-10 rounded border border-gray-600 cursor-pointer bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={volumeConfig.downColor}
                                  onChange={(e) => handleDownColorChange(volumeConfig.id, e.target.value)}
                                  className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 font-mono text-xs"
                                />
                              </div>
                            </div>

                            {/* Opacity */}
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Opacity</label>
                              <input
                                type="number"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={volumeConfig.opacity}
                                onChange={(e) => handleOpacityChange(volumeConfig.id, parseFloat(e.target.value) || 0.6)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                            </div>

                            {/* Name */}
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Name</label>
                              <input
                                type="text"
                                value={volumeConfig.name}
                                onChange={(e) => handleNameChangeVolume(volumeConfig.id, e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                            </div>
                          </div>

                          {/* Volume MA Configuration Table */}
                          <div className="border-t border-gray-700 pt-4">
                            <h5 className="text-sm font-medium text-gray-300 mb-3">Moving Average (MA) Settings</h5>
                            
                            <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 w-16">Show</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">MA Line</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 w-24">Period</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 w-32">Color</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 w-24">Line Width</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {volumeConfig.maLines.map((maConfig, index) => (
                                    <tr key={maConfig.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30 transition-colors">
                                      {/* Show/Hide MA */}
                                      <td className="py-3 px-4">
                                        <input
                                          type="checkbox"
                                          checked={maConfig.show}
                                          onChange={() => handleToggleVolumeMA(volumeConfig.id, maConfig.id)}
                                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
                                        />
                                      </td>
                                      
                                      {/* MA Label */}
                                      <td className="py-3 px-4">
                                        <span className="text-white font-medium">MA {index + 1}</span>
                                      </td>
                                      
                                      {/* MA Period */}
                                      <td className="py-3 px-4">
                                        <input
                                          type="number"
                                          min="1"
                                          max="50"
                                          value={maConfig.period}
                                          onChange={(e) => handleUpdateVolumeMA(volumeConfig.id, maConfig.id, { 
                                            period: parseInt(e.target.value) || 5 
                                          })}
                                          className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                        />
                                      </td>
                                      
                                      {/* MA Color */}
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="color"
                                            value={maConfig.color}
                                            onChange={(e) => handleUpdateVolumeMA(volumeConfig.id, maConfig.id, { 
                                              color: e.target.value 
                                            })}
                                            className="w-8 h-8 rounded border border-gray-600 cursor-pointer bg-transparent"
                                          />
                                          <input
                                            type="text"
                                            value={maConfig.color}
                                            onChange={(e) => handleUpdateVolumeMA(volumeConfig.id, maConfig.id, { 
                                              color: e.target.value 
                                            })}
                                            className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 font-mono text-xs"
                                          />
                                        </div>
                                      </td>
                                      
                                      {/* MA Line Size */}
                                      <td className="py-3 px-4">
                                        <input
                                          type="number"
                                          min="0.5"
                                          max="5"
                                          step="0.5"
                                          value={maConfig.lineSize}
                                          onChange={(e) => handleUpdateVolumeMA(volumeConfig.id, maConfig.id, { 
                                            lineSize: parseFloat(e.target.value) || 1.5 
                                          })}
                                          className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ChartControls() {
  const { 
    config, 
    updateConfig, 
    updateRSI, 
    toggleRSI, 
    updateVolume, 
    toggleVolume, 
    updateVolumeMA, 
    toggleVolumeMA 
  } = useGlobalContext();
  const [isChartTypeOpen, setIsChartTypeOpen] = useState(false);
  const [isTimeFrameOpen, setIsTimeFrameOpen] = useState(false);
  const [isEditingPinned, setIsEditingPinned] = useState(false);
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [pinnedTimeFrames, setPinnedTimeFrames] = useState<string[]>(['15m', '1h', '4h', '1d', '1w']);
  
  const chartTypeRef = useRef<HTMLDivElement>(null);
  const timeFrameRef = useRef<HTMLDivElement>(null);

  // Load pinned timeframes from localStorage on mount
  useEffect(() => {
    const loadPinnedTimeFrames = () => {
      try {
        const stored = localStorage.getItem('pinned-timeframes');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setPinnedTimeFrames(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading pinned timeframes:', error);
      }
    };

    loadPinnedTimeFrames();
  }, []);

  // Save pinned timeframes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pinned-timeframes', JSON.stringify(pinnedTimeFrames));
  }, [pinnedTimeFrames]);

  // Track if current timeframe is pinned
  const isCurrentTimeFramePinned = pinnedTimeFrames.includes(config.interval);

  // Get displayed timeframes - only pinned timeframes are always displayed
  const getDisplayTimeFrames = () => {
    return ALL_TIME_FRAMES.filter(tf => pinnedTimeFrames.includes(tf.value));
  };

  const getAvailableTimeFrames = () => {
    return ALL_TIME_FRAMES.filter(tf => !pinnedTimeFrames.includes(tf.value));
  };

  const handleTimeFrameChange = (timeFrame: string) => {
    updateConfig({ interval: timeFrame });
    setIsTimeFrameOpen(false);
    setIsEditingPinned(false);
  };

  const handleChartTypeChange = (chartType: ChartType) => {
    updateConfig({ chartType });
    setIsChartTypeOpen(false);
  };

  const togglePinnedTimeFrame = (timeFrame: string) => {
    if (pinnedTimeFrames.includes(timeFrame)) {
      setPinnedTimeFrames(prev => prev.filter(tf => tf !== timeFrame));
    } else {
      setPinnedTimeFrames(prev => [...prev, timeFrame]);
    }
  };

  const handleUpdateRSI = (id: string, updates: Partial<RSIConfig>) => {
    updateRSI(id, updates);
  };

  const handleToggleRSI = (id: string) => {
    toggleRSI(id);
  };

  const handleUpdateVolume = (id: string, updates: Partial<VolumeConfig>) => {
    updateVolume(id, updates);
  };

  const handleToggleVolume = (id: string) => {
    toggleVolume(id);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartTypeRef.current && !chartTypeRef.current.contains(event.target as Node)) {
        setIsChartTypeOpen(false);
      }
      if (timeFrameRef.current && !timeFrameRef.current.contains(event.target as Node)) {
        setIsTimeFrameOpen(false);
        setIsEditingPinned(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentChartType = CHART_TYPES.find(type => type.value === config.chartType);

  const handleUpdateVolumeMA = (volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => {
    updateVolumeMA(volumeId, maId, updates);
  };

  const handleToggleVolumeMA = (volumeId: string, maId: string) => {
    toggleVolumeMA(volumeId, maId);
  };

  return (
    <>
      <div className="chart-controls p-1 border-b border-gray-700">
        <div className="flex items-center gap-4">
          {/* Time Frame Selector */}
          <div className="relative" ref={timeFrameRef}>
            <div className="flex items-center bg-gray-700/30 rounded-md p-1">
              {/* Display only pinned timeframes */}
              {getDisplayTimeFrames().map((timeFrame) => (
                <button
                  key={timeFrame.value}
                  onClick={() => handleTimeFrameChange(timeFrame.value)}
                  className={`
                    px-2 py-1 text-xs font-medium transition-all min-w-[36px] rounded
                    ${config.interval === timeFrame.value
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/30'
                    }
                  `}
                >
                  {timeFrame.label}
                </button>
              ))}
              
              {/* Current unpinned timeframe (if any) displayed before dropdown */}
              {!isCurrentTimeFramePinned && config.interval && (
                <button
                  onClick={() => handleTimeFrameChange(config.interval)}
                  className="px-2 py-1 text-xs font-medium min-w-[36px] rounded bg-yellow-500/20 text-yellow-400"
                >
                  {ALL_TIME_FRAMES.find(tf => tf.value === config.interval)?.label || config.interval}
                </button>
              )}
              
              {/* Dropdown Trigger */}
              <button
                onClick={() => setIsTimeFrameOpen(!isTimeFrameOpen)}
                className={`
                  flex items-center justify-center px-2 py-1 transition-all
                  text-gray-400 hover:text-gray-200 rounded hover:bg-gray-600/30
                  ${isTimeFrameOpen ? 'bg-gray-600/30' : ''}
                `}
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Timeframe Dropdown Menu */}
            {isTimeFrameOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 min-w-[200px]">
                {/* Header with Edit Button */}
                <div className="flex items-center justify-between p-3 border-b border-gray-700">
                  <span className="text-sm font-medium text-gray-300">Timeframes</span>
                  <button
                    onClick={() => setIsEditingPinned(!isEditingPinned)}
                    className={`
                      flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all
                      ${isEditingPinned 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                      }
                    `}
                  >
                    <EditIcon className="w-3 h-3" />
                    {isEditingPinned ? 'Done' : 'Edit'}
                  </button>
                </div>

                <div className="p-2">
                  {/* Pinned Timeframes Section */}
                  {pinnedTimeFrames.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-medium">Pinned</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {ALL_TIME_FRAMES.filter(tf => pinnedTimeFrames.includes(tf.value)).map((timeFrame) => (
                          <button
                            key={timeFrame.value}
                            onClick={() => isEditingPinned 
                              ? togglePinnedTimeFrame(timeFrame.value)
                              : handleTimeFrameChange(timeFrame.value)
                            }
                            className={`
                              flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all
                              ${isEditingPinned
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : config.interval === timeFrame.value
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                              }
                            `}
                          >
                            {isEditingPinned ? (
                              <span className="text-sm">− {timeFrame.label}</span>
                            ) : (
                              timeFrame.label
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Timeframes Section */}
                  {getAvailableTimeFrames().length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {isEditingPinned ? 'Click + to pin' : 'Available'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {getAvailableTimeFrames().map((timeFrame) => (
                          <button
                            key={timeFrame.value}
                            onClick={() => isEditingPinned 
                              ? togglePinnedTimeFrame(timeFrame.value)
                              : handleTimeFrameChange(timeFrame.value)
                            }
                            className={`
                              flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all
                              ${isEditingPinned
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : config.interval === timeFrame.value
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                              }
                            `}
                          >
                            {isEditingPinned ? `+ ${timeFrame.label}` : timeFrame.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chart Type Selector */}
          <div className="relative" ref={chartTypeRef}>
            <button
              onClick={() => setIsChartTypeOpen(!isChartTypeOpen)}
              className={`
                flex items-center gap-2 px-3 py-2
                text-sm font-medium transition-all hover:bg-gray-700/30 rounded-md
                ${isChartTypeOpen ? 'bg-gray-700/30' : ''}
              `}
              title={currentChartType?.label}
            >
              <span className="text-gray-300">
                {currentChartType?.icon}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isChartTypeOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 p-2 min-w-[140px]">
                <div className="flex flex-col gap-1">
                  {CHART_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleChartTypeChange(type.value)}
                      className={`
                        flex items-center gap-3 p-2 rounded-md transition-all text-sm
                        hover:bg-gray-700/50 w-full text-left
                        ${config.chartType === type.value
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'text-gray-300 hover:text-gray-200'
                        }
                      `}
                    >
                      <span className="text-gray-300 flex-shrink-0">
                        {type.icon}
                      </span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Indicators Button */}
          <button
            onClick={() => setIsIndicatorsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-md transition-all"
          >
            <IndicatorsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Indicators Dialog */}
      <IndicatorsDialog
        isOpen={isIndicatorsOpen}
        onClose={() => setIsIndicatorsOpen(false)}
        rsiConfigs={config.indicators.rsi}
        volumeConfigs={config.indicators.volume}
        onUpdateRSI={handleUpdateRSI}
        onToggleRSI={handleToggleRSI}
        onUpdateVolume={handleUpdateVolume}
        onToggleVolume={handleToggleVolume}
        onUpdateVolumeMA={handleUpdateVolumeMA}
        onToggleVolumeMA={handleToggleVolumeMA}
      />
    </>
  );
}