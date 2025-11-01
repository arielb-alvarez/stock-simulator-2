// components/chart/Chart.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  init, 
  dispose,
  KLineData
} from 'klinecharts';
import { useGlobalContext } from '@/context/GlobalContext';
import { cryptoService, CryptoData } from '@/services/cryptoService';
import DrawingTools from './DrawingTools';

// Helper function to convert CryptoData to KLineData
const convertToKLineData = (cryptoData: CryptoData[]): KLineData[] => {
  return cryptoData.map(item => ({
    timestamp: item.time,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    turnover: item.volume * item.close,
  }));
};

export default function MainChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentDataRef = useRef<CryptoData[]>([]);
  const { config } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>('');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Handle drawing tool selection
  const handleDrawingToolSelect = useCallback((tool: string) => {
    setActiveDrawingTool(tool);
    if (chartRef.current) {
      switch (tool) {
        case 'horizontalLine':
          chartRef.current.createOverlay('horizontalStraightLine');
          break;
        case 'verticalLine':
          chartRef.current.createOverlay('verticalStraightLine');
          break;
        case 'trendLine':
          chartRef.current.createOverlay('straightLine');
          break;
        case 'fibonacci':
          chartRef.current.createOverlay('fibonacciLine');
          break;
        case 'rectangle':
          chartRef.current.createOverlay('rect');
          break;
        case 'circle':
          chartRef.current.createOverlay('circle');
          break;
        default:
          chartRef.current.overrideOverlay(null);
          break;
      }
    }
  }, []);

  // Safe cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up...');
    
    // Clear reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      console.log('Closing WebSocket...');
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clean up resize observer
    if (resizeObserverRef.current && chartContainerRef.current) {
      resizeObserverRef.current.unobserve(chartContainerRef.current);
      resizeObserverRef.current = null;
    }

    // Dispose chart safely
    if (chartContainerRef.current) {
      try {
        console.log('Disposing chart...');
        dispose(chartContainerRef.current);
        chartRef.current = null;
      } catch (error) {
        console.warn('Error during chart disposal:', error);
      }
    }
  }, []);

  // Initialize chart - SIMPLIFIED
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) {
      console.log('Chart container not available');
      return null;
    }

    try {
      console.log('Initializing chart...');

      // Initialize with minimal configuration
      const chart = init(chartContainerRef.current);
      
      if (!chart) {
        throw new Error('Chart initialization returned null');
      }

      // Set up resize observer
      const handleResize = () => {
        chart.resize();
      };

      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartContainerRef.current);

      return chart;
    } catch (error) {
      console.error('Error initializing chart:', error);
      setError('Failed to initialize chart');
      return null;
    }
  }, []);

  // Update chart type - FIXED METHOD NAME
  const updateChartType = useCallback((chart: any, chartType: string) => {
    if (!chart) return;

    try {
      console.log('Setting chart type to:', chartType);
      
      // Use setStyles (without "Options")
      switch (chartType) {
        case 'line':
          chart.setStyles({
            candle: {
              type: 'line',
              line: {
                color: '#f0b90b',
                size: 2,
              },
              area: {
                show: false,
              },
            },
          });
          break;
        case 'area':
          chart.setStyles({
            candle: {
              type: 'line',
              line: {
                color: '#f0b90b',
                size: 2,
              },
              area: {
                show: true,
                color: [
                  'rgba(240, 185, 11, 0.4)',
                  'rgba(240, 185, 11, 0.05)'
                ],
              },
            },
          });
          break;
        case 'bar':
          chart.setStyles({
            candle: {
              type: 'ohlc',
              bar: {
                upColor: '#00b15d',
                downColor: '#ff5b5a',
              },
            },
          });
          break;
        case 'candle':
        default:
          chart.setStyles({
            candle: {
              type: 'candle_solid',
              bar: {
                upColor: '#00b15d',
                downColor: '#ff5b5a',
              },
            },
          });
          break;
      }
      
      console.log('Chart type updated successfully');
    } catch (error) {
      console.error('Error updating chart type:', error);
    }
  }, []);

  // Apply theme - FIXED METHOD NAME
  const applyTheme = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Use setStyles (without "Options")
      chart.setStyles({
        grid: {
          horizontal: {
            color: '#2b3139',
            size: 1,
          },
          vertical: {
            color: '#2b3139',
            size: 1,
          },
        },
        candle: {
          priceMark: {
            high: { color: '#eaecef' },
            low: { color: '#eaecef' },
          },
          tooltip: {
            text: { color: '#eaecef' },
            bg: { color: '#0c0e14' },
          },
        },
        crosshair: {
          horizontal: {
            line: { color: '#eaecef', size: 1 },
            text: { color: '#eaecef', bgColor: '#0c0e14' },
          },
          vertical: {
            line: { color: '#eaecef', size: 1 },
            text: { color: '#eaecef', bgColor: '#0c0e14' },
          },
        },
        xAxis: {
          axisLine: { color: '#2b3139' },
          tickLine: { color: '#2b3139' },
          tickText: { color: '#7f7f7f' },
        },
        yAxis: {
          axisLine: { color: '#2b3139' },
          tickLine: { color: '#2b3139' },
          tickText: { color: '#7f7f7f' },
        },
      });
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, []);

  // Function to update chart with data
  const updateChartWithData = useCallback((chart: any, data: CryptoData[], isRealtime: boolean = false) => {
    if (!chart || data.length === 0) {
      console.log('Chart not ready or no data available');
      return;
    }

    try {
      const klineData = convertToKLineData(data);
      
      if (!isRealtime) {
        // Initial data load
        chart.applyNewData(klineData);
        console.log(`Applied ${klineData.length} data points to chart`);
      } else {
        // Real-time update
        const lastCandle = klineData[klineData.length - 1];
        chart.updateData(lastCandle);
        console.log('Updated chart with real-time data');
      }
    } catch (error) {
      console.error('Error updating chart:', error);
      setError('Failed to update chart display');
    }
  }, []);

  // Function to setup WebSocket for real-time data
  const setupWebSocket = useCallback((chart: any) => {
    console.log('Setting up WebSocket...');
    
    // Cleanup existing WebSocket
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
        console.log('WebSocket connected successfully');
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
        console.log('WebSocket connection closed:', event.code, event.reason);
        
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

  // Main initialization effect
  useEffect(() => {
    let mounted = true;
    let chartInstance: any = null;

    const initializeChartAndData = async () => {
      if (!mounted) return;

      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Initialize chart
        chartInstance = initializeChart();
        if (!chartInstance) {
          throw new Error('Chart initialization failed');
        }

        chartRef.current = chartInstance;

        // Step 2: Apply theme and chart type
        applyTheme(chartInstance);
        updateChartType(chartInstance, config.chartType);

        // Step 3: Fetch historical data
        console.log('Fetching historical data...', {
          symbol: config.symbol,
          interval: config.interval,
          limit: config.limit
        });

        const candlestickData = await cryptoService.getHistoricalData(
          config.symbol,
          config.interval,
          config.limit
        );

        if (!mounted) return;

        console.log('Historical data received:', candlestickData.length, 'items');
        
        if (candlestickData.length === 0) {
          setError('No data received from API');
          return;
        }

        currentDataRef.current = candlestickData;

        // Step 4: Apply data to chart
        updateChartWithData(chartInstance, candlestickData, false);
        
        // Step 5: Setup WebSocket
        setupWebSocket(chartInstance);

        console.log('Chart initialization completed successfully');

      } catch (err) {
        if (!mounted) return;
        
        console.error('Error in chart initialization:', err);
        setError(`Failed to initialize chart: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeChartAndData();

    return () => {
      mounted = false;
    };
  }, [config.symbol, config.interval, config.limit, initializeChart, applyTheme, updateChartType, updateChartWithData, setupWebSocket]);

  // Effect for chart type changes
  useEffect(() => {
    if (!chartRef.current) return;

    console.log('Chart type changed to:', config.chartType);
    updateChartType(chartRef.current, config.chartType);
    
    // Reapply current data with new chart type
    if (currentDataRef.current.length > 0) {
      updateChartWithData(chartRef.current, currentDataRef.current, false);
    }
  }, [config.chartType, updateChartType, updateChartWithData]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting...');
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="w-full h-full flex flex-col relative">
        {/* Drawing Tools */}
        <DrawingTools 
          onToolSelect={handleDrawingToolSelect}
          activeTool={activeDrawingTool}
        />
        
        {/* Loading and Error States */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10">
            <div className="text-white text-lg">Loading chart data...</div>
          </div>
        )}
        
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-10">
            {error}
          </div>
        )}
        
        {/* Chart container - fills remaining space */}
        <div 
            ref={chartContainerRef} 
            className="w-full h-full bg-gray-900 rounded-lg"
        />
        
        {/* Last update time */}
        {lastUpdateTime > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
          </div>
        )}
    </div>
  );
}