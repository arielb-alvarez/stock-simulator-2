// hooks/routes/charts/useWebSocket.ts
import { useRef, useCallback, useEffect } from 'react';
import { cryptoService, CryptoData } from '@/services/cryptoService';
import { TDataTradingCandles } from '@/types/services/dev-coin-user/types.candles';

export const useWebSocket = (
  chartRef: React.MutableRefObject<any>,
  currentDataRef: React.MutableRefObject<TDataTradingCandles[]>,
  symbol: string,
  interval: string,
  setLastUpdateTime: (time: number) => void,
  setError: (error: string | null) => void,
  updateChartWithData: (chart: any, data: TDataTradingCandles[], isRealtime: boolean) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSymbolRef = useRef<string>('');
  const previousIntervalRef = useRef<string>('');

  // Helper function to convert CryptoData to TDataTradingCandles
  const convertToTradingCandles = (cryptoData: CryptoData): TDataTradingCandles => ({
    timestamp: cryptoData.time,
    open: cryptoData.open,
    high: cryptoData.high,
    low: cryptoData.low,
    close: cryptoData.close,
    volume: cryptoData.volume,
  });

  // Function to update TDataTradingCandles array
  const updateDataPoint = (
    existingData: TDataTradingCandles[],
    newData: TDataTradingCandles,
    isFinal: boolean,
    maxPoints: number = 200
  ): TDataTradingCandles[] => {
    const data = [...existingData];

    if (isFinal) {
      // If the candle is final, add it as a new candle
      data.push(newData);

      // Remove oldest data if we exceed max points
      if (data.length > maxPoints) {
        data.shift();
      }
    } else {
      // If the candle is not final, update the last candle
      const lastIndex = data.length - 1;
      if (lastIndex >= 0 && data[lastIndex].timestamp === newData.timestamp) {
        // Update existing candle
        data[lastIndex] = newData;
      } else {
        // Add as new candle if timestamp doesn't match
        data.push(newData);
      }
    }

    return data;
  };

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
        (newCryptoData: CryptoData) => {
          setLastUpdateTime(Date.now());
          setError(null);
          
          // Convert CryptoData to TDataTradingCandles
          const newData = convertToTradingCandles(newCryptoData);
          
          // Update the data reference with TDataTradingCandles
          const updatedData = updateDataPoint(
            currentDataRef.current,
            newData,
            newCryptoData.isFinal || false,
            1000
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
  }, [symbol, interval, chartRef, currentDataRef, setLastUpdateTime, setError, updateChartWithData]);

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