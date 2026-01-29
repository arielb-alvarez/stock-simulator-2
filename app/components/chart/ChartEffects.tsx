'use client';
import { useEffect } from 'react';
import { useIndicatorSetup } from '@/hooks/useIndicatorSetup';
import { useGlobalContext } from '@/context/GlobalContext';

interface ChartEffectsProps {
  chartRef: React.MutableRefObject<any>;
  currentDataRef: React.MutableRefObject<any[]>;
  isChartReady: boolean;
  config: any;
}

export default function ChartEffects({
  chartRef,
  currentDataRef,
  isChartReady,
  config
}: ChartEffectsProps) {
  const {
    setupRSIIndicators,
    setupMFIIndicators,
    setupVolumeIndicators,
    setupKDJIndicators,
    setupEMVIndicators,
    setupMTMIndicators,
    setupMovingAverageOverlays,
    applyChartStyles,
  } = useIndicatorSetup();

  const { config: globalConfig } = useGlobalContext();

  // Effect for chart style changes
  useEffect(() => {
    if (!chartRef.current || !isChartReady) return;
    
    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 100);

    return () => clearTimeout(timer);
  }, [globalConfig.chart, applyChartStyles, isChartReady, chartRef]);

  // Effect for overlay indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;
    
    const updateOverlayIndicators = () => {
      try {
        setupMovingAverageOverlays(chartRef.current);
        
        setTimeout(() => {
          if (chartRef.current && currentDataRef.current.length > 0) {
            chartRef.current.resize();
          }
        }, 150);
      } catch (error) {
        console.error('Error updating overlay indicators:', error);
      }
    };

    const timer = setTimeout(updateOverlayIndicators, 50);
    return () => clearTimeout(timer);
  }, [
    globalConfig.indicators.ma, 
    globalConfig.indicators.ema, 
    globalConfig.indicators.wma, 
    globalConfig.indicators.avl,
    globalConfig.indicators.bb, 
    globalConfig.indicators.vwap,
    globalConfig.indicators.sar,
    globalConfig.indicators.trix,
    globalConfig.indicators.supertrend,
    setupMovingAverageOverlays,
    isChartReady,
    chartRef,
    currentDataRef
  ]);

  // Effect for RSI indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;
    
    const updateRSIIndicators = async () => {
      try {
        setupRSIIndicators(chartRef.current);
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating RSI indicators:', error);
      }
    };

    const timer = setTimeout(updateRSIIndicators, 50);
    return () => clearTimeout(timer);
  }, [globalConfig.indicators.rsi, setupRSIIndicators, isChartReady, chartRef, currentDataRef]);

  // Effect for MFI indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;
    
    const updateMFIIndicators = async () => {
      try {
        setupMFIIndicators(chartRef.current);
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating MFI indicators:', error);
      }
    };

    const timer = setTimeout(updateMFIIndicators, 50);
    return () => clearTimeout(timer);
  }, [globalConfig.indicators.mfi, setupMFIIndicators, isChartReady, chartRef, currentDataRef]);

  // Effect for Volume indicator changes
  useEffect(() => {
    if (!chartRef.current || !isChartReady) return;
    
    const updateVolumeIndicators = () => {
      try {
        setupVolumeIndicators(chartRef.current);
        
        setTimeout(() => {
          if (chartRef.current && currentDataRef.current.length > 0) {
            chartRef.current.resize();
          }
        }, 100);
      } catch (error) {
        console.error('Error updating volume indicators:', error);
      }
    };

    const timer = setTimeout(updateVolumeIndicators, 50);
    return () => clearTimeout(timer);
  }, [globalConfig.indicators.volume, setupVolumeIndicators, isChartReady, chartRef, currentDataRef]);

  // Effect for KDJ indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;
    
    const updateKDJIndicators = async () => {
      try {
        setupKDJIndicators(chartRef.current);
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating KDJ indicators:', error);
      }
    };

    const timer = setTimeout(updateKDJIndicators, 50);
    return () => clearTimeout(timer);
  }, [globalConfig.indicators.kdj, setupKDJIndicators, isChartReady, chartRef, currentDataRef]);

  // Effect for EMV indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;
    
    const updateEMVIndicators = async () => {
      try {
        setupEMVIndicators(chartRef.current);
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating EMV indicators:', error);
      }
    };

    const timer = setTimeout(updateEMVIndicators, 50);
    return () => clearTimeout(timer);
  }, [globalConfig.indicators.emv, setupEMVIndicators, isChartReady, chartRef, currentDataRef]);

  // Effect for MTM indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;
    
    const updateMTMIndicators = async () => {
      try {
        setupMTMIndicators(chartRef.current);
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating MTM indicators:', error);
      }
    };

    const timer = setTimeout(updateMTMIndicators, 50);
    return () => clearTimeout(timer);
  }, [globalConfig.indicators.mtm, setupMTMIndicators, isChartReady, chartRef, currentDataRef]);

  return null;
}