// context/localStorage.ts
import { GlobalConfig, VolumeConfig } from './types';
import { defaultConfig } from './defaultConfig2';

export const STORAGE_KEY = 'kline-chart-config';

export const migrateVolumeConfig = (volumeConfig: any): VolumeConfig => {
  if (volumeConfig.maLines && Array.isArray(volumeConfig.maLines)) {
    return volumeConfig;
  }
  
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
    showMA: undefined,
    maPeriod: undefined,
    maColor: undefined,
    maLineSize: undefined
  };
};

export const loadConfigFromStorage = (): GlobalConfig | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    if (parsed && typeof parsed === 'object' && parsed.chartType && parsed.symbol) {
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

export const saveConfigToStorage = (config: GlobalConfig): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config to localStorage:', error);
  }
};

export const resetStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting localStorage:', error);
  }
};