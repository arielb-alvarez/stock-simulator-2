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

interface GlobalConfig {
  chartType: ChartType;
  symbol: string;
  interval: string;
  limit: number;
  chart: ChartConfig;
  series: unknown;
}

interface GlobalContextType {
  config: GlobalConfig;
  updateConfig: (updates: Partial<GlobalConfig>) => void;
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
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GlobalConfig>(defaultConfig);

  const updateConfig = (updates: Partial<GlobalConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <GlobalContext.Provider value={{ config, updateConfig }}>
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