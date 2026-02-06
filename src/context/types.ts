// context/types.ts

export type ChartType = 'line' | 'area' | 'bar' | 'candle';

// Enhanced RSI Indicator Configuration
export interface RSIConfig {
  id: string;
  show: boolean;
  period: number;
  overbought: number;
  oversold: number;
  lineColor: string;
  lineSize: number;
  overboughtLineColor: string;
  oversoldLineColor: string;
  areaColor: string;
  name: string;
}

// Volume Configuration
export interface VolumeMAConfig {
  id: string;
  show: boolean;
  period: number;
  color: string;
  lineSize: number;
}

export interface VolumeConfig {
  maPeriod: any;
  id: string;
  show: boolean;
  upColor: string;
  downColor: string;
  opacity: number;
  name: string;
  maLines: VolumeMAConfig[];
}

// MA Configuration
export interface MAConfig {
  id: string;
  show: boolean;
  period: number;
  color: string;
  lineSize: number;
  type: 'sma' | 'ema' | 'wma';
  name: string;
}

// BBConfig Configuration
export interface BBConfig {
  id: string;
  show: boolean;
  period: number;
  stdDev: number;
  background: {
    show: boolean;
    color: string;
  };
  upLine: {
    show: boolean;
    lineWidth: number;
    color: string;
  };
  middleLine: {
    show: boolean;
    lineWidth: number;
    color: string;
  };
  downLine: {
    show: boolean;
    lineWidth: number;
    color: string;
  };
  type: 'bb';
  name: string;
}

// VWAP Configuration
export interface VWAPConfig {
  id: string;
  show: boolean;
  color: string;
  lineSize: number;
  length: number;
}

// AVL Configuration
export interface AVLConfig {
  id: string;
  show: boolean;
  period: number;
  color: string;
  lineSize: number;
  type: 'avl';
  name: string;
}

// SAR Configuration
export interface SARConfig {
  id: string;
  show: boolean;
  start: number;
  maximum: number;
  color: string;
  name: string;
  type: 'sar';
}

// TRIX Configuration
export interface TRIXConfig {
  id: string;
  show: boolean;
  period: number;
  color: string;
  lineSize: number;
  type: 'trix';
  name: string;
}

// MFI Configuration interface
export interface MFIConfig {
  id: string;
  show: boolean;
  period: number;
  lineColor: string;
  lineSize: number;
  overbought: number;
  oversold: number;
  overboughtLineColor: string;
  oversoldLineColor: string;
  name: string;
  type: 'mfi';
}

export interface KDJConfig {
  id: string;
  show: boolean;
  period: number;
  kPeriod: number;
  dPeriod: number;
  kLineColor: string;
  kLineSize: number;
  dLineColor: string;
  dLineSize: number;
  jLineColor: string;
  jLineSize: number;
  overbought: number;
  oversold: number;
  overboughtLineColor: string;
  oversoldLineColor: string;
  name: string;
  type: 'kdj';
}

// EMV Configuration interface
export interface EMVConfig {
  id: string;
  show: boolean;
  period: number;
  divisor: number;
  lineColor: string;
  lineSize: number;
  name: string;
  type: 'emv';
}

// SuperTrend Configuration
export type SupertrendConfig = {
  id: string;
  show: boolean;
  atrLength: number;
  factor: number;
  upTrend: {
    lineColor: string;
    lineWidth: number;
    background: {
      show: boolean;
      color: string;
    };
  };
  downTrend: {
    lineColor: string;
    lineWidth: number;
    background: {
      show: boolean;
      color: string;
    };
  };
  name: string;
  type: 'supertrend';
};

// MTM Configuration
export interface MTMConfig {
  id: string;
  show: boolean;
  period: number;
  priceType: 'close' | 'high' | 'low' | 'open' | 'hl2' | 'hlc3' | 'ohlc4';
  lineColor: string;
  lineSize: number;
  name: string;
  type: 'mtm';
}

// Chart Style Configuration
export interface ChartStyleConfig {
  layout: {
    background: {
      type: string;
      color: string;
    };
    textColor: string;
  };
  grid: {
    show: boolean;
    vertical: {
      show: boolean;
      size: number;
      color: string;
      style: string;
      dashedValue: number[];
    };
    horizontal: {
      show: boolean;
      size: number;
      color: string;
      style: string;
      dashedValue: number[];
    };
  };
  candle: {
    type: string;
    bar?: {
      upColor: string;
      downColor: string;
    };
    line?: {
      color: string;
      size: number;
    };
    area?: {
      show: boolean;
      color: string | string[];
    };
  };
  priceLine: {
    show: boolean;
    color: string;
  };
  crosshair: {
    show: boolean;
    horizontal: { show: boolean };
    vertical: { show: boolean };
  };
}

export interface GlobalConfig {
  chartType: ChartType;
  symbol: string;
  interval: string;
  limit: number;
  chart: ChartStyleConfig;
  series: unknown;
  indicators: {
    rsi: RSIConfig[];
    mfi: MFIConfig[];
    kdj: KDJConfig[];
    emv: EMVConfig[];
    mtm: MTMConfig[];
    volume: VolumeConfig[];
    ma: MAConfig[];
    ema: MAConfig[];
    wma: MAConfig[];
    bb: BBConfig[];
    vwap: VWAPConfig[];
    avl: AVLConfig[];
    sar: SARConfig[];
    trix: TRIXConfig[];
    supertrend: SupertrendConfig[];
  };
}

export interface GlobalContextType {
  config: GlobalConfig;
  updateConfig: (updates: Partial<GlobalConfig>) => void;
  updateRSI: (id: string, updates: Partial<RSIConfig>) => void;
  toggleRSI: (id: string) => void;
  updateMFI: (id: string, updates: Partial<MFIConfig>) => void;
  toggleMFI: (id: string) => void;
  updateEMV: (id: string, updates: Partial<EMVConfig>) => void;
  toggleEMV: (id: string) => void;
  updateVolume: (id: string, updates: Partial<VolumeConfig>) => void;
  toggleVolume: (id: string) => void;
  updateVolumeMA: (volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => void;
  toggleVolumeMA: (volumeId: string, maId: string) => void;
  updateMA: (id: string, updates: Partial<MAConfig>) => void;
  toggleMA: (id: string) => void;
  updateEMA: (id: string, updates: Partial<MAConfig>) => void;
  toggleEMA: (id: string) => void;
  updateWMA: (id: string, updates: Partial<MAConfig>) => void;
  toggleWMA: (id: string) => void;
  updateBB: (id: string, updates: Partial<BBConfig>) => void;
  toggleBB: (id: string) => void;
  updateVWAP: (id: string, updates: Partial<VWAPConfig>) => void;
  toggleVWAP: (id: string) => void;
  updateAVL: (id: string, updates: Partial<AVLConfig>) => void;
  toggleAVL: (id: string) => void;
  updateSAR: (id: string, updates: Partial<SARConfig>) => void;
  toggleSAR: (id: string) => void;
  updateTRIX: (id: string, updates: Partial<TRIXConfig>) => void;
  toggleTRIX: (id: string) => void;
  updateSupertrend: (id: string, updates: Partial<SupertrendConfig>) => void;
  toggleSupertrend: (id: string) => void;
  updateKDJ: (id: string, updates: Partial<KDJConfig>) => void;
  toggleKDJ: (id: string) => void;
  updateMTM: (id: string, updates: Partial<MTMConfig>) => void;
  toggleMTM: (id: string) => void;
  updateChartStyle: (updates: Partial<ChartStyleConfig>) => void;
  updateChartType: (chartType: ChartType) => void;
  resetToDefaults: () => void;
}