// context/GlobalContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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
  name?: string;
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
    vertLines: { color: string };
    horzLines: { color: string };
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
  };
}

interface GlobalContextType {
  config: GlobalConfig;
  updateConfig: (updates: Partial<GlobalConfig>) => void;
  addRSI: (rsiConfig?: Partial<RSIConfig>) => void;
  removeRSI: (id: string) => void;
  updateRSI: (id: string, updates: Partial<RSIConfig>) => void;
  toggleRSI: (id: string) => void;
  updateChartStyle: (updates: Partial<ChartStyleConfig>) => void;
  updateChartType: (chartType: ChartType) => void;
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
    vertLines: { color: '#2d2d2d' },
    horzLines: { color: '#2d2d2d' },
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

const createDefaultRSI = (id: string, overrides?: Partial<RSIConfig>): RSIConfig => ({
  id,
  show: true,
  period: 14,
  overbought: 70,
  oversold: 30,
  lineColor: '#2962FF',
  lineSize: 2,
  overboughtLineColor: '#ff5b5a',
  oversoldLineColor: '#00b15d',
  areaColor: 'rgba(41, 98, 255, 0.1)',
  name: `RSI ${id.slice(0, 4)}`,
  ...overrides,
});

const defaultConfig: GlobalConfig = {
  chartType: 'candle',
  symbol: 'BTCUSDT',
  interval: '15m',
  limit: 1000,
  chart: defaultChartStyle,
  series: {},
  indicators: {
    rsi: [createDefaultRSI('rsi-1')],
  },
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GlobalConfig>(defaultConfig);

  const updateConfig = useCallback((updates: Partial<GlobalConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const addRSI = useCallback((rsiConfig?: Partial<RSIConfig>) => {
    const newId = `rsi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRSI = createDefaultRSI(newId, rsiConfig);
    
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: [...prev.indicators.rsi, newRSI],
      },
    }));
    
    return newId;
  }, []);

  const removeRSI = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: prev.indicators.rsi.filter(rsi => rsi.id !== id),
      },
    }));
  }, []);

  const updateRSI = useCallback((id: string, updates: Partial<RSIConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: prev.indicators.rsi.map(rsi => 
          rsi.id === id ? { ...rsi, ...updates } : rsi
        ),
      },
    }));
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

  const updateChartStyle = useCallback((updates: Partial<ChartStyleConfig>) => {
    setConfig(prev => ({
      ...prev,
      chart: { ...prev.chart, ...updates },
    }));
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

  return (
    <GlobalContext.Provider value={{ 
      config, 
      updateConfig,
      addRSI,
      removeRSI,
      updateRSI,
      toggleRSI,
      updateChartStyle,
      updateChartType,
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