import { KLineData } from 'klinecharts';
import { RSIConfig, VolumeConfig, MAConfig } from '@/context/GlobalContext';
import { CryptoData } from '@/services/cryptoService';

export interface ChartProps {
  // Add any specific chart props here
}

export interface ChartInstance {
  current: any;
}

export interface ChartContainerRef {
  current: HTMLDivElement | null;
}

export interface IndicatorNames {
  ma: string | null;
  ema: string | null;
  wma: string | null;
}

export interface UseChartDataReturn {
  isLoading: boolean;
  error: string | null;
  lastUpdateTime: number;
  currentData: CryptoData[];
  loadHistoricalData: (chart: any) => Promise<void>;
  setupWebSocket: (chart: any) => void;
  forceChartRefresh: () => void;
  cleanup: () => void;
}

export interface UseChartIndicatorsReturn {
  setupRSIIndicators: (chart: any) => void;
  setupVolumeIndicators: (chart: any) => void;
  setupMovingAverageOverlays: (chart: any) => void;
  applyChartStyles: (chart: any) => void;
}

// Re-export types from context for convenience
export type { RSIConfig, VolumeConfig, MAConfig, CryptoData, KLineData };