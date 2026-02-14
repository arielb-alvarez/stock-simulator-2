// components/chart/indicators/IndicatorsDialog.tsx
import { useState, useCallback, useMemo } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { MTMConfig } from '@/context/types';
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
import { CompactEMVConfig } from './CompactEMVConfig';
import { CompactMTMConfig } from './CompactMTMConfig';

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
    toggleKDJ,
    updateEMV,
    toggleEMV,
    updateMTM,
    toggleMTM
  } = useGlobalContext();

  // Memoize menu items to prevent re-creation
  const mainMenuItems = useMemo(() => [
    { id: 'ma', label: 'MA' },
    { id: 'ema', label: 'EMA' },
    { id: 'wma', label: 'WMA' },
    { id: 'avl', label: 'AVL' },
    { id: 'bb', label: 'BB' },
    { id: 'vwap', label: 'VWAP' },
    { id: 'sar', label: 'SAR' },
    { id: 'trix', label: 'TRIX' },
    { id: 'supertrend', label: 'Supertrend' }
  ], []);

  const subMenuItems = useMemo(() => [
    { id: 'rsi', label: 'RSI' },
    { id: 'mfi', label: 'MFI' },
    { id: 'kdj', label: 'KDJ' },
    { id: 'emv', label: 'EMV' },
    { id: 'mtm', label: 'Momentum' },
    { id: 'volume', label: 'Volume' }
  ], []);

  // ==================== RSI Handlers ====================
  const handleToggleRSI = useCallback((rsiId: string) => {
    toggleRSI(rsiId);
  }, [toggleRSI]);

  const handlePeriodChangeRSI = useCallback((rsiId: string, period: number) => {
    updateRSI(rsiId, { period: Math.max(1, period) });
  }, [updateRSI]);

  const handleLineSizeChangeRSI = useCallback((rsiId: string, lineSize: number) => {
    updateRSI(rsiId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateRSI]);

  const handleColorChangeRSI = useCallback((rsiId: string, lineColor: string) => {
    updateRSI(rsiId, { lineColor });
  }, [updateRSI]);

  // ==================== MFI Handlers ====================
  const handleToggleMFI = useCallback((mfiId: string) => {
    toggleMFI(mfiId);
  }, [toggleMFI]);

  const handlePeriodChangeMFI = useCallback((mfiId: string, period: number) => {
    updateMFI(mfiId, { period: Math.max(1, period) });
  }, [updateMFI]);

  const handleLineSizeChangeMFI = useCallback((mfiId: string, lineSize: number) => {
    updateMFI(mfiId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateMFI]);

  const handleColorChangeMFI = useCallback((mfiId: string, lineColor: string) => {
    updateMFI(mfiId, { lineColor });
  }, [updateMFI]);

  // ==================== Volume Handlers ====================
  const handleToggleVolume = useCallback((volumeId: string) => {
    toggleVolume(volumeId);
  }, [toggleVolume]);

  const handleNameChangeVolume = useCallback((volumeId: string, name: string) => {
    updateVolume(volumeId, { name });
  }, [updateVolume]);

  const handleUpColorChange = useCallback((volumeId: string, upColor: string) => {
    updateVolume(volumeId, { upColor });
  }, [updateVolume]);

  const handleDownColorChange = useCallback((volumeId: string, downColor: string) => {
    updateVolume(volumeId, { downColor });
  }, [updateVolume]);

  const handleOpacityChange = useCallback((volumeId: string, opacity: number) => {
    updateVolume(volumeId, { opacity: Math.max(0.1, Math.min(1, opacity)) });
  }, [updateVolume]);

  const handleUpdateVolumeMA = useCallback((volumeId: string, maId: string, updates: any) => {
    updateVolumeMA(volumeId, maId, updates);
  }, [updateVolumeMA]);

  const handleToggleVolumeMA = useCallback((volumeId: string, maId: string) => {
    toggleVolumeMA(volumeId, maId);
  }, [toggleVolumeMA]);

  // ==================== MA Handlers ====================
  const handleToggleMA = useCallback((maId: string) => {
    toggleMA(maId);
  }, [toggleMA]);

  const handlePeriodChangeMA = useCallback((maId: string, period: number) => {
    updateMA(maId, { period: Math.max(1, period) });
  }, [updateMA]);

  const handleLineSizeChangeMA = useCallback((maId: string, lineSize: number) => {
    updateMA(maId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateMA]);

  const handleColorChangeMA = useCallback((maId: string, color: string) => {
    updateMA(maId, { color });
  }, [updateMA]);

  // ==================== EMA Handlers ====================
  const handleToggleEMA = useCallback((emaId: string) => {
    toggleEMA(emaId);
  }, [toggleEMA]);

  const handlePeriodChangeEMA = useCallback((emaId: string, period: number) => {
    updateEMA(emaId, { period: Math.max(1, period) });
  }, [updateEMA]);

  const handleLineSizeChangeEMA = useCallback((emaId: string, lineSize: number) => {
    updateEMA(emaId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateEMA]);

  const handleColorChangeEMA = useCallback((emaId: string, color: string) => {
    updateEMA(emaId, { color });
  }, [updateEMA]);

  // ==================== WMA Handlers ====================
  const handleToggleWMA = useCallback((wmaId: string) => {
    toggleWMA(wmaId);
  }, [toggleWMA]);

  const handlePeriodChangeWMA = useCallback((wmaId: string, period: number) => {
    updateWMA(wmaId, { period: Math.max(1, period) });
  }, [updateWMA]);

  const handleLineSizeChangeWMA = useCallback((wmaId: string, lineSize: number) => {
    updateWMA(wmaId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateWMA]);

  const handleColorChangeWMA = useCallback((wmaId: string, color: string) => {
    updateWMA(wmaId, { color });
  }, [updateWMA]);

  // ==================== BB Handlers ====================
  const handleToggleBB = useCallback((bbId: string) => {
    toggleBB(bbId);
  }, [toggleBB]);

  const handlePeriodChangeBB = useCallback((bbId: string, period: number) => {
    updateBB(bbId, { period: Math.max(1, period) });
  }, [updateBB]);

  const handleStdDevChangeBB = useCallback((bbId: string, stdDev: number) => {
    updateBB(bbId, { stdDev: Math.max(0.1, Math.min(5, stdDev)) });
  }, [updateBB]);

  // ==================== VWAP Handlers ====================
  const handleToggleVWAP = useCallback((vwapId: string) => {
    toggleVWAP(vwapId);
  }, [toggleVWAP]);

  const handleLengthChangeVWAP = useCallback((vwapId: string, length: number) => {
    updateVWAP(vwapId, { length: Math.max(0, length) });
  }, [updateVWAP]);

  const handleLineSizeChangeVWAP = useCallback((vwapId: string, lineSize: number) => {
    updateVWAP(vwapId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateVWAP]);

  const handleColorChangeVWAP = useCallback((vwapId: string, color: string) => {
    updateVWAP(vwapId, { color });
  }, [updateVWAP]);

  // ==================== AVL Handlers ====================
  const handleToggleAVL = useCallback((avlId: string) => {
    toggleAVL(avlId);
  }, [toggleAVL]);

  const handlePeriodChangeAVL = useCallback((avlId: string, period: number) => {
    updateAVL(avlId, { period: Math.max(1, period) });
  }, [updateAVL]);

  const handleLineSizeChangeAVL = useCallback((avlId: string, lineSize: number) => {
    updateAVL(avlId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateAVL]);

  const handleColorChangeAVL = useCallback((avlId: string, color: string) => {
    updateAVL(avlId, { color });
  }, [updateAVL]);

  // ==================== SAR Handlers ====================
  const handleToggleSAR = useCallback((sarId: string) => {
    toggleSAR(sarId);
  }, [toggleSAR]);

  const handleStartChangeSAR = useCallback((sarId: string, start: number) => {
    updateSAR(sarId, { start: Math.max(0.001, Math.min(0.1, start)) });
  }, [updateSAR]);

  const handleMaximumChangeSAR = useCallback((sarId: string, maximum: number) => {
    updateSAR(sarId, { maximum: Math.max(0.01, Math.min(1, maximum)) });
  }, [updateSAR]);

  const handleColorChangeSAR = useCallback((sarId: string, color: string) => {
    updateSAR(sarId, { color });
  }, [updateSAR]);

  // ==================== TRIX Handlers ====================
  const handleToggleTRIX = useCallback((trixId: string) => {
    toggleTRIX(trixId);
  }, [toggleTRIX]);

  const handlePeriodChangeTRIX = useCallback((trixId: string, period: number) => {
    updateTRIX(trixId, { period: Math.max(1, period) });
  }, [updateTRIX]);

  const handleLineSizeChangeTRIX = useCallback((trixId: string, lineSize: number) => {
    updateTRIX(trixId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateTRIX]);

  const handleColorChangeTRIX = useCallback((trixId: string, color: string) => {
    updateTRIX(trixId, { color });
  }, [updateTRIX]);

  // ==================== Supertrend Handlers ====================
  const handleToggleSupertrend = useCallback((supertrendId: string) => {
    toggleSupertrend(supertrendId);
  }, [toggleSupertrend]);

  const handleATRLengthChange = useCallback((supertrendId: string, atrLength: number) => {
    updateSupertrend(supertrendId, { atrLength: Math.max(1, Math.min(100, atrLength)) });
  }, [updateSupertrend]);

  const handleFactorChange = useCallback((supertrendId: string, factor: number) => {
    updateSupertrend(supertrendId, { factor: Math.max(0.1, Math.min(10, factor)) });
  }, [updateSupertrend]);

  const handleUpLineWidthChange = useCallback((supertrendId: string, lineWidth: number) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        lineWidth: Math.max(0.5, Math.min(5, lineWidth)) 
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleDownLineWidthChange = useCallback((supertrendId: string, lineWidth: number) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        lineWidth: Math.max(0.5, Math.min(5, lineWidth)) 
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleUpLineColorChange = useCallback((supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        lineColor: color
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleDownLineColorChange = useCallback((supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        lineColor: color
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleUpBackgroundToggle = useCallback((supertrendId: string, show: boolean) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend.background,
          show 
        }
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleDownBackgroundToggle = useCallback((supertrendId: string, show: boolean) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend.background,
          show 
        }
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleUpBackgroundColorChange = useCallback((supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      upTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.upTrend.background,
          color 
        }
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  const handleDownBackgroundColorChange = useCallback((supertrendId: string, color: string) => {
    updateSupertrend(supertrendId, { 
      downTrend: { 
        ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend,
        background: { 
          ...config.indicators.supertrend.find(st => st.id === supertrendId)!.downTrend.background,
          color 
        }
      } 
    });
  }, [updateSupertrend, config.indicators.supertrend]);

  // ==================== KDJ Handlers ====================
  const handleToggleKDJ = useCallback((kdjId: string) => {
    toggleKDJ(kdjId);
  }, [toggleKDJ]);

  const handlePeriodChangeKDJ = useCallback((kdjId: string, period: number) => {
    updateKDJ(kdjId, { period: Math.max(1, period) });
  }, [updateKDJ]);

  const handleKPeriodChange = useCallback((kdjId: string, kPeriod: number) => {
    updateKDJ(kdjId, { kPeriod: Math.max(1, kPeriod) });
  }, [updateKDJ]);

  const handleDPeriodChange = useCallback((kdjId: string, dPeriod: number) => {
    updateKDJ(kdjId, { dPeriod: Math.max(1, dPeriod) });
  }, [updateKDJ]);

  const handleKLineSizeChangeKDJ = useCallback((kdjId: string, lineSize: number) => {
    updateKDJ(kdjId, { kLineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateKDJ]);

  const handleDLineSizeChangeKDJ = useCallback((kdjId: string, lineSize: number) => {
    updateKDJ(kdjId, { dLineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateKDJ]);

  const handleJLineSizeChangeKDJ = useCallback((kdjId: string, lineSize: number) => {
    updateKDJ(kdjId, { jLineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateKDJ]);

  const handleKColorChangeKDJ = useCallback((kdjId: string, color: string) => {
    updateKDJ(kdjId, { kLineColor: color });
  }, [updateKDJ]);

  const handleDColorChangeKDJ = useCallback((kdjId: string, color: string) => {
    updateKDJ(kdjId, { dLineColor: color });
  }, [updateKDJ]);

  const handleJColorChangeKDJ = useCallback((kdjId: string, color: string) => {
    updateKDJ(kdjId, { jLineColor: color });
  }, [updateKDJ]);

  const handleOverboughtChangeKDJ = useCallback((kdjId: string, value: number) => {
    updateKDJ(kdjId, { overbought: Math.max(50, Math.min(100, value)) });
  }, [updateKDJ]);

  const handleOversoldChangeKDJ = useCallback((kdjId: string, value: number) => {
    updateKDJ(kdjId, { oversold: Math.max(0, Math.min(50, value)) });
  }, [updateKDJ]);

  // ==================== EMV Handlers ====================
  const handleToggleEMV = useCallback((emvId: string) => {
    toggleEMV(emvId);
  }, [toggleEMV]);

  const handlePeriodChangeEMV = useCallback((emvId: string, period: number) => {
    updateEMV(emvId, { period: Math.max(5, Math.min(50, period)) });
  }, [updateEMV]);

  const handleDivisorChange = useCallback((emvId: string, divisor: number) => {
    updateEMV(emvId, { divisor: Math.max(1000, Math.min(1000000, divisor)) });
  }, [updateEMV]);

  const handleLineSizeChangeEMV = useCallback((emvId: string, lineSize: number) => {
    updateEMV(emvId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateEMV]);

  const handleColorChangeEMV = useCallback((emvId: string, color: string) => {
    updateEMV(emvId, { lineColor: color });
  }, [updateEMV]);

  // ==================== MTM Handlers ====================
  const handleToggleMTM = useCallback((mtmId: string) => {
    toggleMTM(mtmId);
  }, [toggleMTM]);

  const handlePeriodChangeMTM = useCallback((mtmId: string, period: number) => {
    updateMTM(mtmId, { period: Math.max(1, period) });
  }, [updateMTM]);

  const handlePriceTypeChangeMTM = useCallback((mtmId: string, priceType: MTMConfig['priceType']) => {
    updateMTM(mtmId, { priceType });
  }, [updateMTM]);

  const handleLineSizeChangeMTM = useCallback((mtmId: string, lineSize: number) => {
    updateMTM(mtmId, { lineSize: Math.max(0.5, Math.min(5, lineSize)) });
  }, [updateMTM]);

  const handleColorChangeMTM = useCallback((mtmId: string, color: string) => {
    updateMTM(mtmId, { lineColor: color });
  }, [updateMTM]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-[680px] h-full max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-gray-600 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-white">Indicators</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-lg p-1 rounded hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 flex-shrink-0">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'main'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Main Chart
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'sub'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sub Chart
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
          {activeTab === 'main' ? (
            /* Main Indicator Content */
            <>
              {/* Vertical Menu */}
              <div className="sm:w-44 border-b sm:border-b-0 sm:border-r border-gray-700 bg-gray-750/50 flex-shrink-0 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto">
                <div className="p-3 min-w-max sm:min-w-0 sm:pb-4">
                  <h3 className="text-xs text-gray-400 mb-3 font-medium hidden sm:block sticky top-0 bg-gray-750/95 py-1 z-10">MAIN INDICATORS</h3>
                  <nav className="flex sm:flex-col gap-1 sm:gap-0 sm:space-y-1">
                    {mainMenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSubMenu(item.id)}
                        className={`px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 sm:flex-shrink ${
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
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
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
              <div className="sm:w-44 border-b sm:border-b-0 sm:border-r border-gray-700 bg-gray-750/50 flex-shrink-0 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto">
                <div className="p-3 min-w-max sm:min-w-0 sm:pb-4">
                  <h3 className="text-xs text-gray-400 mb-3 font-medium hidden sm:block sticky top-0 bg-gray-750/95 py-1 z-10">SUB INDICATORS</h3>
                  <nav className="flex sm:flex-col gap-1 sm:gap-0 sm:space-y-1">
                    {subMenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSubMenu(item.id)}
                        className={`px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 sm:flex-shrink ${
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
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
                {activeSubMenu === 'rsi' && (
                  <CompactRSIConfig
                    rsiConfigs={config.indicators.rsi}
                    onToggle={handleToggleRSI}
                    onPeriodChange={handlePeriodChangeRSI}
                    onLineSizeChange={handleLineSizeChangeRSI}
                    onColorChange={handleColorChangeRSI}
                  />
                )}
                {activeSubMenu === 'mfi' && (
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
                {activeSubMenu === 'emv' && (
                  <CompactEMVConfig
                    emvConfigs={config.indicators.emv}
                    onToggle={handleToggleEMV}
                    onPeriodChange={handlePeriodChangeEMV}
                    onDivisorChange={handleDivisorChange}
                    onLineSizeChange={handleLineSizeChangeEMV}
                    onColorChange={handleColorChangeEMV}
                  />
                )}
                {activeSubMenu === 'mtm' && (
                  <CompactMTMConfig
                    mtmConfigs={config.indicators.mtm}
                    onToggle={handleToggleMTM}
                    onPeriodChange={handlePeriodChangeMTM}
                    onPriceTypeChange={handlePriceTypeChangeMTM}
                    onLineSizeChange={handleLineSizeChangeMTM}
                    onColorChange={handleColorChangeMTM}
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