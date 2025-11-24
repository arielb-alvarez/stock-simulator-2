import { useEffect, useCallback, useState, useRef } from 'react';
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

  // Track previous configs for comparison
  const prevConfigRef = useRef(config);

  // Register indicators when config changes
  useEffect(() => {
    console.log('📊 Config changed, registering indicators with unique names');
    
    try {
      // Register moving average indicators with unique names
      registerCustomMAIndicator(config.indicators.ma);
      registerCustomEMAIndicator(config.indicators.ema);
      registerCustomWMAIndicator(config.indicators.wma);
      
      // Register RSI and Volume indicators
      config.indicators.rsi.forEach(rsiConfig => {
        registerRSIIndicator(rsiConfig);
      });
      
      config.indicators.volume.forEach(volumeConfig => {
        registerCustomVolumeIndicator(volumeConfig);
      });
    } catch (error) {
      console.error('Error registering indicators:', error);
    }
  }, [config]);

  // Handle MA/EMA/WMA config changes - use the original approach
  useEffect(() => {
    if (!chartRef.current) return;

    const maChanged = JSON.stringify(prevConfigRef.current.indicators.ma) !== JSON.stringify(config.indicators.ma);
    const emaChanged = JSON.stringify(prevConfigRef.current.indicators.ema) !== JSON.stringify(config.indicators.ema);
    const wmaChanged = JSON.stringify(prevConfigRef.current.indicators.wma) !== JSON.stringify(config.indicators.wma);

    if (maChanged || emaChanged || wmaChanged) {
      console.log('🔄 MA/EMA/WMA configurations changed, updating overlays');
      
      // Update moving average overlays without full chart reset for real-time performance
      setTimeout(() => {
        if (chartRef.current) {
          setupMovingAverageOverlays(chartRef.current);
          
          // Force indicators to recalculate with new data
          setTimeout(() => {
            if (chartRef.current) {
              chartRef.current.resize();
              console.log('📐 Chart resized for real-time updates');
            }
          }, 100);
        }
      }, 50);
    }

    prevConfigRef.current = config;
  }, [config.indicators.ma, config.indicators.ema, config.indicators.wma, chartRef, setupMovingAverageOverlays]);

  // Main initialization effect
  useEffect(() => {
    let mounted = true;
    let chartInstance: any = null;

    const initializeChartAndData = async () => {
      if (!mounted) return;

      console.log('🚀 Initializing chart...');
      chartInstance = initializeChart();
      if (!chartInstance) {
        console.error('❌ Chart initialization failed');
        return;
      }

      chartRef.current = chartInstance;

      console.log('📈 Loading historical data...');
      await loadHistoricalData(chartInstance);
      
      if (!mounted) return;

      console.log('🎨 Applying chart styles and indicators...');
      applyChartStyles(chartInstance);
      setupRSIIndicators(chartInstance);
      setupMovingAverageOverlays(chartInstance);
      
      setTimeout(() => {
        if (mounted && chartInstance) {
          setupVolumeIndicators(chartInstance);
        }
      }, 100);
      
      console.log('🔌 Setting up WebSocket...');
      setupWebSocket(chartInstance);

      console.log('✅ Chart initialization complete');
    };

    initializeChartAndData();

    return () => {
      console.log('🧹 Cleaning up chart...');
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
    console.log('🔄 Manual chart reset triggered');
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