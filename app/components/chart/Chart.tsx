// components/chart/Chart.tsx (final version with real data)
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  init, 
  KLineData,
  Chart,
  dispose,
  OverlayMode
} from 'klinecharts';
import { useGlobalContext } from '@/context/GlobalContext';
import { cryptoService, CryptoData } from '@/services/cryptoService';
import DrawingTools from './DrawingTools';

// Binance-like color scheme
const CHART_THEME = {
  background: '#0c0e14',
  textColor: '#eaecef', 
  gridColor: '#1a1d24',
  upColor: '#00b15d',
  downColor: '#ff5b5a',
  lineColor: '#f0b90b',
  areaTopColor: 'rgba(240, 185, 11, 0.4)',
  areaBottomColor: 'rgba(240, 185, 11, 0.05)',
};

// Create fallback sample data
const createSampleData = (): KLineData[] => {
  const data: KLineData[] = [];
  const baseTime = Date.now();
  let price = 50000;
  
  for (let i = 0; i < 100; i++) {
    const change = (Math.random() - 0.5) * 1000;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    
    data.push({
      timestamp: baseTime + i * 60000,
      open,
      high,
      low, 
      close,
      volume: Math.random() * 1000 + 500,
    });
    
    price = close;
  }
  
  return data;
};

export default function MainChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentDataRef = useRef<CryptoData[]>([]);
  const { config } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // Convert CryptoData to KLineData
  const convertToKLineData = useCallback((data: CryptoData[]): KLineData[] => {
    return data.map(item => ({
      timestamp: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (chartRef.current && chartContainerRef.current) {
      dispose(chartContainerRef.current);
      chartRef.current = null;
    }
  }, []);

  // Initialize chart
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return null;

    try {
      const chart = init(chartContainerRef.current, {
        style: {
          layout: {
            background: {
              color: CHART_THEME.background
            },
            textColor: CHART_THEME.textColor,
            fontSize: 12,
            fontFamily: 'Arial, Helvetica, sans-serif',
          },
          grid: {
            horizontal: {
              color: CHART_THEME.gridColor,
              size: 0.5,
            },
            vertical: {
              color: CHART_THEME.gridColor,
              size: 0.5,
            }
          },
          candle: {
            bar: {
              upColor: CHART_THEME.upColor,
              downColor: CHART_THEME.downColor,
            }
          },
          crosshair: {
            horizontal: {
              line: {
                color: CHART_THEME.textColor,
                size: 1,
              }
            },
            vertical: {
              line: {
                color: CHART_THEME.textColor,
                size: 1,
              }
            }
          }
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        }
      });

      chartRef.current = chart;
      return chart;
    } catch (error) {
      console.error('Failed to initialize chart:', error);
      setError('Failed to initialize chart');
      return null;
    }
  }, []);

  // Load real data from API
  const loadRealData = useCallback(async () => {
    if (!chartRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching real data for:', config.symbol, config.interval);
      
      const candlestickData = await cryptoService.getHistoricalData(
        config.symbol,
        config.interval,
        config.limit
      );

      let klineData: KLineData[];

      if (candlestickData.length === 0) {
        console.log('No real data received, using sample data');
        klineData = createSampleData();
      } else {
        console.log(`Received ${candlestickData.length} real data points`);
        klineData = convertToKLineData(candlestickData);
        currentDataRef.current = candlestickData;
      }

      chartRef.current.applyNewData(klineData);
      console.log('Chart updated with real data');

    } catch (err) {
      console.error('Error loading real data:', err);
      setError('Failed to load chart data');
      // Fallback to sample data
      const sampleData = createSampleData();
      chartRef.current?.applyNewData(sampleData);
    } finally {
      setIsLoading(false);
    }
  }, [config.symbol, config.interval, config.limit, convertToKLineData]);

  // Setup WebSocket for real-time data
  const setupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      const ws = cryptoService.subscribeToRealTimeData(
        config.symbol,
        config.interval,
        (newData: CryptoData) => {
          setLastUpdateTime(Date.now());
          setError(null);

          // Update our data reference
          currentDataRef.current = cryptoService.updateDataPoint(
            currentDataRef.current,
            newData,
            config.limit
          );

          // Update chart with new data
          const klineData = {
            timestamp: newData.time,
            open: newData.open,
            high: newData.high,
            low: newData.low,
            close: newData.close,
            volume: newData.volume,
          };

          if (chartRef.current) {
            chartRef.current.updateData(klineData);
          }
        }
      );

      wsRef.current = ws;

    } catch (err) {
      console.error('Failed to setup WebSocket:', err);
    }
  }, [config.symbol, config.interval, config.limit]);

  // Initialize chart and load data
  useEffect(() => {
    const chart = initializeChart();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // Load data after chart is initialized
    if (chart) {
      setTimeout(() => {
        loadRealData();
        setupWebSocket();
      }, 100);
    }

    return () => {
      resizeObserver.disconnect();
      cleanup();
    };
  }, [initializeChart, loadRealData, setupWebSocket, cleanup]);

  // Reinitialize when symbol or interval changes
  useEffect(() => {
    if (chartRef.current) {
      loadRealData();
      setupWebSocket();
    }
  }, [config.symbol, config.interval, loadRealData, setupWebSocket]);

  // Handle drawing tools
  const handleDrawingToolSelect = useCallback((tool: string) => {
    if (chartRef.current) {
      try {
        chartRef.current.createOverlay(tool as OverlayMode);
      } catch (error) {
        console.warn('Failed to create overlay:', error);
      }
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Drawing Tools */}
      <DrawingTools 
        onToolSelect={handleDrawingToolSelect}
        activeTool=""
      />
      
      {/* Chart container */}
      <div 
        ref={chartContainerRef} 
        className="w-full h-full bg-gray-900 rounded-lg"
        style={{ 
          minHeight: '500px',
        }}
      />
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10">
          <div className="text-white text-lg">Loading chart data...</div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md text-sm z-10">
          {error}
        </div>
      )}

      {/* Last update time */}
      {lastUpdateTime > 0 && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 z-10">
          Updated: {new Date(lastUpdateTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}