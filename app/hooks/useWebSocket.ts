// hooks/useWebSocket.ts
import { useRef, useCallback, useEffect } from 'react';
import { cryptoService, CryptoData } from '@/services/cryptoService';

export const useWebSocket = (
  chartRef: React.MutableRefObject<any>,
  currentDataRef: React.MutableRefObject<CryptoData[]>,
  config: any,
  setLastUpdateTime: (time: number) => void,
  setError: (error: string | null) => void,
  updateChartWithData: (chart: any, data: CryptoData[], isRealtime: boolean) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setupWebSocket = useCallback(() => {
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
          
          updateChartWithData(chartRef.current, currentDataRef.current, true);
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
          setupWebSocket();
        }, 3000);
      };

      ws.onclose = (event) => {
        if (event.code !== 1000 && !reconnectTimeoutRef.current) {
          setError('Connection lost - reconnecting...');
          reconnectTimeoutRef.current = setTimeout(() => {
            setupWebSocket();
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
        setupWebSocket();
      }, 5000);
    }
  }, [config.symbol, config.interval, config.limit, updateChartWithData]);

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    setupWebSocket,
  };
};