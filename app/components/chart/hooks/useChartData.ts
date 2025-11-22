import { useRef, useState, useCallback } from 'react';
import { cryptoService, CryptoData } from '@/services/cryptoService';
import { useGlobalContext } from '@/context/GlobalContext';
import { convertToKLineData } from '../utils/chartUtils';
import { UseChartDataReturn } from '../types/chart';

export const useChartData = (): UseChartDataReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const currentDataRef = useRef<CryptoData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { config } = useGlobalContext();

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

  const setupWebSocket = useCallback((chart: any) => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const ws = cryptoService.subscribeToRealTimeData(
        config.symbol,
        config.interval,
        (newData: CryptoData) => {
          setLastUpdateTime(Date.now());
          setError(null);
          
          currentDataRef.current = cryptoService.updateDataPoint(
            currentDataRef.current,
            newData,
            config.limit
          );
          
          updateChartWithData(chart, currentDataRef.current, true);
        }
      );

      ws.onopen = () => {
        setError(null);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Real-time connection failed - attempting to reconnect...');
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          setupWebSocket(chart);
        }, 3000);
      };

      ws.onclose = (event) => {
        if (event.code !== 1000 && !reconnectTimeoutRef.current) {
          setError('Connection lost - reconnecting...');
          reconnectTimeoutRef.current = setTimeout(() => {
            setupWebSocket(chart);
          }, 3000);
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('Failed to setup WebSocket:', err);
      setError('Failed to establish real-time connection');
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        setupWebSocket(chart);
      }, 5000);
    }
  }, [config.symbol, config.interval, config.limit, updateChartWithData]);

  const loadHistoricalData = useCallback(async (chart: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const candlestickData = await cryptoService.getHistoricalData(
        config.symbol,
        config.interval,
        config.limit
      );

      if (candlestickData.length === 0) {
        setError('No data received from API');
        return;
      }

      currentDataRef.current = candlestickData;
      updateChartWithData(chart, candlestickData, false);
      setLastUpdateTime(Date.now());
      
    } catch (err) {
      console.error('❌ Error loading historical data:', err);
      setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [config.symbol, config.interval, config.limit, updateChartWithData]);

  const forceChartRefresh = useCallback(() => {
    // This function doesn't need parameters as it uses the refs internally
    if (currentDataRef.current.length > 0) {
      const klineData = convertToKLineData(currentDataRef.current);
      // We'll apply this data when the chart is reinitialized
      return klineData;
    }
    return null;
  }, []);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  return {
    isLoading,
    error,
    lastUpdateTime,
    currentData: currentDataRef.current,
    loadHistoricalData,
    setupWebSocket,
    forceChartRefresh,
    cleanup
  };
};