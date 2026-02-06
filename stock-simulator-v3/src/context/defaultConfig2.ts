// context/defaultConfig2.ts
import {
  VolumeConfig,
  BBConfig,
  VWAPConfig,
  AVLConfig,
  SARConfig,
  TRIXConfig,
  SupertrendConfig,
  KDJConfig,
  EMVConfig,
  MTMConfig,
  GlobalConfig,
  ChartStyleConfig
} from './types';
import {
  generateBBName,
  generateAVLName,
  generateSARName,
  generateTRIXName,
  generateSupertrendName,
  generateKDJName,
  generateEMVName,
  generateMTMName,
  defaultChartStyle,
  createDefaultRSIs,
  createDefaultMFIs,
  createDefaultMAs
} from './defaultConfig';

// Create default Volume configuration
export const createDefaultVolume = (): VolumeConfig[] => [
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

// Create default BB configurations
export const createDefaultBBs = (): BBConfig[] => [
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
export const createDefaultVWAPs = (): VWAPConfig[] => [
  {
    id: 'vwap-1',
    show: false,
    color: '#FF9800',
    lineSize: 1.5,
    length: 20,
  }
];

// Create default AVL configurations
export const createDefaultAVLs = (): AVLConfig[] => [
  {
    id: 'avl-1',
    show: false,
    period: 20,
    color: '#9C27B0',
    lineSize: 1.5,
    type: 'avl',
    name: generateAVLName(20),
  },
  {
    id: 'avl-2',
    show: false,
    period: 50,
    color: '#E91E63',
    lineSize: 1.5,
    type: 'avl',
    name: generateAVLName(50),
  },
  {
    id: 'avl-3',
    show: false,
    period: 100,
    color: '#FF9800',
    lineSize: 1.5,
    type: 'avl',
    name: generateAVLName(100),
  }
];

// Create default SAR configurations
export const createDefaultSARs = (): SARConfig[] => [
  {
    id: 'sar-1',
    show: false,
    start: 0.02,
    maximum: 0.2,
    color: '#FF4081',
    name: generateSARName(0.02, 0.2),
    type: 'sar',
  },
  {
    id: 'sar-2',
    show: false,
    start: 0.01,
    maximum: 0.1,
    color: '#7B1FA2',
    name: generateSARName(0.01, 0.1),
    type: 'sar',
  }
];

// Create default TRIX configurations
export const createDefaultTRIXs = (): TRIXConfig[] => [
  {
    id: 'trix-1',
    show: false,
    period: 14,
    color: '#4A90E2',
    lineSize: 1.5,
    type: 'trix',
    name: generateTRIXName(14),
  },
  {
    id: 'trix-2',
    show: false,
    period: 21,
    color: '#50E3C2',
    lineSize: 1.5,
    type: 'trix',
    name: generateTRIXName(21),
  }
];

// Create default SuperTrend configuration
export const createDefaultSupertrends = (): SupertrendConfig[] => [
  {
    id: 'supertrend-1',
    show: false,
    atrLength: 10,
    factor: 3,
    upTrend: {
      lineColor: '#26A69A',
      lineWidth: 1.5,
      background: {
        show: true,
        color: '#26A69A',
      },
    },
    downTrend: {
      lineColor: '#EF5350',
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

// Create default KDJ configuration
export const createDefaultKDJs = (): KDJConfig[] => [
  {
    id: 'kdj-1',
    show: false,
    period: 9,
    kPeriod: 3,
    dPeriod: 3,
    kLineColor: '#2962FF',
    kLineSize: 1.5,
    dLineColor: '#FF6B6B',
    dLineSize: 1.5,
    jLineColor: '#00b15d',
    jLineSize: 1.5,
    overbought: 80,
    oversold: 20,
    overboughtLineColor: '#ff5b5a',
    oversoldLineColor: '#00b15d',
    name: generateKDJName(9, 3, 3),
    type: 'kdj',
  }
];

// Create default EMV configuration
export const createDefaultEMVs = (): EMVConfig[] => [
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

// Create default MTM configuration
export const createDefaultMTM = (): MTMConfig[] => [
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

// Default configuration
export const defaultConfig: GlobalConfig = {
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