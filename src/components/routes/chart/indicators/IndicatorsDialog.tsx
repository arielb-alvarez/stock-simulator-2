// components/chart/indicators/IndicatorsDialog.tsx
import React, { useState, useCallback, useMemo, memo, Suspense, lazy, useEffect } from 'react';
import { useGlobalApi, useGlobalConfig } from '@/context/GlobalContext';
import { MTMConfig } from '@/context/types';

// --- Lazy load all indicator config panels (using named exports) ---
const CompactMAConfig = lazy(() =>
  import('./CompactMAConfig').then(module => ({ default: module.CompactMAConfig }))
);
const CompactRSIConfig = lazy(() =>
  import('./CompactRSIConfig').then(module => ({ default: module.CompactRSIConfig }))
);
const CompactMFIConfig = lazy(() =>
  import('./CompactMFIConfig').then(module => ({ default: module.CompactMFIConfig }))
);
const CompactVolumeConfig = lazy(() =>
  import('./CompactVolumeConfig').then(module => ({ default: module.CompactVolumeConfig }))
);
const CompactBBConfig = lazy(() =>
  import('./CompactBBConfig').then(module => ({ default: module.CompactBBConfig }))
);
const CompactVWAPConfig = lazy(() =>
  import('./CompactVWAPConfig').then(module => ({ default: module.CompactVWAPConfig }))
);
const CompactAVLConfig = lazy(() =>
  import('./CompactAVLConfig').then(module => ({ default: module.CompactAVLConfig }))
);
const CompactSARConfig = lazy(() =>
  import('./CompactSARConfig').then(module => ({ default: module.CompactSARConfig }))
);
const CompactTRIXConfig = lazy(() =>
  import('./CompactTRIXConfig').then(module => ({ default: module.CompactTRIXConfig }))
);
const CompactSupertrendConfig = lazy(() =>
  import('./CompactSuperTrendConfig').then(module => ({ default: module.CompactSupertrendConfig }))
);
const CompactKDJConfig = lazy(() =>
  import('./CompactKDJConfig').then(module => ({ default: module.CompactKDJConfig }))
);
const CompactEMVConfig = lazy(() =>
  import('./CompactEMVConfig').then(module => ({ default: module.CompactEMVConfig }))
);
const CompactMTMConfig = lazy(() =>
  import('./CompactMTMConfig').then(module => ({ default: module.CompactMTMConfig }))
);

// --- Constants ---
const defaultIndicators = {
  rsi: [], mfi: [], volume: [], ma: [], ema: [], wma: [],
  bb: [], vwap: [], avl: [], sar: [], trix: [], supertrend: [],
  kdj: [], emv: [], mtm: []
};

const MAIN_MENU_ITEMS = [
  { id: 'ma', label: 'MA' },
  { id: 'ema', label: 'EMA' },
  { id: 'wma', label: 'WMA' },
  { id: 'avl', label: 'AVL' },
  { id: 'bb', label: 'BB' },
  { id: 'vwap', label: 'VWAP' },
  { id: 'sar', label: 'SAR' },
  { id: 'trix', label: 'TRIX' },
  { id: 'supertrend', label: 'Supertrend' }
] as const;

const SUB_MENU_ITEMS = [
  { id: 'rsi', label: 'RSI' },
  { id: 'mfi', label: 'MFI' },
  { id: 'kdj', label: 'KDJ' },
  { id: 'emv', label: 'EMV' },
  { id: 'mtm', label: 'Momentum' },
  { id: 'volume', label: 'Volume' }
] as const;

// --- Memoized MenuItem component ---
const MenuItem = memo(({
  item,
  activeSubMenu,
  onClick
}: {
  item: { id: string; label: string };
  activeSubMenu: string;
  onClick: (id: string) => void;
}) => (
  <button
    onClick={() => onClick(item.id)}
    className={`px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 sm:flex-shrink ${
      activeSubMenu === item.id
        ? 'bg-yellow-500/20 text-yellow-400'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
    }`}
  >
    {item.label}
  </button>
));
MenuItem.displayName = 'MenuItem';

