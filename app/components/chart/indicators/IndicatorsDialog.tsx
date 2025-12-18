// components/chart/indicators/IndicatorsDialog.tsx
import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { CompactMAConfig } from './CompactMAConfig';
import { CompactRSIConfig } from './CompactRSIConfig';
import { CompactMFIConfig } from './CompactMFIConfig';
import { CompactVolumeConfig } from './CompactVolumeConfig';
import { CompactBBConfig } from './CompactBBConfig';
import { CompactVWAPConfig } from './CompactVWAPConfig';
import { CompactAVLConfig } from './CompactAVLConfig';
import { CompactSARConfig } from './CompactSARConfig';
import { CompactTRIXConfig } from './CompactTRIXConfig';
import { CompactSupertrendConfig } from './CompactSuperTrendConfig';
import { CompactKDJConfig } from './CompactKDJConfig';

interface IndicatorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IndicatorsDialog: React.FC<IndicatorsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'sub'>('main');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('ma');
  
  const {
    config,
    updateRSI,
    toggleRSI,
    updateMFI,
    toggleMFI,
    updateVolume,
    toggleVolume,
    updateVolumeMA,
    toggleVolumeMA,
    updateMA,
    toggleMA,
    updateEMA,
    toggleEMA,
    updateWMA,
    toggleWMA,
    updateBB,
    toggleBB,
    updateVWAP,
    toggleVWAP,
    updateAVL,
    toggleAVL,
    updateSAR,
    toggleSAR,
    updateTRIX,
    toggleTRIX,
    updateSupertrend,
    toggleSupertrend,
    updateKDJ,
    toggleKDJ
  } = useGlobalContext();

  if (!isOpen) return null;

  // RSI Handlers
  const handleToggleRSI = (rsiId: string) => {
    toggleRSI(rsiId);
  };

  const handlePeriodChangeRSI = (rsiId: string, period: number) => {
    updateRSI(rsiId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeRSI = (rsiId: string, lineSize: number) => {
    updateRSI(rsiId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeRSI = (rsiId: string, lineColor: string) => {
    updateRSI(rsiId, { lineColor });
  };

  // Add MFI handlers
  const handleToggleMFI = (mfiId: string) => {
    toggleMFI(mfiId);
  };

  const handlePeriodChangeMFI = (mfiId: string, period: number) => {
    updateMFI(mfiId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeMFI = (mfiId: string, lineSize: number) => {
    updateMFI(mfiId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeMFI = (mfiId: string, lineColor: string) => {
    updateMFI(mfiId, { lineColor });
  };

  // Volume Handlers
  const handleToggleVolume = (volumeId: string) => {
    toggleVolume(volumeId);
  };

  const handleNameChangeVolume = (volumeId: string, name: string) => {
    updateVolume(volumeId, { name });
  };

  const handleUpColorChange = (volumeId: string, upColor: string) => {
    updateVolume(volumeId, { upColor });
  };

  const handleDownColorChange = (volumeId: string, downColor: string) => {
    updateVolume(volumeId, { downColor });
  };

  const handleOpacityChange = (volumeId: string, opacity: number) => {
    updateVolume(volumeId, { opacity: Math.max(0.1, Math.min(1, opacity)) });
  };

  const handleUpdateVolumeMA = (volumeId: string, maId: string, updates: any) => {
    updateVolumeMA(volumeId, maId, updates);
  };

  const handleToggleVolumeMA = (volumeId: string, maId: string) => {
    toggleVolumeMA(volumeId, maId);
  };

  // MA configuration handlers
  const handleToggleMA = (maId: string) => {
    toggleMA(maId);
  };

  const handlePeriodChangeMA = (maId: string, period: number) => {
    updateMA(maId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeMA = (maId: string, lineSize: number) => {
    updateMA(maId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeMA = (maId: string, color: string) => {
    updateMA(maId, { color });
  };

  // EMA configuration handlers
  const handleToggleEMA = (emaId: string) => {
    toggleEMA(emaId);
  };

  const handlePeriodChangeEMA = (emaId: string, period: number) => {
    updateEMA(emaId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeEMA = (emaId: string, lineSize: number) => {
    updateEMA(emaId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeEMA = (emaId: string, color: string) => {
    updateEMA(emaId, { color });
  };

  // WMA configuration handlers
  const handleToggleWMA = (wmaId: string) => {
    toggleWMA(wmaId);
  };

  const handlePeriodChangeWMA = (wmaId: string, period: number) => {
    updateWMA(wmaId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeWMA = (wmaId: string, lineSize: number) => {
    updateWMA(wmaId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeWMA = (wmaId: string, color: string) => {
    updateWMA(wmaId, { color });
  };

  // BB configuration handlers
  const handleToggleBB = (bbId: string) => {
    toggleBB(bbId);
  };

  const handlePeriodChangeBB = (bbId: string, period: number) => {
    updateBB(bbId, { period: Math.max(1, period) });
  };

  const handleStdDevChangeBB = (bbId: string, stdDev: number) => {
    updateBB(bbId, { stdDev: Math.max(0.1, Math.min(5, stdDev)) });
  };

  // VWAP configuration handlers
  const handleToggleVWAP = (vwapId: string) => {
    toggleVWAP(vwapId);
  };

  const handleLengthChangeVWAP = (vwapId: string, length: number) => {
    updateVWAP(vwapId, { length: Math.max(0, length) });
  };

  const handleLineSizeChangeVWAP = (vwapId: string, lineSize: number) => {
    updateVWAP(vwapId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeVWAP = (vwapId: string, color: string) => {
    updateVWAP(vwapId, { color });
  };

  // AVL handlers
  const handleToggleAVL = (avlId: string) => {
    toggleAVL(avlId);
  };

  const handlePeriodChangeAVL = (avlId: string, period: number) => {
    updateAVL(avlId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeAVL = (avlId: string, lineSize: number) => {
    updateAVL(avlId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeAVL = (avlId: string, color: string) => {
    updateAVL(avlId, { color });
  };

  // SAR handlers
  const handleToggleSAR = (sarId: string) => {
    toggleSAR(sarId);
  };

  const handleStartChangeSAR = (sarId: string, start: number) => {
    updateSAR(sarId, { start: Math.max(0.001, Math.min(0.1, start)) });
  };

  const handleMaximumChangeSAR = (sarId: string, maximum: number) => {
    updateSAR(sarId, { maximum: Math.max(0.01, Math.min(1, maximum)) });
  };

  const handleColorChangeSAR = (sarId: string, color: string) => {
    updateSAR(sarId, { color });
  };

  // TRIX handlers
  const handleToggleTRIX = (trixId: string) => {
    toggleTRIX(trixId);
  };

  const handlePeriodChangeTRIX = (trixId: string, period: number) => {
    updateTRIX(trixId, { period: Math.max(1, period) });
  };

  const handleLineSizeChangeTRIX = (trixId: string, lineSize: number) => {
    updateTRIX(trixId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleColorChangeTRIX = (trixId: string, color: string) => {
    updateTRIX(trixId, { color });
  };

  // Add handler functions for Supertrend
  const handleToggleSupertrend = (supertrendId: string) => {
    toggleSupertrend(supertrendId);
  };

  const handleATRLengthChange = (supertrendId: string, atrLength: number) => {
    updateSupertrend(supertrendId, { atrLength: Math.max(1, Math.min(100, atrLength)) });
  };

  const handleFactorChange = (supertrendId: string, factor: number) => {
    updateSupertrend(supertrendId, { factor: Math.max(0.1, Math.min(10, factor)) });
  };

  const handleUpLineWidthChange = (supertrendId: string, lineWidth: number) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        lineWidth: Math.max(0.5, Math.min(5, lineWidth)) 
      } 
    });
  };

  const handleDownLineWidthChange = (supertrendId: string, lineWidth: number) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        lineWidth: Math.max(0.5, Math.min(5, lineWidth)) 
      } 
    });
  };

  const handleUpLineColorChange = (supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        lineColor: color
      } 
    });
  };

  const handleDownLineColorChange = (supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        lineColor: color
      } 
    });
  };

  const handleUpBackgroundToggle = (supertrendId: string, show: boolean) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend.background,
          show 
        }
      } 
    });
  };

  const handleDownBackgroundToggle = (supertrendId: string, show: boolean) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend.background,
          show 
        }
      } 
    });
  };

  const handleUpBackgroundColorChange = (supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend.background,
          color 
        }
      } 
    });
  };

  const handleDownBackgroundColorChange = (supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend.background,
          color 
        }
      } 
    });
  };

  // Add KDJ handlers
  const handleToggleKDJ = (kdjId: string) => {
    toggleKDJ(kdjId);
  };

  const handlePeriodChangeKDJ = (kdjId: string, period: number) => {
    updateKDJ(kdjId, { period: Math.max(1, period) });
  };

  const handleKPeriodChange = (kdjId: string, kPeriod: number) => {
    updateKDJ(kdjId, { kPeriod: Math.max(1, kPeriod) });
  };

  const handleDPeriodChange = (kdjId: string, dPeriod: number) => {
    updateKDJ(kdjId, { dPeriod: Math.max(1, dPeriod) });
  };

  const handleKLineSizeChangeKDJ = (kdjId: string, lineSize: number) => {
    updateKDJ(kdjId, { kLineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleDLineSizeChangeKDJ = (kdjId: string, lineSize: number) => {
    updateKDJ(kdjId, { dLineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleJLineSizeChangeKDJ = (kdjId: string, lineSize: number) => {
    updateKDJ(kdjId, { jLineSize: Math.max(0.5, Math.min(5, lineSize)) });
  };

  const handleKColorChangeKDJ = (kdjId: string, color: string) => {
    updateKDJ(kdjId, { kLineColor: color });
  };

  const handleDColorChangeKDJ = (kdjId: string, color: string) => {
    updateKDJ(kdjId, { dLineColor: color });
  };

  const handleJColorChangeKDJ = (kdjId: string, color: string) => {
    updateKDJ(kdjId, { jLineColor: color });
  };

  const handleOverboughtChangeKDJ = (kdjId: string, value: number) => {
    updateKDJ(kdjId, { overbought: Math.max(50, Math.min(100, value)) });
  };

  const handleOversoldChangeKDJ = (kdjId: string, value: number) => {
    updateKDJ(kdjId, { oversold: Math.max(0, Math.min(50, value)) });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl w-[680px] max-h-[85vh] flex flex-col border border-gray-600 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Indicators</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-lg p-1 rounded hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'main'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Main Chart
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sub'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sub Chart
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-[500px]">
          {activeTab === 'main' ? (
            /* Main Indicator Content */
            <>
              {/* Vertical Menu */}
              <div className="w-44 border-r border-gray-700 bg-gray-750/50">
                <div className="p-3">
                  <h3 className="text-xs text-gray-400 mb-3 font-medium">MAIN INDICATORS</h3>
                  <nav className="space-y-1">
                    {[
                      { id: 'ma', label: 'Moving Average' },
                      { id: 'ema', label: 'Exponential MA' },
                      { id: 'wma', label: 'Weighted MA' },
                      { id: 'avl', label: 'Average Value Line' },
                      { id: 'bb', label: 'Bollinger Bands' },
                      { id: 'vwap', label: 'VWAP' },
                      { id: 'sar', label: 'SAR' },
                      { id: 'trix', label: 'TRIX' },
                      { id: 'supertrend', label: 'Supertrend' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSubMenu(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                          activeSubMenu === item.id
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeSubMenu === 'ma' && (
                  <CompactMAConfig
                    configs={config.indicators.ma}
                    title="Moving Average"
                    onToggle={handleToggleMA}
                    onPeriodChange={handlePeriodChangeMA}
                    onLineSizeChange={handleLineSizeChangeMA}
                    onColorChange={handleColorChangeMA}
                  />
                )}

                {activeSubMenu === 'ema' && (
                  <CompactMAConfig
                    configs={config.indicators.ema}
                    title="Exponential MA"
                    onToggle={handleToggleEMA}
                    onPeriodChange={handlePeriodChangeEMA}
                    onLineSizeChange={handleLineSizeChangeEMA}
                    onColorChange={handleColorChangeEMA}
                  />
                )}

                {activeSubMenu === 'wma' && (
                  <CompactMAConfig
                    configs={config.indicators.wma}
                    title="Weighted MA"
                    onToggle={handleToggleWMA}
                    onPeriodChange={handlePeriodChangeWMA}
                    onLineSizeChange={handleLineSizeChangeWMA}
                    onColorChange={handleColorChangeWMA}
                  />
                )}

                {activeSubMenu === 'bb' && (
                  <CompactBBConfig
                    bbConfigs={config.indicators.bb}
                    onToggle={handleToggleBB}
                    onPeriodChange={handlePeriodChangeBB}
                    onStdDevChange={handleStdDevChangeBB}
                    onUpdateBB={updateBB}
                  />
                )}

                {activeSubMenu === 'vwap' && (
                  <CompactVWAPConfig
                    vwapConfigs={config.indicators.vwap}
                    onToggle={handleToggleVWAP}
                    onLengthChange={handleLengthChangeVWAP}
                    onLineSizeChange={handleLineSizeChangeVWAP}
                    onColorChange={handleColorChangeVWAP}
                  />
                )}

                {activeSubMenu === 'avl' && (
                  <CompactAVLConfig
                    configs={config.indicators.avl}
                    title="Average Value Line"
                    onToggle={handleToggleAVL}
                    onPeriodChange={handlePeriodChangeAVL}
                    onLineSizeChange={handleLineSizeChangeAVL}
                    onColorChange={handleColorChangeAVL}
                  />
                )}

                {activeSubMenu === 'sar' && (
                  <CompactSARConfig
                    sarConfigs={config.indicators.sar}
                    onToggle={handleToggleSAR}
                    onStartChange={handleStartChangeSAR}
                    onMaximumChange={handleMaximumChangeSAR}
                    onColorChange={handleColorChangeSAR}
                  />
                )}

                {activeSubMenu === 'trix' && (
                  <CompactTRIXConfig
                    trixConfigs={config.indicators.trix}
                    onToggle={handleToggleTRIX}
                    onPeriodChange={handlePeriodChangeTRIX}
                    onLineSizeChange={handleLineSizeChangeTRIX}
                    onColorChange={handleColorChangeTRIX}
                  />
                )}

                {activeSubMenu === 'supertrend' && (
                  <CompactSupertrendConfig
                    supertrendConfigs={config.indicators.supertrend}
                    onToggle={handleToggleSupertrend}
                    onATRLengthChange={handleATRLengthChange}
                    onFactorChange={handleFactorChange}
                    onUpLineWidthChange={handleUpLineWidthChange}
                    onDownLineWidthChange={handleDownLineWidthChange}
                    onUpLineColorChange={handleUpLineColorChange}
                    onDownLineColorChange={handleDownLineColorChange}
                    onUpBackgroundToggle={handleUpBackgroundToggle}
                    onDownBackgroundToggle={handleDownBackgroundToggle}
                    onUpBackgroundColorChange={handleUpBackgroundColorChange}
                    onDownBackgroundColorChange={handleDownBackgroundColorChange}
                  />
                )}
              </div>
            </>
          ) : (
            /* Sub Indicator Content */
            <>
              {/* Vertical Menu */}
              <div className="w-44 border-r border-gray-700 bg-gray-750/50">
                <div className="p-3">
                  <h3 className="text-xs text-gray-400 mb-3 font-medium">SUB INDICATORS</h3>
                  <nav className="space-y-1">
                    {[
                      { id: 'rsi', label: 'RSI' },
                      { id: 'mfi', label: 'MFI' },
                      { id: 'kdj', label: 'KDJ' },
                      { id: 'volume', label: 'Volume' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSubMenu(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                          activeSubMenu === item.id
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeSubMenu === 'rsi' && (
                  <CompactRSIConfig
                    rsiConfigs={config.indicators.rsi}
                    onToggle={handleToggleRSI}
                    onPeriodChange={handlePeriodChangeRSI}
                    onLineSizeChange={handleLineSizeChangeRSI}
                    onColorChange={handleColorChangeRSI}
                  />
                )}
                {activeSubMenu === 'mfi' && ( // Add this
                  <CompactMFIConfig
                    mfiConfigs={config.indicators.mfi}
                    onToggle={handleToggleMFI}
                    onPeriodChange={handlePeriodChangeMFI}
                    onLineSizeChange={handleLineSizeChangeMFI}
                    onColorChange={handleColorChangeMFI}
                  />
                )}
                {activeSubMenu === 'volume' && (
                  <CompactVolumeConfig
                    volumeConfigs={config.indicators.volume}
                    onToggle={handleToggleVolume}
                    onNameChange={handleNameChangeVolume}
                    onUpColorChange={handleUpColorChange}
                    onDownColorChange={handleDownColorChange}
                    onOpacityChange={handleOpacityChange}
                    onUpdateVolumeMA={handleUpdateVolumeMA}
                    onToggleVolumeMA={handleToggleVolumeMA}
                  />
                )}
                {activeSubMenu === 'kdj' && (
                  <CompactKDJConfig
                    kdjConfigs={config.indicators.kdj}
                    onToggle={handleToggleKDJ}
                    onPeriodChange={handlePeriodChangeKDJ}
                    onKPeriodChange={handleKPeriodChange}
                    onDPeriodChange={handleDPeriodChange}
                    onKLineSizeChange={handleKLineSizeChangeKDJ}
                    onDLineSizeChange={handleDLineSizeChangeKDJ}
                    onJLineSizeChange={handleJLineSizeChangeKDJ}
                    onKColorChange={handleKColorChangeKDJ}
                    onDColorChange={handleDColorChangeKDJ}
                    onJColorChange={handleJColorChangeKDJ}
                    onOverboughtChange={handleOverboughtChangeKDJ}
                    onOversoldChange={handleOversoldChangeKDJ}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};