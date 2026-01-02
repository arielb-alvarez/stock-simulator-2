// hooks/useChart.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { init, dispose, KLineData } from 'klinecharts';
import { useGlobalContext } from '@/context/GlobalContext';
import { cryptoService, CryptoData } from '@/services/cryptoService';
import { convertToKLineData } from '@/utils/chartHelpers';

export const useChart = (symbol: string) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const { config } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [chartKey, setChartKey] = useState(0);
  const currentDataRef = useRef<CryptoData[]>([]);

  const forceChartRefresh = useCallback(() => {
    console.log('Force refreshing chart due to configuration change');
    setChartKey(prev => prev + 1);
  }, []);

  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return null;

    try {
      const chart = init(chartContainerRef.current, {});
      
      if (!chart) {
        throw new Error('Chart initialization returned null');
      }

      return chart;
    } catch (error) {
      console.error('Error initializing chart:', error);
      setError('Failed to initialize chart');
      return null;
    }
  }, []);

  const updateChartWithData = useCallback((chart: any, data: CryptoData[], isRealtime: boolean = false) => {
    if (!chart || data.length === 0) return;

    try {
      const klineData = convertToKLineData(data);
      
      if (!isRealtime) {
        chart.applyNewData(klineData);
      } else {
        const lastCandle = klineData[klineData.length - 1];
        const success = chart.updateData(lastCandle);
        
        if (!success) {
          chart.applyNewData(klineData);
        }
        
        setTimeout(() => {
          chart.resize();
        }, 50);
      }
    } catch (error) {
      console.error('Error updating chart:', error);
      setError('Failed to update chart display');
    }
  }, []);

  const cleanup = useCallback(() => {
    if (chartContainerRef.current) {
      try {
        dispose(chartContainerRef.current);
        chartRef.current = null;
      } catch (error) {
        console.warn('Error during chart disposal:', error);
      }
    }
  }, []);

  return {
    chartContainerRef,
    chartRef,
    isLoading,
    error,
    lastUpdateTime,
    chartKey,
    currentDataRef,
    setIsLoading,
    setError,
    setLastUpdateTime,
    forceChartRefresh,
    initializeChart,
    updateChartWithData,
    cleanup,
  };
};