// --- Memoized TabButton ---
const TabButton = memo(({
  tab,
  activeTab,
  onClick
}: {
  tab: 'main' | 'sub';
  activeTab: 'main' | 'sub';
  onClick: (tab: 'main' | 'sub') => void;
}) => (
  <button
    onClick={() => onClick(tab)}
    className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'text-yellow-400 border-b-2 border-yellow-400'
        : 'text-gray-400 hover:text-gray-200'
    }`}
  >
    {tab === 'main' ? 'Main Chart' : 'Sub Chart'}
  </button>
));
TabButton.displayName = 'TabButton';

// --- Main DialogContent component (memoized) ---
interface DialogContentProps {
  indicatorApi: any;
  activeTab: 'main' | 'sub';
  activeSubMenu: string;
  onClose: () => void;
  onTabChange: (tab: 'main' | 'sub') => void;
  onSubMenuChange: (menuId: string) => void;
}

const DialogContent = memo(({
  indicatorApi,
  activeTab,
  activeSubMenu,
  onClose,
  onTabChange,
  onSubMenuChange
}: DialogContentProps) => {
  // --- Stable callbacks for each indicator type ---
  const handleMAPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.ma?.update?.(id, { period });
  }, [indicatorApi.ma]);
  const handleMALineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.ma?.update?.(id, { lineSize });
  }, [indicatorApi.ma]);
  const handleMAColorChange = useCallback((id: string, color: string) => {
    indicatorApi.ma?.update?.(id, { color });
  }, [indicatorApi.ma]);

  const handleEMAPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.ema?.update?.(id, { period });
  }, [indicatorApi.ema]);
  const handleEMALineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.ema?.update?.(id, { lineSize });
  }, [indicatorApi.ema]);
  const handleEMAColorChange = useCallback((id: string, color: string) => {
    indicatorApi.ema?.update?.(id, { color });
  }, [indicatorApi.ema]);

  const handleWMAPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.wma?.update?.(id, { period });
  }, [indicatorApi.wma]);
  const handleWMALineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.wma?.update?.(id, { lineSize });
  }, [indicatorApi.wma]);
  const handleWMAColorChange = useCallback((id: string, color: string) => {
    indicatorApi.wma?.update?.(id, { color });
  }, [indicatorApi.wma]);

  const handleAVLPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.avl?.update?.(id, { period });
  }, [indicatorApi.avl]);
  const handleAVLLineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.avl?.update?.(id, { lineSize });
  }, [indicatorApi.avl]);
  const handleAVLColorChange = useCallback((id: string, color: string) => {
    indicatorApi.avl?.update?.(id, { color });
  }, [indicatorApi.avl]);

  const handleBBPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.bb?.update?.(id, { period });
  }, [indicatorApi.bb]);
  const handleBBStdDevChange = useCallback((id: string, stdDev: number) => {
    indicatorApi.bb?.update?.(id, { stdDev });
  }, [indicatorApi.bb]);
  const handleBBUpdate = useCallback((id: string, updates: any) => {
    indicatorApi.bb?.update?.(id, updates);
  }, [indicatorApi.bb]);

  const handleVWAPLengthChange = useCallback((id: string, length: number) => {
    indicatorApi.vwap?.update?.(id, { length });
  }, [indicatorApi.vwap]);
  const handleVWAPLineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.vwap?.update?.(id, { lineSize });
  }, [indicatorApi.vwap]);
  const handleVWAPColorChange = useCallback((id: string, color: string) => {
    indicatorApi.vwap?.update?.(id, { color });
  }, [indicatorApi.vwap]);

  const handleSARStartChange = useCallback((id: string, start: number) => {
    indicatorApi.sar?.update?.(id, { start });
  }, [indicatorApi.sar]);
  const handleSARMaximumChange = useCallback((id: string, maximum: number) => {
    indicatorApi.sar?.update?.(id, { maximum });
  }, [indicatorApi.sar]);
  const handleSARColorChange = useCallback((id: string, color: string) => {
    indicatorApi.sar?.update?.(id, { color });
  }, [indicatorApi.sar]);

  const handleTRIXPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.trix?.update?.(id, { period });
  }, [indicatorApi.trix]);
  const handleTRIXLineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.trix?.update?.(id, { lineSize });
  }, [indicatorApi.trix]);
  const handleTRIXColorChange = useCallback((id: string, color: string) => {
    indicatorApi.trix?.update?.(id, { color });
  }, [indicatorApi.trix]);

  // Sub indicators
  const handleRSIPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.rsi?.update?.(id, { period });
  }, [indicatorApi.rsi]);
  const handleRSILineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.rsi?.update?.(id, { lineSize });
  }, [indicatorApi.rsi]);
  const handleRSIColorChange = useCallback((id: string, lineColor: string) => {
    indicatorApi.rsi?.update?.(id, { lineColor });
  }, [indicatorApi.rsi]);

  const handleMFIPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.mfi?.update?.(id, { period });
  }, [indicatorApi.mfi]);
  const handleMFILineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.mfi?.update?.(id, { lineSize });
  }, [indicatorApi.mfi]);
  const handleMFIColorChange = useCallback((id: string, lineColor: string) => {
    indicatorApi.mfi?.update?.(id, { lineColor });
  }, [indicatorApi.mfi]);

  const handleVolumeNameChange = useCallback((id: string, name: string) => {
    indicatorApi.volume?.update?.(id, { name });
  }, [indicatorApi.volume]);
  const handleVolumeUpColorChange = useCallback((id: string, upColor: string) => {
    indicatorApi.volume?.update?.(id, { upColor });
  }, [indicatorApi.volume]);
  const handleVolumeDownColorChange = useCallback((id: string, downColor: string) => {
    indicatorApi.volume?.update?.(id, { downColor });
  }, [indicatorApi.volume]);
  const handleVolumeOpacityChange = useCallback((id: string, opacity: number) => {
    indicatorApi.volume?.update?.(id, { opacity });
  }, [indicatorApi.volume]);
  const handleVolumeMAUpdate = useCallback((volumeId: string, maId: string, updates: any) => {
    indicatorApi.volume?.updateMA?.(volumeId, maId, updates);
  }, [indicatorApi.volume]);
  const handleToggleVolumeMA = useCallback((volumeId: string, maId: string) => {
    indicatorApi.volume?.toggleMA?.(volumeId, maId);
  }, [indicatorApi.volume]);

  const handleKDJUpdate = useCallback((id: string, updates: any) => {
    indicatorApi.kdj?.update?.(id, updates);
  }, [indicatorApi.kdj]);

  const handleEMVPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.emv?.update?.(id, { period });
  }, [indicatorApi.emv]);
  const handleEMVDivisorChange = useCallback((id: string, divisor: number) => {
    indicatorApi.emv?.update?.(id, { divisor });
  }, [indicatorApi.emv]);
  const handleEMVLineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.emv?.update?.(id, { lineSize });
  }, [indicatorApi.emv]);
  const handleEMVColorChange = useCallback((id: string, lineColor: string) => {
    indicatorApi.emv?.update?.(id, { lineColor });
  }, [indicatorApi.emv]);

  const handleMTMPeriodChange = useCallback((id: string, period: number) => {
    indicatorApi.mtm?.update?.(id, { period });
  }, [indicatorApi.mtm]);
  const handleMTMPriceTypeChange = useCallback((id: string, priceType: string) => {
    indicatorApi.mtm?.update?.(id, { priceType });
  }, [indicatorApi.mtm]);
  const handleMTMLineSizeChange = useCallback((id: string, lineSize: number) => {
    indicatorApi.mtm?.update?.(id, { lineSize });
  }, [indicatorApi.mtm]);
  const handleMTMColorChange = useCallback((id: string, lineColor: string) => {
    indicatorApi.mtm?.update?.(id, { lineColor });
  }, [indicatorApi.mtm]);

  // --- Memoized components for each indicator ---
  const maComponent = useMemo(() => indicatorApi.ma?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading MA...</div>}>
      <CompactMAConfig
        configs={indicatorApi.ma.configs}
        title="Moving Average"
        onToggle={indicatorApi.ma.toggle}
        onPeriodChange={handleMAPeriodChange}
        onLineSizeChange={handleMALineSizeChange}
        onColorChange={handleMAColorChange}
      />
    </Suspense>
  ), [indicatorApi.ma, handleMAPeriodChange, handleMALineSizeChange, handleMAColorChange]);

  const emaComponent = useMemo(() => indicatorApi.ema?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading EMA...</div>}>
      <CompactMAConfig
        configs={indicatorApi.ema.configs}
        title="Exponential MA"
        onToggle={indicatorApi.ema.toggle}
        onPeriodChange={handleEMAPeriodChange}
        onLineSizeChange={handleEMALineSizeChange}
        onColorChange={handleEMAColorChange}
      />
    </Suspense>
  ), [indicatorApi.ema, handleEMAPeriodChange, handleEMALineSizeChange, handleEMAColorChange]);

  const wmaComponent = useMemo(() => indicatorApi.wma?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading WMA...</div>}>
      <CompactMAConfig
        configs={indicatorApi.wma.configs}
        title="Weighted MA"
        onToggle={indicatorApi.wma.toggle}
        onPeriodChange={handleWMAPeriodChange}
        onLineSizeChange={handleWMALineSizeChange}
        onColorChange={handleWMAColorChange}
      />
    </Suspense>
  ), [indicatorApi.wma, handleWMAPeriodChange, handleWMALineSizeChange, handleWMAColorChange]);

  const avlComponent = useMemo(() => indicatorApi.avl?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading AVL...</div>}>
      <CompactAVLConfig
        configs={indicatorApi.avl.configs}
        title="Average Value Line"
        onToggle={indicatorApi.avl.toggle}
        onPeriodChange={handleAVLPeriodChange}
        onLineSizeChange={handleAVLLineSizeChange}
        onColorChange={handleAVLColorChange}
      />
    </Suspense>
  ), [indicatorApi.avl, handleAVLPeriodChange, handleAVLLineSizeChange, handleAVLColorChange]);

  const bbComponent = useMemo(() => indicatorApi.bb?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading BB...</div>}>
      <CompactBBConfig
        bbConfigs={indicatorApi.bb.configs}
        onToggle={indicatorApi.bb.toggle}
        onPeriodChange={handleBBPeriodChange}
        onStdDevChange={handleBBStdDevChange}
        onUpdateBB={handleBBUpdate}
      />
    </Suspense>
  ), [indicatorApi.bb, handleBBPeriodChange, handleBBStdDevChange, handleBBUpdate]);

  const vwapComponent = useMemo(() => indicatorApi.vwap?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading VWAP...</div>}>
      <CompactVWAPConfig
        vwapConfigs={indicatorApi.vwap.configs}
        onToggle={indicatorApi.vwap.toggle}
        onLengthChange={handleVWAPLengthChange}
        onLineSizeChange={handleVWAPLineSizeChange}
        onColorChange={handleVWAPColorChange}
      />
    </Suspense>
  ), [indicatorApi.vwap, handleVWAPLengthChange, handleVWAPLineSizeChange, handleVWAPColorChange]);

  const sarComponent = useMemo(() => indicatorApi.sar?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading SAR...</div>}>
      <CompactSARConfig
        sarConfigs={indicatorApi.sar.configs}
        onToggle={indicatorApi.sar.toggle}
        onStartChange={handleSARStartChange}
        onMaximumChange={handleSARMaximumChange}
        onColorChange={handleSARColorChange}
      />
    </Suspense>
  ), [indicatorApi.sar, handleSARStartChange, handleSARMaximumChange, handleSARColorChange]);

  const trixComponent = useMemo(() => indicatorApi.trix?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading TRIX...</div>}>
      <CompactTRIXConfig
        trixConfigs={indicatorApi.trix.configs}
        onToggle={indicatorApi.trix.toggle}
        onPeriodChange={handleTRIXPeriodChange}
        onLineSizeChange={handleTRIXLineSizeChange}
        onColorChange={handleTRIXColorChange}
      />
    </Suspense>
  ), [indicatorApi.trix, handleTRIXPeriodChange, handleTRIXLineSizeChange, handleTRIXColorChange]);

  // Sub indicators
  const rsiComponent = useMemo(() => indicatorApi.rsi?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading RSI...</div>}>
      <CompactRSIConfig
        rsiConfigs={indicatorApi.rsi.configs}
        onToggle={indicatorApi.rsi.toggle}
        onPeriodChange={handleRSIPeriodChange}
        onLineSizeChange={handleRSILineSizeChange}
        onColorChange={handleRSIColorChange}
      />
    </Suspense>
  ), [indicatorApi.rsi, handleRSIPeriodChange, handleRSILineSizeChange, handleRSIColorChange]);

  const mfiComponent = useMemo(() => indicatorApi.mfi?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading MFI...</div>}>
      <CompactMFIConfig
        mfiConfigs={indicatorApi.mfi.configs}
        onToggle={indicatorApi.mfi.toggle}
        onPeriodChange={handleMFIPeriodChange}
        onLineSizeChange={handleMFILineSizeChange}
        onColorChange={handleMFIColorChange}
      />
    </Suspense>
  ), [indicatorApi.mfi, handleMFIPeriodChange, handleMFILineSizeChange, handleMFIColorChange]);

  const volumeComponent = useMemo(() => indicatorApi.volume?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading Volume...</div>}>
      <CompactVolumeConfig
        volumeConfigs={indicatorApi.volume.configs}
        onToggle={indicatorApi.volume.toggle}
        onNameChange={handleVolumeNameChange}
        onUpColorChange={handleVolumeUpColorChange}
        onDownColorChange={handleVolumeDownColorChange}
        onOpacityChange={handleVolumeOpacityChange}
        onUpdateVolumeMA={handleVolumeMAUpdate}
        onToggleVolumeMA={handleToggleVolumeMA}
      />
    </Suspense>
  ), [indicatorApi.volume, handleVolumeNameChange, handleVolumeUpColorChange, handleVolumeDownColorChange, handleVolumeOpacityChange, handleVolumeMAUpdate, handleToggleVolumeMA]);

  const kdjComponent = useMemo(() => indicatorApi.kdj?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading KDJ...</div>}>
      <CompactKDJConfig
        kdjConfigs={indicatorApi.kdj.configs}
        onToggle={indicatorApi.kdj.toggle}
        onUpdateKDJ={handleKDJUpdate}
      />
    </Suspense>
  ), [indicatorApi.kdj, handleKDJUpdate]);

  const emvComponent = useMemo(() => indicatorApi.emv?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading EMV...</div>}>
      <CompactEMVConfig
        emvConfigs={indicatorApi.emv.configs}
        onToggle={indicatorApi.emv.toggle}
        onPeriodChange={handleEMVPeriodChange}
        onDivisorChange={handleEMVDivisorChange}
        onLineSizeChange={handleEMVLineSizeChange}
        onColorChange={handleEMVColorChange}
      />
    </Suspense>
  ), [indicatorApi.emv, handleEMVPeriodChange, handleEMVDivisorChange, handleEMVLineSizeChange, handleEMVColorChange]);

  const mtmComponent = useMemo(() => indicatorApi.mtm?.configs && (
    <Suspense fallback={<div className="text-gray-400">Loading Momentum...</div>}>
      <CompactMTMConfig
        mtmConfigs={indicatorApi.mtm.configs}
        onToggle={indicatorApi.mtm.toggle}
        onPeriodChange={handleMTMPeriodChange}
        onPriceTypeChange={handleMTMPriceTypeChange}
        onLineSizeChange={handleMTMLineSizeChange}
        onColorChange={handleMTMColorChange}
      />
    </Suspense>
  ), [indicatorApi.mtm, handleMTMPeriodChange, handleMTMPriceTypeChange, handleMTMLineSizeChange, handleMTMColorChange]);

  return (
    <div className="bg-gray-800 rounded-xl w-full max-w-[680px] h-full max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-gray-600 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-base sm:text-lg font-semibold text-white">Indicators</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-lg p-1 rounded hover:bg-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 flex-shrink-0">
        <TabButton tab="main" activeTab={activeTab} onClick={onTabChange} />
        <TabButton tab="sub" activeTab={activeTab} onClick={onTabChange} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
        {activeTab === 'main' ? (
          <>
            {/* Vertical Menu - Main */}
            <div className="sm:w-44 border-b sm:border-b-0 sm:border-r border-gray-700 bg-gray-750/50 flex-shrink-0 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto">
              <div className="p-3 min-w-max sm:min-w-0 sm:pb-4">
                <h3 className="text-xs text-gray-400 mb-3 font-medium hidden sm:block sticky top-0 bg-gray-750/95 py-1 z-10">MAIN INDICATORS</h3>
                <nav className="flex sm:flex-col gap-1 sm:gap-0 sm:space-y-1">
                  {MAIN_MENU_ITEMS.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      activeSubMenu={activeSubMenu}
                      onClick={onSubMenuChange}
                    />
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area - Main */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
              {activeSubMenu === 'ma' && maComponent}
              {activeSubMenu === 'ema' && emaComponent}
              {activeSubMenu === 'wma' && wmaComponent}
              {activeSubMenu === 'avl' && avlComponent}
              {activeSubMenu === 'bb' && bbComponent}
              {activeSubMenu === 'vwap' && vwapComponent}
              {activeSubMenu === 'sar' && sarComponent}
              {activeSubMenu === 'trix' && trixComponent}
              {/* Supertrend is commented out in original */}
            </div>
          </>
        ) : (
          <>
            {/* Vertical Menu - Sub */}
            <div className="sm:w-44 border-b sm:border-b-0 sm:border-r border-gray-700 bg-gray-750/50 flex-shrink-0 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto">
              <div className="p-3 min-w-max sm:min-w-0 sm:pb-4">
                <h3 className="text-xs text-gray-400 mb-3 font-medium hidden sm:block sticky top-0 bg-gray-750/95 py-1 z-10">SUB INDICATORS</h3>
                <nav className="flex sm:flex-col gap-1 sm:gap-0 sm:space-y-1">
                  {SUB_MENU_ITEMS.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      activeSubMenu={activeSubMenu}
                      onClick={onSubMenuChange}
                    />
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area - Sub */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
              {activeSubMenu === 'rsi' && rsiComponent}
              {activeSubMenu === 'mfi' && mfiComponent}
              {activeSubMenu === 'volume' && volumeComponent}
              {activeSubMenu === 'kdj' && kdjComponent}
              {activeSubMenu === 'emv' && emvComponent}
              {activeSubMenu === 'mtm' && mtmComponent}
            </div>
          </>
        )}
      </div>
    </div>
  );
});
DialogContent.displayName = 'DialogContent';

// --- Main IndicatorsDialog component ---
interface IndicatorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IndicatorsDialog: React.FC<IndicatorsDialogProps> = ({ isOpen, onClose }) => {
  const config = useGlobalConfig();
  const api = useGlobalApi();

  const [activeTab, setActiveTab] = useState<'main' | 'sub'>('main');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('ma');

  const handleTabChange = useCallback((tab: 'main' | 'sub') => {
    setActiveTab(tab);
    setActiveSubMenu(tab === 'main' ? 'ma' : 'rsi');
  }, []);

  const handleSubMenuChange = useCallback((menuId: string) => {
    setActiveSubMenu(menuId);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const indicatorApi = useMemo(() => {
    const indicators = config?.indicators || defaultIndicators;
    return {
      rsi: {
        configs: indicators.rsi,
        toggle: api.toggleRSI,
        update: api.updateRSI,
      },
      mfi: {
        configs: indicators.mfi,
        toggle: api.toggleMFI,
        update: api.updateMFI,
      },
      volume: {
        configs: indicators.volume,
        toggle: api.toggleVolume,
        update: api.updateVolume,
        updateMA: api.updateVolumeMA,
        toggleMA: api.toggleVolumeMA,
      },
      ma: {
        configs: indicators.ma,
        toggle: api.toggleMA,
        update: api.updateMA,
      },
      ema: {
        configs: indicators.ema,
        toggle: api.toggleEMA,
        update: api.updateEMA,
      },
      wma: {
        configs: indicators.wma,
        toggle: api.toggleWMA,
        update: api.updateWMA,
      },
      bb: {
        configs: indicators.bb,
        toggle: api.toggleBB,
        update: api.updateBB,
      },
      vwap: {
        configs: indicators.vwap,
        toggle: api.toggleVWAP,
        update: api.updateVWAP,
      },
      avl: {
        configs: indicators.avl,
        toggle: api.toggleAVL,
        update: api.updateAVL,
      },
      sar: {
        configs: indicators.sar,
        toggle: api.toggleSAR,
        update: api.updateSAR,
      },
      trix: {
        configs: indicators.trix,
        toggle: api.toggleTRIX,
        update: api.updateTRIX,
      },
      supertrend: {
        configs: indicators.supertrend,
        toggle: api.toggleSupertrend,
        update: api.updateSupertrend,
      },
      kdj: {
        configs: indicators.kdj,
        toggle: api.toggleKDJ,
        update: api.updateKDJ,
      },
      emv: {
        configs: indicators.emv,
        toggle: api.toggleEMV,
        update: api.updateEMV,
      },
      mtm: {
        configs: indicators.mtm,
        toggle: api.toggleMTM,
        update: api.updateMTM,
      },
    };
  }, [
    config?.indicators,
    api.toggleRSI, api.updateRSI,
    api.toggleMFI, api.updateMFI,
    api.toggleVolume, api.updateVolume, api.updateVolumeMA, api.toggleVolumeMA,
    api.toggleMA, api.updateMA,
    api.toggleEMA, api.updateEMA,
    api.toggleWMA, api.updateWMA,
    api.toggleBB, api.updateBB,
    api.toggleVWAP, api.updateVWAP,
    api.toggleAVL, api.updateAVL,
    api.toggleSAR, api.updateSAR,
    api.toggleTRIX, api.updateTRIX,
    api.toggleSupertrend, api.updateSupertrend,
    api.toggleKDJ, api.updateKDJ,
    api.toggleEMV, api.updateEMV,
    api.toggleMTM, api.updateMTM,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <DialogContent
        indicatorApi={indicatorApi}
        activeTab={activeTab}
        activeSubMenu={activeSubMenu}
        onClose={onClose}
        onTabChange={handleTabChange}
        onSubMenuChange={handleSubMenuChange}
      />
    </div>
  );
};

// Export memoized version
export const MemoizedIndicatorsDialog = memo(IndicatorsDialog);