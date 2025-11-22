import { useEffect, useCallback, useState } from 'react';
import { useChartInitialization } from './useChartInitialization';
import { useChartData } from './useChartData';
import { useChartIndicators } from './useChartIndicators';
import { useGlobalContext } from '@/context/GlobalContext';
import {
  registerCustomMAIndicator,
  registerCustomEMAIndicator,
  registerCustomWMAIndicator,
  registerRSIIndicator,
  registerCustomVolumeIndicator
} from '../indicators';

export const useChartLifecycle = (chartContainerRef: any) => {
  const [chartKey, setChartKey] = useState(0);
  const { config } = useGlobalContext();
  const { chartRef, initializeChart, cleanup: chartCleanup } = useChartInitialization(chartContainerRef);
  const {
    isLoading,
    error,
    lastUpdateTime,
    loadHistoricalData,
    setupWebSocket,
    forceChartRefresh,
    cleanup: dataCleanup
  } = useChartData();
  
  const {
    setupRSIIndicators,
    setupVolumeIndicators,
    setupMovingAverageOverlays,
    applyChartStyles
  } = useChartIndicators();

  // Register all indicators on config changes
  useEffect(() => {
    let mounted = true;
    
    const registerAllIndicators = async () => {
      if (!mounted) return;
      
      try {
        registerCustomMAIndicator(config.indicators.ma);
        registerCustomEMAIndicator(config.indicators.ema);
        registerCustomWMAIndicator(config.indicators.wma);
        
        // Register RSI indicators
        config.indicators.rsi.forEach(rsiConfig => {
          registerRSIIndicator(rsiConfig);
        });
        
        // Register volume indicators
        config.indicators.volume.forEach(volumeConfig => {
          registerCustomVolumeIndicator(volumeConfig);
        });
      } catch (error) {
        console.error('Error registering indicators:', error);
      }
    };

    registerAllIndicators();

    return () => {
      mounted = false;
    };
  }, [config.indicators]);

  // Main initialization effect
  useEffect(() => {
    let mounted = true;
    let chartInstance: any = null;

    const initializeChartAndData = async () => {
      if (!mounted) return;

      chartInstance = initializeChart();
      if (!chartInstance) return;

      chartRef.current = chartInstance;

      await loadHistoricalData(chartInstance);
      
      if (!mounted) return;

      // Apply styles and setup indicators
      applyChartStyles(chartInstance);
      setupRSIIndicators(chartInstance);
      setupMovingAverageOverlays(chartInstance);
      
      setTimeout(() => {
        if (mounted && chartInstance) {
          setupVolumeIndicators(chartInstance);
        }
      }, 100);
      
      setupWebSocket(chartInstance);
    };

    initializeChartAndData();

    return () => {
      mounted = false;
      chartCleanup();
      dataCleanup();
    };
  }, [
    initializeChart,
    loadHistoricalData,
    applyChartStyles,
    setupRSIIndicators,
    setupMovingAverageOverlays,
    setupVolumeIndicators,
    setupWebSocket,
    chartCleanup,
    dataCleanup,
    chartKey
  ]);

  const forceChartReset = useCallback(() => {
    setChartKey(prev => prev + 1);
  }, []);

  return {
    isLoading,
    error,
    lastUpdateTime,
    chartRef,
    forceChartRefresh: forceChartReset
  };
};