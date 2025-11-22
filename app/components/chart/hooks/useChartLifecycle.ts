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

  // Use refs to track changes
  const prevMAConfigRef = useRef(JSON.stringify(config.indicators.ma));
  const prevEMAConfigRef = useRef(JSON.stringify(config.indicators.ema));
  const prevWMAConfigRef = useRef(JSON.stringify(config.indicators.wma));

  // Register all indicators on initial mount and config changes
  useEffect(() => {
    let mounted = true;
    
    const registerAllIndicators = async () => {
      if (!mounted) return;
      
      try {
        console.log('📊 Registering all indicators...');
        
        // Register moving average indicators
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

  // Immediate effect for MA configuration changes
  useEffect(() => {
    if (!chartRef.current) return;

    const currentMAConfig = JSON.stringify(config.indicators.ma);
    if (currentMAConfig !== prevMAConfigRef.current) {
      console.log('🔄 MA Configuration changed - updating immediately');
      
      // Update the reference
      prevMAConfigRef.current = currentMAConfig;
      
      // Force immediate update
      const updateMA = () => {
        try {
          console.log('🔄 Re-registering MA indicator with new config');
          registerCustomMAIndicator(config.indicators.ma);
          
          console.log('🔄 Setting up MA overlays');
          setupMovingAverageOverlays(chartRef.current);
          
          // Force immediate visual update
          setTimeout(() => {
            if (chartRef.current) {
              console.log('🔄 Forcing chart resize and update');
              chartRef.current.resize();
              
              // Get current data and force update
              const currentData = chartRef.current.getData();
              if (currentData && currentData.length > 0) {
                // Force a data update to trigger indicator recalculation
                chartRef.current.updateData(currentData[currentData.length - 1]);
              }
            }
          }, 10);
        } catch (error) {
          console.error('❌ Error in MA update:', error);
        }
      };

      // Execute immediately
      updateMA();
    }
  }, [config.indicators.ma, setupMovingAverageOverlays, chartRef]);

  // Immediate effect for EMA configuration changes
  useEffect(() => {
    if (!chartRef.current) return;

    const currentEMAConfig = JSON.stringify(config.indicators.ema);
    if (currentEMAConfig !== prevEMAConfigRef.current) {
      console.log('🔄 EMA Configuration changed - updating immediately');
      
      prevEMAConfigRef.current = currentEMAConfig;
      
      const updateEMA = () => {
        try {
          console.log('🔄 Re-registering EMA indicator with new config');
          registerCustomEMAIndicator(config.indicators.ema);
          
          console.log('🔄 Setting up EMA overlays');
          setupMovingAverageOverlays(chartRef.current);
          
          setTimeout(() => {
            if (chartRef.current) {
              console.log('🔄 Forcing chart resize and update for EMA');
              chartRef.current.resize();
              
              const currentData = chartRef.current.getData();
              if (currentData && currentData.length > 0) {
                chartRef.current.updateData(currentData[currentData.length - 1]);
              }
            }
          }, 10);
        } catch (error) {
          console.error('❌ Error in EMA update:', error);
        }
      };

      updateEMA();
    }
  }, [config.indicators.ema, setupMovingAverageOverlays, chartRef]);

  // Immediate effect for WMA configuration changes
  useEffect(() => {
    if (!chartRef.current) return;

    const currentWMAConfig = JSON.stringify(config.indicators.wma);
    if (currentWMAConfig !== prevWMAConfigRef.current) {
      console.log('🔄 WMA Configuration changed - updating immediately');
      
      prevWMAConfigRef.current = currentWMAConfig;
      
      const updateWMA = () => {
        try {
          console.log('🔄 Re-registering WMA indicator with new config');
          registerCustomWMAIndicator(config.indicators.wma);
          
          console.log('🔄 Setting up WMA overlays');
          setupMovingAverageOverlays(chartRef.current);
          
          setTimeout(() => {
            if (chartRef.current) {
              console.log('🔄 Forcing chart resize and update for WMA');
              chartRef.current.resize();
              
              const currentData = chartRef.current.getData();
              if (currentData && currentData.length > 0) {
                chartRef.current.updateData(currentData[currentData.length - 1]);
              }
            }
          }, 10);
        } catch (error) {
          console.error('❌ Error in WMA update:', error);
        }
      };

      updateWMA();
    }
  }, [config.indicators.wma, setupMovingAverageOverlays, chartRef]);

  // Effect for RSI configuration changes
  useEffect(() => {
    if (!chartRef.current) return;

    console.log('🔄 RSI Configuration changed - updating');
    const updateRSI = () => {
      try {
        setupRSIIndicators(chartRef.current);
        setTimeout(() => {
          if (chartRef.current) {
            chartRef.current.resize();
          }
        }, 50);
      } catch (error) {
        console.error('❌ Error updating RSI indicators:', error);
      }
    };

    updateRSI();
  }, [config.indicators.rsi, setupRSIIndicators, chartRef]);

  // Effect for Volume configuration changes
  useEffect(() => {
    if (!chartRef.current) return;

    console.log('🔄 Volume Configuration changed - updating');
    const updateVolume = () => {
      try {
        setupVolumeIndicators(chartRef.current);
        setTimeout(() => {
          if (chartRef.current) {
            chartRef.current.resize();
          }
        }, 50);
      } catch (error) {
        console.error('❌ Error updating Volume indicators:', error);
      }
    };

    updateVolume();
  }, [config.indicators.volume, setupVolumeIndicators, chartRef]);

  // Effect for chart style changes
  useEffect(() => {
    if (!chartRef.current) return;

    console.log('🎨 Chart style changed - updating');
    applyChartStyles(chartRef.current);
  }, [config.chart, applyChartStyles, chartRef]);

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

      // Initialize previous config references
      prevMAConfigRef.current = JSON.stringify(config.indicators.ma);
      prevEMAConfigRef.current = JSON.stringify(config.indicators.ema);
      prevWMAConfigRef.current = JSON.stringify(config.indicators.wma);

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