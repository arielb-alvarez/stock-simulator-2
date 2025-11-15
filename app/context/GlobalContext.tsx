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
  id: string;
  show: boolean;
  upColor: string;
  downColor: string;
  opacity: number;
  name: string;
  maLines: VolumeMAConfig[]; // Change from single MA to array of MAs
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
    volume: VolumeConfig[];
  };
}

interface GlobalContextType {
  config: GlobalConfig;
  updateConfig: (updates: Partial<GlobalConfig>) => void;
  updateRSI: (id: string, updates: Partial<RSIConfig>) => void;
  toggleRSI: (id: string) => void;
  updateVolume: (id: string, updates: Partial<VolumeConfig>) => void;
  toggleVolume: (id: string) => void;
  updateVolumeMA: (volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => void;
  toggleVolumeMA: (volumeId: string, maId: string) => void;
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
    volume: createDefaultVolume(),
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
      updateVolume,
      toggleVolume,
      updateVolumeMA,
      toggleVolumeMA,
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