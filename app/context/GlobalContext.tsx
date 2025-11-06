// context/GlobalContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ChartType = 'line' | 'area' | 'bar' | 'candle';

interface ChartConfig {
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
}

// RSI Indicator Configuration
interface RSIConfig {
  show: boolean;
  period: number;
  overbought: number;
  oversold: number;
  style: {
    line: {
      color: string;
      size: number;
    };
    area: {
      color: string;
    };
  };
}

interface GlobalConfig {
  chartType: ChartType;
  symbol: string;
  interval: string;
  limit: number;
  chart: ChartConfig;
  series: unknown;
  indicators: {
    rsi: RSIConfig;
  };
}

interface GlobalContextType {
  config: GlobalConfig;
  updateConfig: (updates: Partial<GlobalConfig>) => void;
  toggleRSI: () => void;
  updateRSIConfig: (updates: Partial<RSIConfig>) => void;
}

const defaultConfig: GlobalConfig = {
  chartType: 'candle',
  symbol: 'BTCUSDT',
  interval: '15m',
  limit: 1000,
  chart: {
    layout: {
      background: { 
        type: 'solid', 
        color: 'white' 
      },
      textColor: 'black',
    },
    grid: {
      vertLines: { color: '#f0f0f0' },
      horzLines: { color: '#f0f0f0' },
    },
  },
  series: {},
  indicators: {
    rsi: {
      show: true,
      period: 14,
      overbought: 70,
      oversold: 30,
      style: {
        line: {
          color: '#2962FF',
          size: 2,
        },
        area: {
          color: 'rgba(41, 98, 255, 0.1)',
        },
      },
    },
  },
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GlobalConfig>(defaultConfig);

  const updateConfig = (updates: Partial<GlobalConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleRSI = () => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: {
          ...prev.indicators.rsi,
          show: !prev.indicators.rsi.show,
        },
      },
    }));
  };

  const updateRSIConfig = (updates: Partial<RSIConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: {
          ...prev.indicators.rsi,
          ...updates,
        },
      },
    }));
  };

  return (
    <GlobalContext.Provider value={{ 
      config, 
      updateConfig, 
      toggleRSI, 
      updateRSIConfig 
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