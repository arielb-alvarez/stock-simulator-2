// hooks/useWebSocket.ts
import { useRef, useCallback, useEffect } from 'react';
import { cryptoService, CryptoData } from '@/services/cryptoService';

export const useWebSocket = (
  chartRef: React.MutableRefObject<any>,
  currentDataRef: React.MutableRefObject<CryptoData[]>,
  symbol: string, // Changed from config to individual parameters
  interval: string,
  setLastUpdateTime: (time: number) => void,
  setError: (error: string | null) => void,
  updateChartWithData: (chart: any, data: CryptoData[], isRealtime: boolean) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSymbolRef = useRef<string>('');
  const previousIntervalRef = useRef<string>('');

  const setupWebSocket = useCallback(() => {
    // Check if symbol or interval changed - if not, we might not need to reconnect
    const symbolChanged = previousSymbolRef.current !== symbol;
    const intervalChanged = previousIntervalRef.current !== interval;
    
    if (!symbolChanged && !intervalChanged && wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected for this symbol and interval');
      return;
    }

    // Clean up existing WebSocket connection if symbol or interval changed
    if (wsRef.current && (symbolChanged || intervalChanged)) {
      console.log(`Closing WebSocket due to change: ${previousSymbolRef.current}@${previousIntervalRef.current} -> ${symbol}@${interval}`);
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      console.log(`Setting up WebSocket for ${symbol}@${interval}`);
      
      const ws = cryptoService.subscribeToRealTimeData(
        symbol,
        interval,
        (newData: CryptoData) => {
          setLastUpdateTime(Date.now());
          setError(null);
          
          // Update the data reference
          const updatedData = cryptoService.updateDataPoint(
            currentDataRef.current,
            newData,
            1000 // Using a fixed limit for real-time updates
          );
          currentDataRef.current = updatedData;
          
          // Update the chart
          if (chartRef.current) {
            updateChartWithData(chartRef.current, updatedData, true);
          }
        }
      );

      ws.onopen = () => {
        console.log(`WebSocket connected for ${symbol}@${interval}`);
        setError(null);
        // Update previous references
        previousSymbolRef.current = symbol;
        previousIntervalRef.current = interval;
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
        console.log(`WebSocket closed for ${symbol}@${interval}:`, event.code, event.reason);
        
        // Only reconnect if it wasn't a normal closure and not due to symbol/interval change
        if (event.code !== 1000 && !reconnectTimeoutRef.current && 
            symbol === previousSymbolRef.current && interval === previousIntervalRef.current) {
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
  }, [symbol, interval, updateChartWithData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        console.log('Cleaning up WebSocket on unmount');
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