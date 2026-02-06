// context/defaultConfig.ts
import {
  ChartStyleConfig,
  GlobalConfig,
  RSIConfig,
  MFIConfig,
  VolumeConfig,
  MAConfig,
  BBConfig,
  VWAPConfig,
  AVLConfig,
  SARConfig,
  TRIXConfig,
  SupertrendConfig,
  KDJConfig,
  EMVConfig,
  MTMConfig
} from './types';

export const defaultChartStyle: ChartStyleConfig = {
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
export const generateMAName = (type: 'sma' | 'ema' | 'wma', period: number): string => {
  const typeMap = {
    sma: 'MA',
    ema: 'EMA', 
    wma: 'WMA'
  };
  return `${typeMap[type]} ${period}`;
};

// Helper function to generate RSI name based on period
export const generateRSIName = (period: number): string => {
  return `RSI ${period}`;
};

// Helper function to generate MFI name
export const generateMFIName = (period: number): string => {
  return `MFI ${period}`;
};

// Helper function to generate BB name
export const generateBBName = (period: number, stdDev: number): string => {
  return `BB ${period} (${stdDev})`;
};

// Helper function to generate AVL name
export const generateAVLName = (period: number): string => {
  return `AVL ${period}`;
};

// SAR helper function
export const generateSARName = (start: number, maximum: number): string => {
  return `SAR (${start}, ${maximum})`;
};

// Helper function to generate TRIX name
export const generateTRIXName = (period: number): string => {
  return `TRIX ${period}`;
};

// Helper function to generate SuperTrend name
export const generateSupertrendName = (atrLength: number, factor: number): string => {
  return `Supertrend (${atrLength}, ${factor})`;
};

// Helper function to generate KDJ name
export const generateKDJName = (period: number, kPeriod: number, dPeriod: number): string => {
  return `KDJ (${period}, ${kPeriod}, ${dPeriod})`;
};

// Helper function to generate EMV name
export const generateEMVName = (period: number, divisor: number): string => {
  return `EMV (${period}, ${divisor})`;
};

// Helper function to generate MTM name
export const generateMTMName = (period: number, priceType: string): string => {
  return `MTM ${period} (${priceType})`;
};

// Create default MA configurations
export const createDefaultMAs = (type: 'sma' | 'ema' | 'wma'): MAConfig[] => [
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

// Create 3 default RSI configurations
export const createDefaultRSIs = (): RSIConfig[] => [
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

// Create default MFI configurations
export const createDefaultMFIs = (): MFIConfig[] => [
  {
    id: 'mfi-1',
    show: false,
    period: 14,
    lineColor: '#FF6B6B',
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
    lineColor: '#4ECDC4',
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
    lineColor: '#FFA726',
    lineSize: 1.5,
    overbought: 85,
    oversold: 15,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    name: generateMFIName(28),
    type: 'mfi',
  }
];