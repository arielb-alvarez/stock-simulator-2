// context/GlobalContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

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
  maLines: VolumeMAConfig[]; // Change from single MA to array of MAs
}

// MA Configuration
export interface MAConfig {
  id: string;
  show: boolean;
  period: number;
  color: string;
  lineSize: number;
  type: 'sma' | 'ema' | 'wma'; // Add type to distinguish between different MAs
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
  period: number;        // Calculating Period (n)
  kPeriod: number;       // MA Period for K (m1)
  dPeriod: number;       // MA Period for D (m2)
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
interface ChartStyleConfig {
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

interface GlobalConfig {
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

interface GlobalContextType {
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

const defaultChartStyle: ChartStyleConfig = {
  layout: {
    background: { 
      type: 'solid', 
      color: '#1a1a1a' 
    },
    textColor: '#ffffff',
  },
  grid: {
    show: true,
    horizontal: {
      show: true,
      size: 1,
      color: 'rgba(180, 180, 180, 0.1)',
      style: 'dashed',
      dashedValue: [2, 2]
    },
    vertical: {
      show: true,
      size: 1,
      color: 'rgba(180, 180, 180, 0.1)',
      style: 'dashed',
      dashedValue: [2, 2]
    }
  },
  candle: {
    type: 'candle_solid',
    bar: {
      upColor: '#00b15d',
      downColor: '#ff5b5a',
    },
    line: {
      color: '#f0b90b',
      size: 2,
    },
    area: {
      show: true,
      color: 'rgba(41, 98, 255, 0.1)',
    },
  },
  priceLine: {
    show: true,
    color: '#2962FF',
  },
  crosshair: {
    show: true,
    horizontal: { show: true },
    vertical: { show: true },
  },
};

// Helper function to generate MA name based on type and period
const generateMAName = (type: 'sma' | 'ema' | 'wma', period: number): string => {
  const typeMap = {
    sma: 'MA',
    ema: 'EMA', 
    wma: 'WMA'
  };
  return `${typeMap[type]} ${period}`;
};

// Create default MA configurations
const createDefaultMAs = (type: 'sma' | 'ema' | 'wma'): MAConfig[] => [
  {
    id: `${type}-1`,
    show: type === 'sma',
    period: 20,
    color: type === 'sma' ? '#2962FF' : type === 'ema' ? '#FF6B6B' : '#4ECDC4',
    lineSize: 1.5,
    type: type,
    name: generateMAName(type, 20),
  },
  {
    id: `${type}-2`,
    show: false,
    period: 50,
    color: type === 'sma' ? '#00b15d' : type === 'ema' ? '#FFA726' : '#26C6DA',
    lineSize: 1.5,
    type: type,
    name: generateMAName(type, 50),
  },
  {
    id: `${type}-3`,
    show: false,
    period: 100,
    color: type === 'sma' ? '#f0b90b' : type === 'ema' ? '#AB47BC' : '#FF7043',
    lineSize: 1.5,
    type: type,
    name: generateMAName(type, 100),
  }
];

// Helper function to generate RSI name based on period
const generateRSIName = (period: number): string => {
  return `RSI ${period}`;
};

// Create 3 default RSI configurations
const createDefaultRSIs = (): RSIConfig[] => [
  {
    id: 'rsi-1',
    show: true,
    period: 14,
    overbought: 70,
    oversold: 30,
    lineColor: '#2962FF',
    lineSize: 2,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    areaColor: 'rgba(41, 98, 255, 0.1)',
    name: generateRSIName(14),
  },
  {
    id: 'rsi-2',
    show: false,
    period: 21,
    overbought: 70,
    oversold: 30,
    lineColor: '#FF6B6B',
    lineSize: 1.5,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    areaColor: 'rgba(255, 107, 107, 0.1)',
    name: generateRSIName(21),
  },
  {
    id: 'rsi-3',
    show: false,
    period: 28,
    overbought: 75,
    oversold: 25,
    lineColor: '#4ECDC4',
    lineSize: 1.5,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    areaColor: 'rgba(78, 205, 196, 0.1)',
    name: generateRSIName(28),
  }
];

const generateMFIName = (period: number): string => {
  return `MFI ${period}`;
};

// Create default MFI configurations (3 by default, same as RSI)
const createDefaultMFIs = (): MFIConfig[] => [
  {
    id: 'mfi-1',
    show: false, // Default to false since RSI is already enabled
    period: 14,
    lineColor: '#FF6B6B', // Different color than RSI
    lineSize: 2,
    overbought: 80,
    oversold: 20,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    name: generateMFIName(14),
    type: 'mfi',
  },
  {
    id: 'mfi-2',
    show: false,
    period: 21,
    lineColor: '#4ECDC4', // Teal color
    lineSize: 1.5,
    overbought: 80,
    oversold: 20,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    name: generateMFIName(21),
    type: 'mfi',
  },
  {
    id: 'mfi-3',
    show: false,
    period: 28,
    lineColor: '#FFA726', // Orange color
    lineSize: 1.5,
    overbought: 85,
    oversold: 15,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    name: generateMFIName(28),
    type: 'mfi',
  }
];

// Create default Volume configuration
const createDefaultVolume = (): VolumeConfig[] => [
  {
    id: 'volume-1',
    show: true,
    upColor: '#00b15d',
    downColor: '#ff5b5a',
    opacity: 0.6,
    name: 'Volume',
    maLines: [
      {
        id: 'volume-ma-1',
        show: true,
        period: 5,
        color: '#f0b90b',
        lineSize: 1.5
      },
      {
        id: 'volume-ma-2',
        show: true,
        period: 10,
        color: '#2962FF',
        lineSize: 1.5
      },
      {
        id: 'volume-ma-3',
        show: true,
        period: 20,
        color: '#FF6B6B',
        lineSize: 1.5
      }
    ],
    maPeriod: undefined
  }
];

// Add helper function to generate BB name
const generateBBName = (period: number, stdDev: number): string => {
  return `BB ${period} (${stdDev})`;
};

// Create default BB configurations
const createDefaultBBs = (): BBConfig[] => [
  {
    id: 'bb-1',
    show: false,
    period: 20,
    stdDev: 2,
    background: {
      show: true,
      color: 'rgba(156, 39, 176, 0.1)',
    },
    upLine: {
      show: true,
      lineWidth: 1.5,
      color: '#9C27B0',
    },
    middleLine: {
      show: true,
      lineWidth: 1.5,
      color: '#7B1FA2',
    },
    downLine: {
      show: true,
      lineWidth: 1.5,
      color: '#9C27B0',
    },
    type: 'bb',
    name: generateBBName(20, 2),
  }
];

// Create default VWAP configurations
const createDefaultVWAPs = (): VWAPConfig[] => [
  {
    id: 'vwap-1',
    show: false,
    color: '#FF9800',
    lineSize: 1.5,
    length: 20, // Default length is 20
  }
];

// helper function to generate AVL name
const generateAVLName = (period: number): string => {
  return `AVL ${period}`;
};

// Create default AVL configurations
const createDefaultAVLs = (): AVLConfig[] => [
  {
    id: 'avl-1',
    show: false,
    period: 20,
    color: '#9C27B0', // Purple color for AVL
    lineSize: 1.5,
    type: 'avl',
    name: generateAVLName(20),
  },
  {
    id: 'avl-2',
    show: false,
    period: 50,
    color: '#E91E63', // Pink color
    lineSize: 1.5,
    type: 'avl',
    name: generateAVLName(50),
  },
  {
    id: 'avl-3',
    show: false,
    period: 100,
    color: '#FF9800', // Orange color
    lineSize: 1.5,
    type: 'avl',
    name: generateAVLName(100),
  }
];

// SAR helper function
const generateSARName = (start: number, maximum: number): string => {
  return `SAR (${start}, ${maximum})`;
};

// Create default SAR configurations
const createDefaultSARs = (): SARConfig[] => [
  {
    id: 'sar-1',
    show: false,
    start: 0.02,
    maximum: 0.2,
    color: '#FF4081', // Pink color for SAR
    name: generateSARName(0.02, 0.2),
    type: 'sar',
  },
  {
    id: 'sar-2',
    show: false,
    start: 0.01,
    maximum: 0.1,
    color: '#7B1FA2', // Purple color
    name: generateSARName(0.01, 0.1),
    type: 'sar',
  }
];

// Helper function to generate TRIX name
const generateTRIXName = (period: number): string => {
  return `TRIX ${period}`;
};

// Create default TRIX configurations
const createDefaultTRIXs = (): TRIXConfig[] => [
  {
    id: 'trix-1',
    show: false,
    period: 14, // Default period
    color: '#4A90E2', // Blue color for TRIX
    lineSize: 1.5,
    type: 'trix',
    name: generateTRIXName(14),
  },
  {
    id: 'trix-2',
    show: false,
    period: 21,
    color: '#50E3C2', // Teal color
    lineSize: 1.5,
    type: 'trix',
    name: generateTRIXName(21),
  }
];

// Helper function to generate SuperTrend name
const generateSupertrendName = (atrLength: number, factor: number): string => {
  return `Supertrend (${atrLength}, ${factor})`;
};

// Create default SuperTrend configuration
const createDefaultSupertrends = (): SupertrendConfig[] => [
  {
    id: 'supertrend-1',
    show: false,
    atrLength: 10,
    factor: 3,
    upTrend: {
      lineColor: '#26A69A', // Teal
      lineWidth: 1.5,
      background: {
        show: true,
        color: '#26A69A',
      },
    },
    downTrend: {
      lineColor: '#EF5350', // Red
      lineWidth: 1.5,
      background: {
        show: true,
        color: '#EF5350',
      },
    },
    name: generateSupertrendName(10, 3),
    type: 'supertrend',
  }
];

const generateKDJName = (period: number, kPeriod: number, dPeriod: number): string => {
  return `KDJ (${period}, ${kPeriod}, ${dPeriod})`;
};

// Create default KDJ configuration
const createDefaultKDJs = (): KDJConfig[] => [
  {
    id: 'kdj-1',
    show: false,
    period: 9,
    kPeriod: 3,
    dPeriod: 3,
    kLineColor: '#2962FF',    // Blue for K line
    kLineSize: 1.5,
    dLineColor: '#FF6B6B',    // Red for D line
    dLineSize: 1.5,
    jLineColor: '#00b15d',    // Green for J line
    jLineSize: 1.5,
    overbought: 80,
    oversold: 20,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    name: generateKDJName(9, 3, 3),
    type: 'kdj',
  }
];

// Helper function to generate EMV name
const generateEMVName = (period: number, divisor: number): string => {
  return `EMV (${period}, ${divisor})`;
};

// Create default EMV configuration
const createDefaultEMVs = (): EMVConfig[] => [
  {
    id: 'emv-1',
    show: false,
    period: 14,
    divisor: 10000,
    lineColor: '#FF6B6B',
    lineSize: 1.5,
    name: generateEMVName(14, 10000),
    type: 'emv',
  }
];

const generateMTMName = (period: number, priceType: string): string => {
  return `MTM ${period} (${priceType})`;
};

// Create default MTM configuration (just one configuration as requested)
const createDefaultMTM = (): MTMConfig[] => [
  {
    id: 'mtm-1',
    show: false,
    period: 10,
    priceType: 'close',
    lineColor: '#FF6B6B',
    lineSize: 1.5,
    name: generateMTMName(10, 'close'),
    type: 'mtm',
  }
];

const defaultConfig: GlobalConfig = {
  chartType: 'candle',
  symbol: 'BTCUSDT',
  interval: '15m',
  limit: 1000,
  chart: defaultChartStyle,
  series: {},
  indicators: {
    rsi: createDefaultRSIs(),
    mfi: createDefaultMFIs(),
    kdj: createDefaultKDJs(),
    emv: createDefaultEMVs(),
    mtm: createDefaultMTM(),
    volume: createDefaultVolume(),
    ma: createDefaultMAs('sma'),
    ema: createDefaultMAs('ema'),
    wma: createDefaultMAs('wma'),
    bb: createDefaultBBs(),
    vwap: createDefaultVWAPs(),
    avl: createDefaultAVLs(),
    sar: createDefaultSARs(),
    trix: createDefaultTRIXs(),
    supertrend: createDefaultSupertrends(),
  },
};

// localStorage key
const STORAGE_KEY = 'kline-chart-config';

const migrateVolumeConfig = (volumeConfig: any): VolumeConfig => {
  // If already using new structure, return as is
  if (volumeConfig.maLines && Array.isArray(volumeConfig.maLines)) {
    return volumeConfig;
  }
  
  // Migrate from old structure to new structure
  return {
    ...volumeConfig,
    maLines: [
      {
        id: 'volume-ma-1',
        show: volumeConfig.showMA || false,
        period: volumeConfig.maPeriod || 20,
        color: volumeConfig.maColor || '#f0b90b',
        lineSize: volumeConfig.maLineSize || 1.5
      },
      {
        id: 'volume-ma-2',
        show: false,
        period: 10,
        color: '#2962FF',
        lineSize: 1.5
      },
      {
        id: 'volume-ma-3',
        show: false,
        period: 5,
        color: '#FF6B6B',
        lineSize: 1.5
      }
    ],
    // Remove old MA properties to avoid conflicts
    showMA: undefined,
    maPeriod: undefined,
    maColor: undefined,
    maLineSize: undefined
  };
};


// Helper functions for localStorage
const loadConfigFromStorage = (): GlobalConfig | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Validate the stored config has the basic structure
    if (parsed && typeof parsed === 'object' && parsed.chartType && parsed.symbol) {
      // Migrate volume config if needed
      if (parsed.indicators && parsed.indicators.volume && Array.isArray(parsed.indicators.volume)) {
        parsed.indicators.volume = parsed.indicators.volume.map((vol: any) => migrateVolumeConfig(vol));
      }
      return parsed as GlobalConfig;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading config from localStorage:', error);
    return null;
  }
};

const saveConfigToStorage = (config: GlobalConfig): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config to localStorage:', error);
  }
};

const resetStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting localStorage:', error);
  }
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GlobalConfig>(() => {
    // Load config from localStorage on initial render, fallback to default
    const storedConfig = loadConfigFromStorage();
    return storedConfig || defaultConfig;
  });

  // Save config to localStorage whenever it changes
  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  const updateConfig = useCallback((updates: Partial<GlobalConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateRSI = useCallback((id: string, updates: Partial<RSIConfig>) => {
    setConfig(prev => {
      const currentRSI = prev.indicators.rsi.find(rsi => rsi.id === id);
      
      // If period is being updated and name matches the pattern "RSI {oldPeriod}", auto-update the name
      if (updates.period && currentRSI) {
        const oldPeriod = currentRSI.period;
        const newPeriod = updates.period;
        
        // Check if the current name follows the default pattern "RSI {period}"
        const defaultNamePattern = `RSI ${oldPeriod}`;
        if (currentRSI.name === defaultNamePattern) {
          // Auto-update the name to match the new period
          updates.name = generateRSIName(newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          rsi: prev.indicators.rsi.map(rsi => 
            rsi.id === id ? { ...rsi, ...updates } : rsi
          ),
        },
      };
    });
  }, []);

  const toggleRSI = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: prev.indicators.rsi.map(rsi => 
          rsi.id === id ? { ...rsi, show: !rsi.show } : rsi
        ),
      },
    }));
  }, []);

  const updateMFI = useCallback((id: string, updates: Partial<MFIConfig>) => {
    setConfig(prev => {
      const currentMFI = prev.indicators.mfi.find(mfi => mfi.id === id);
      
      // If period is being updated and name matches the pattern "MFI {oldPeriod}", auto-update the name
      if (updates.period && currentMFI) {
        const oldPeriod = currentMFI.period;
        const newPeriod = updates.period;
        
        // Check if the current name follows the default pattern "MFI {period}"
        const defaultNamePattern = `MFI ${oldPeriod}`;
        if (currentMFI.name === defaultNamePattern) {
          // Auto-update the name to match the new period
          updates.name = generateMFIName(newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          mfi: prev.indicators.mfi.map(mfi => 
            mfi.id === id ? { ...mfi, ...updates } : mfi
          ),
        },
      };
    });
  }, []);

  const toggleMFI = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        mfi: prev.indicators.mfi.map(mfi => 
          mfi.id === id ? { ...mfi, show: !mfi.show } : mfi
        ),
      },
    }));
  }, []);

  const updateEMV = useCallback((id: string, updates: Partial<EMVConfig>) => {
    setConfig(prev => {
      const currentEMV = prev.indicators.emv.find(emv => emv.id === id);
      
      // Auto-update name if period or divisor changes
      if ((updates.period !== undefined || updates.divisor !== undefined) && currentEMV) {
        const oldPeriod = currentEMV.period;
        const oldDivisor = currentEMV.divisor;
        const newPeriod = updates.period !== undefined ? updates.period : oldPeriod;
        const newDivisor = updates.divisor !== undefined ? updates.divisor : oldDivisor;
        const defaultNamePattern = generateEMVName(oldPeriod, oldDivisor);
        
        if (currentEMV.name === defaultNamePattern) {
          updates.name = generateEMVName(newPeriod, newDivisor);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          emv: prev.indicators.emv.map(emv => 
            emv.id === id ? { ...emv, ...updates } : emv
          ),
        },
      };
    });
  }, []);

  const toggleEMV = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        emv: prev.indicators.emv.map(emv => 
          emv.id === id ? { ...emv, show: !emv.show } : emv
        ),
      },
    }));
  }, []);

  const updateVolume = useCallback((id: string, updates: Partial<VolumeConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(volume => 
          volume.id === id ? { ...volume, ...updates } : volume
        ),
      },
    }));
  }, []);

  const toggleVolume = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(volume => 
          volume.id === id ? { ...volume, show: !volume.show } : volume
        ),
      },
    }));
  }, []);

  const updateMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const currentMA = prev.indicators.ma.find(ma => ma.id === id);
      
      // Auto-update name if period changes and name follows default pattern
      if (updates.period && currentMA) {
        const oldPeriod = currentMA.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateMAName(currentMA.type, oldPeriod);
        
        if (currentMA.name === defaultNamePattern) {
          updates.name = generateMAName(currentMA.type, newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          ma: prev.indicators.ma.map(ma => 
            ma.id === id ? { ...ma, ...updates } : ma
          ),
        },
      };
    });
  }, []);

  const toggleMA = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        ma: prev.indicators.ma.map(ma => 
          ma.id === id ? { ...ma, show: !ma.show } : ma
        ),
      },
    }));
  }, []);

  const updateEMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const currentEMA = prev.indicators.ema.find(ema => ema.id === id);
      
      if (updates.period && currentEMA) {
        const oldPeriod = currentEMA.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateMAName(currentEMA.type, oldPeriod);
        
        if (currentEMA.name === defaultNamePattern) {
          updates.name = generateMAName(currentEMA.type, newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          ema: prev.indicators.ema.map(ema => 
            ema.id === id ? { ...ema, ...updates } : ema
          ),
        },
      };
    });
  }, []);

  const toggleEMA = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        ema: prev.indicators.ema.map(ema => 
          ema.id === id ? { ...ema, show: !ema.show } : ema
        ),
      },
    }));
  }, []);

  const updateWMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const currentWMA = prev.indicators.wma.find(wma => wma.id === id);
      
      if (updates.period && currentWMA) {
        const oldPeriod = currentWMA.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateMAName(currentWMA.type, oldPeriod);
        
        if (currentWMA.name === defaultNamePattern) {
          updates.name = generateMAName(currentWMA.type, newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          wma: prev.indicators.wma.map(wma => 
            wma.id === id ? { ...wma, ...updates } : wma
          ),
        },
      };
    });
  }, []);

  const toggleWMA = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        wma: prev.indicators.wma.map(wma => 
          wma.id === id ? { ...wma, show: !wma.show } : wma
        ),
      },
    }));
  }, []);

  const updateBB = useCallback((id: string, updates: Partial<BBConfig>) => {
    setConfig(prev => {
      const currentBB = prev.indicators.bb.find(bb => bb.id === id);
      
      // Auto-update name if period or stdDev changes and name follows default pattern
      if ((updates.period || updates.stdDev) && currentBB) {
        const oldPeriod = currentBB.period;
        const oldStdDev = currentBB.stdDev;
        const newPeriod = updates.period || oldPeriod;
        const newStdDev = updates.stdDev || oldStdDev;
        const defaultNamePattern = generateBBName(oldPeriod, oldStdDev);
        
        if (currentBB.name === defaultNamePattern) {
          updates.name = generateBBName(newPeriod, newStdDev);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          bb: prev.indicators.bb.map(bb => 
            bb.id === id ? { ...bb, ...updates } : bb
          ),
        },
      };
    });
  }, []);

  const toggleBB = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        bb: prev.indicators.bb.map(bb => 
          bb.id === id ? { ...bb, show: !bb.show } : bb
        ),
      },
    }));
  }, []);

  const updateVWAP = useCallback((id: string, updates: Partial<VWAPConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        vwap: prev.indicators.vwap.map(vwap => 
          vwap.id === id ? { ...vwap, ...updates } : vwap
        ),
      },
    }));
  }, []);

  const toggleVWAP = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        vwap: prev.indicators.vwap.map(vwap => 
          vwap.id === id ? { ...vwap, show: !vwap.show } : vwap
        ),
      },
    }));
  }, []);

  const updateAVL = useCallback((id: string, updates: Partial<AVLConfig>) => {
    setConfig(prev => {
      const currentAVL = prev.indicators.avl.find(avl => avl.id === id);
      
      // Auto-update name if period changes and name follows default pattern
      if (updates.period && currentAVL) {
        const oldPeriod = currentAVL.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateAVLName(oldPeriod);
        
        if (currentAVL.name === defaultNamePattern) {
          updates.name = generateAVLName(newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          avl: prev.indicators.avl.map(avl => 
            avl.id === id ? { ...avl, ...updates } : avl
          ),
        },
      };
    });
  }, []);

  const toggleAVL = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        avl: prev.indicators.avl.map(avl => 
          avl.id === id ? { ...avl, show: !avl.show } : avl
        ),
      },
    }));
  }, []);

  const updateSAR = useCallback((id: string, updates: Partial<SARConfig>) => {
    setConfig(prev => {
      const currentSAR = prev.indicators.sar.find(sar => sar.id === id);
      
      // Auto-update name if start or maximum changes and name follows default pattern
      if ((updates.start !== undefined || updates.maximum !== undefined) && currentSAR) {
        const oldStart = currentSAR.start;
        const oldMaximum = currentSAR.maximum;
        const newStart = updates.start !== undefined ? updates.start : oldStart;
        const newMaximum = updates.maximum !== undefined ? updates.maximum : oldMaximum;
        const defaultNamePattern = generateSARName(oldStart, oldMaximum);
        
        if (currentSAR.name === defaultNamePattern) {
          updates.name = generateSARName(newStart, newMaximum);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          sar: prev.indicators.sar.map(sar => 
            sar.id === id ? { ...sar, ...updates } : sar
          ),
        },
      };
    });
  }, []);

  const toggleSAR = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        sar: prev.indicators.sar.map(sar => 
          sar.id === id ? { ...sar, show: !sar.show } : sar
        ),
      },
    }));
  }, []);

  const updateTRIX = useCallback((id: string, updates: Partial<TRIXConfig>) => {
    setConfig(prev => {
      const currentTRIX = prev.indicators.trix.find(trix => trix.id === id);
      
      // Auto-update name if period changes and name follows default pattern
      if (updates.period && currentTRIX) {
        const oldPeriod = currentTRIX.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateTRIXName(oldPeriod);
        
        if (currentTRIX.name === defaultNamePattern) {
          updates.name = generateTRIXName(newPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          trix: prev.indicators.trix.map(trix => 
            trix.id === id ? { ...trix, ...updates } : trix
          ),
        },
      };
    });
  }, []);

  const toggleTRIX = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        trix: prev.indicators.trix.map(trix => 
          trix.id === id ? { ...trix, show: !trix.show } : trix
        ),
      },
    }));
  }, []);

  // Add these functions to the GlobalProvider component
  const updateSupertrend = useCallback((id: string, updates: Partial<SupertrendConfig>) => {
    setConfig(prev => {
      const currentST = prev.indicators.supertrend.find(st => st.id === id);
      
      // Auto-update name if atrLength or factor changes and name follows default pattern
      if ((updates.atrLength !== undefined || updates.factor !== undefined) && currentST) {
        const oldAtrLength = currentST.atrLength;
        const oldFactor = currentST.factor;
        const newAtrLength = updates.atrLength !== undefined ? updates.atrLength : oldAtrLength;
        const newFactor = updates.factor !== undefined ? updates.factor : oldFactor;
        const defaultNamePattern = generateSupertrendName(oldAtrLength, oldFactor);
        
        if (currentST.name === defaultNamePattern) {
          updates.name = generateSupertrendName(newAtrLength, newFactor);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          supertrend: prev.indicators.supertrend.map(st => 
            st.id === id ? { ...st, ...updates } : st
          ),
        },
      };
    });
  }, []);

  const toggleSupertrend = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        supertrend: prev.indicators.supertrend.map(st => 
          st.id === id ? { ...st, show: !st.show } : st
        ),
      },
    }));
  }, []);

  const updateKDJ = useCallback((id: string, updates: Partial<KDJConfig>) => {
    setConfig(prev => {
      const currentKDJ = prev.indicators.kdj.find(kdj => kdj.id === id);
      
      // Auto-update name if period changes
      if ((updates.period !== undefined || updates.kPeriod !== undefined || updates.dPeriod !== undefined) && currentKDJ) {
        const oldPeriod = currentKDJ.period;
        const oldKPeriod = currentKDJ.kPeriod;
        const oldDPeriod = currentKDJ.dPeriod;
        const newPeriod = updates.period !== undefined ? updates.period : oldPeriod;
        const newKPeriod = updates.kPeriod !== undefined ? updates.kPeriod : oldKPeriod;
        const newDPeriod = updates.dPeriod !== undefined ? updates.dPeriod : oldDPeriod;
        const defaultNamePattern = generateKDJName(oldPeriod, oldKPeriod, oldDPeriod);
        
        if (currentKDJ.name === defaultNamePattern) {
          updates.name = generateKDJName(newPeriod, newKPeriod, newDPeriod);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          kdj: prev.indicators.kdj.map(kdj => 
            kdj.id === id ? { ...kdj, ...updates } : kdj
          ),
        },
      };
    });
  }, []);

  const toggleKDJ = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        kdj: prev.indicators.kdj.map(kdj => 
          kdj.id === id ? { ...kdj, show: !kdj.show } : kdj
        ),
      },
    }));
  }, []);

  const updateMTM = useCallback((id: string, updates: Partial<MTMConfig>) => {
    setConfig(prev => {
      const currentMTM = prev.indicators.mtm.find(mtm => mtm.id === id);
      
      // Auto-update name if period or priceType changes
      if ((updates.period !== undefined || updates.priceType !== undefined) && currentMTM) {
        const oldPeriod = currentMTM.period;
        const oldPriceType = currentMTM.priceType;
        const newPeriod = updates.period !== undefined ? updates.period : oldPeriod;
        const newPriceType = updates.priceType !== undefined ? updates.priceType : oldPriceType;
        const defaultNamePattern = generateMTMName(oldPeriod, oldPriceType);
        
        if (currentMTM.name === defaultNamePattern) {
          updates.name = generateMTMName(newPeriod, newPriceType);
        }
      }
      
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          mtm: prev.indicators.mtm.map(mtm => 
            mtm.id === id ? { ...mtm, ...updates } : mtm
          ),
        },
      };
    });
  }, []);

  const toggleMTM = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        mtm: prev.indicators.mtm.map(mtm => 
          mtm.id === id ? { ...mtm, show: !mtm.show } : mtm
        ),
      },
    }));
  }, []);

  const updateChartStyle = useCallback((updates: Partial<ChartStyleConfig>) => {
    setConfig(prev => ({
      ...prev,
      chart: { ...prev.chart, ...updates },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(defaultConfig);
    resetStorage();
  }, []);

  // Helper function to get chart type configuration
  const getChartTypeConfig = (chartType: ChartType) => {
    switch (chartType) {
      case 'line':
        return {
          type: 'line',
          line: {
            color: '#f0b90b',
            size: 2,
          },
          area: {
            show: false,
            color: 'rgba(41, 98, 255, 0.1)'
          },
        };
      case 'area':
        return {
          type: 'area',
          line: {
            color: '#f0b90b',
            size: 2,
          },
          area: {
            show: true,
            color: [
              'rgba(240, 185, 11, 0.4)',
              'rgba(240, 185, 11, 0.05)'
            ],
          },
        };
      case 'bar':
        return {
          type: 'ohlc',
          bar: {
            upColor: '#00b15d',
            downColor: '#ff5b5a',
          },
        };
      case 'candle':
      default:
        return {
          type: 'candle_solid',
          bar: {
            upColor: '#00b15d',
            downColor: '#ff5b5a',
          },
        };
    }
  };

  const updateChartType = useCallback((chartType: ChartType) => {
    setConfig(prev => ({
      ...prev,
      chartType,
      chart: {
        ...prev.chart,
        candle: getChartTypeConfig(chartType),
      },
    }));
  }, []);

  const updateVolumeMA = useCallback((volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(volume => 
          volume.id === volumeId 
            ? {
                ...volume,
                maLines: volume.maLines.map(ma => 
                  ma.id === maId ? { ...ma, ...updates } : ma
                )
              }
            : volume
        ),
      },
    }));
  }, []);

  const toggleVolumeMA = useCallback((volumeId: string, maId: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(volume => 
          volume.id === volumeId 
            ? {
                ...volume,
                maLines: volume.maLines.map(ma => 
                  ma.id === maId ? { ...ma, show: !ma.show } : ma
                )
              }
            : volume
        ),
      },
    }));
  }, []);

  return (
    <GlobalContext.Provider value={{ 
      config, 
      updateConfig,
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
      toggleMTM,
      updateChartStyle,
      updateChartType,
      resetToDefaults,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}