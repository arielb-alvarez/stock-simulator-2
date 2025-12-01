import { useCallback, useEffect, useRef } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { 
  registerCustomMAIndicator,
  registerCustomEMAIndicator,
  registerCustomWMAIndicator,
  registerCustomBBIndicator,
  registerCustomVWAPIndicator,
  registerCustomAVLIndicator,
  registerRSIIndicator,
  registerCustomVolumeIndicator,
  clearOverlayIndicators
} from '@/utils/indicatorRegistry';

export const useIndicators = () => {
  const { config } = useGlobalContext();
  const registeredIndicatorsRef = useRef<Set<string>>(new Set());

  // Reset registered indicators when config changes
  useEffect(() => {
    registeredIndicatorsRef.current = new Set();
  }, [
    config.indicators.ma,
    config.indicators.ema, 
    config.indicators.wma,
    config.indicators.avl,
    config.indicators.bb,
    config.indicators.vwap
  ]);

  const registerAllIndicators = useCallback(() => {
    console.log('Registering all custom indicators...');
    
    registerCustomMAIndicator(config.indicators.ma);
    registerCustomEMAIndicator(config.indicators.ema);
    registerCustomWMAIndicator(config.indicators.wma);
    registerCustomAVLIndicator(config.indicators.avl);
    registerCustomBBIndicator(config.indicators.bb);
    registerCustomVWAPIndicator(config.indicators.vwap);
    
    // Register RSI indicators
    if ((window as any).__registeredRSIIndicators) {
      (window as any).__registeredRSIIndicators = [];
    }
    
    config.indicators.rsi.forEach(rsiConfig => {
      const indicatorName = registerRSIIndicator(rsiConfig);
      if (!(window as any).__registeredRSIIndicators) {
        (window as any).__registeredRSIIndicators = [];
      }
      (window as any).__registeredRSIIndicators.push(indicatorName);
    });

    // Register volume indicators
    if ((window as any).__registeredVolumeIndicators) {
      (window as any).__registeredVolumeIndicators = [];
    }
    
    config.indicators.volume.forEach(volumeConfig => {
      const indicatorName = registerCustomVolumeIndicator(volumeConfig);
      if (!(window as any).__registeredVolumeIndicators) {
        (window as any).__registeredVolumeIndicators = [];
      }
      (window as any).__registeredVolumeIndicators.push(indicatorName);
    });

    console.log('All indicators registered successfully');
  }, [config.indicators]);

  return {
    registerAllIndicators,
    clearOverlayIndicators,
  };
};