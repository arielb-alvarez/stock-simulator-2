// components/chart/Chart.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  init, 
  dispose,
  KLineData,
  registerOverlay,
  registerIndicator,
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

// Get chart type configuration
const getChartTypeConfig = (chartType: string) => {
  switch (chartType) {
    case 'line':
      return {
        type: 'area',
        line: {
          color: '#f0b90b',
          size: 2,
        },
        area: {
          show: true,
          color: 'rgba(41, 98, 255, 0.1)'
        },
      };
    case 'area':
      return {
        type: 'area',
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
      };
    case 'bar':
      return {
        type: 'ohlc' as const,
        bar: {
          upColor: '#00b15d',
          downColor: '#ff5b5a',
        },
      };
    case 'candle':
    default:
      return {
        type: 'candle_solid' as const,
        bar: {
          upColor: '#00b15d',
          downColor: '#ff5b5a',
        },
      };
  }
};

// Simple and reliable RSI Indicator
const registerRSIIndicator = () => {
  try {
    registerIndicator({
      name: 'RSI',
      shortName: 'RSI',
      calcParams: [14],
      figures: [
        { key: 'rsi', title: 'RSI: ', type: 'line' }
      ],
      calc: (dataList: KLineData[]) => {
        const result: any[] = [];
        const period = 14;
        
        for (let i = 0; i < dataList.length; i++) {
          if (i < period) {
            result.push({ rsi: 0 });
            continue;
          }
          
          let gains = 0;
          let losses = 0;
          
          for (let j = i - period + 1; j <= i; j++) {
            const change = dataList[j].close - dataList[j - 1].close;
            if (change > 0) {
              gains += change;
            } else {
              losses += Math.abs(change);
            }
          }
          
          const avgGain = gains / period;
          const avgLoss = losses / period;
          
          if (avgLoss === 0) {
            result.push({ rsi: 100 });
          } else {
            const rs = avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));
            result.push({ rsi: Math.max(0, Math.min(100, rsi)) });
          }
        }
        
        return result;
      },
    });
  } catch (error) {
    console.error('Error registering RSI indicator:', error);
  }
};

// Register custom overlays for drawing tools
const registerCustomOverlays = () => {
  try {
    // [Keep your existing overlay registrations...]
  } catch (error) {
    console.warn('Error registering custom overlays:', error);
  }
};

// Register indicators and overlays on module load
registerRSIIndicator();
registerCustomOverlays();

export default function MainChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentDataRef = useRef<CryptoData[]>([]);
  const { config, toggleRSI } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>('');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Handle drawing tool selection
  const handleDrawingToolSelect = useCallback((tool: string) => {
    if (tool === 'rsi') {
      toggleRSI();
      setActiveDrawingTool(tool);
      return;
    }
    
    setActiveDrawingTool(tool);
    if (chartRef.current) {
      try {
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
            chartRef.current.createOverlay('rect');
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
      } catch (error) {
        console.warn('Error creating overlay:', error);
      }
    }
  }, [toggleRSI]);

  // Fixed RSI Indicator Setup - NO flush() calls
  const setupRSIIndicator = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove existing RSI indicator if it exists
      try {
        chart.removeIndicator('rsi');
      } catch (e) {
        // Ignore removal errors
      }

      if (config.indicators.rsi.show && currentDataRef.current.length > 0) {
        setTimeout(() => {
          try {
            chart.createIndicator('RSI', false, {
              id: 'rsi',
              height: 100,
              margin: {
                top: 0.05,
                bottom: 0.05,
              },
            });
          } catch (indicatorError) {
            console.error('Error creating RSI indicator:', indicatorError);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error in RSI setup:', error);
    }
  }, [config.indicators.rsi.show]);

  // Safe cleanup function
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

    if (resizeObserverRef.current && chartContainerRef.current) {
      resizeObserverRef.current.unobserve(chartContainerRef.current);
      resizeObserverRef.current = null;
    }

    if (chartContainerRef.current) {
      try {
        dispose(chartContainerRef.current);
        chartRef.current = null;
      } catch (error) {
        console.warn('Error during chart disposal:', error);
      }
    }
  }, []);

  // Initialize chart with proper configuration
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return null;

    try {
      const chart = init(chartContainerRef.current, {});
      
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
  }, [config.chartType]);

  // Function to update chart with data - NO flush() calls
  const updateChartWithData = useCallback((chart: any, data: CryptoData[], isRealtime: boolean = false) => {
    if (!chart || data.length === 0) return;

    try {
      const klineData = convertToKLineData(data);
      
      if (!isRealtime) {
        chart.applyNewData(klineData);
      } else {
        const lastCandle = klineData[klineData.length - 1];
        chart.updateData(lastCandle);
      }
    } catch (error) {
      console.error('Error updating chart:', error);
      setError('Failed to update chart display');
    }
  }, []);

  // Function to setup WebSocket for real-time data
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

  // Main initialization effect
  useEffect(() => {
    let mounted = true;
    let chartInstance: any = null;

    const initializeChartAndData = async () => {
      if (!mounted) return;

      setIsLoading(true);
      setError(null);

      try {
        chartInstance = initializeChart();
        if (!chartInstance) {
          throw new Error('Chart initialization failed');
        }

        chartRef.current = chartInstance;

        const candlestickData = await cryptoService.getHistoricalData(
          config.symbol,
          config.interval,
          config.limit
        );

        if (!mounted) return;
        
        if (candlestickData.length === 0) {
          setError('No data received from API');
          return;
        }

        currentDataRef.current = candlestickData;

        updateChartWithData(chartInstance, candlestickData, false);
        
        setTimeout(() => {
          if (mounted && chartInstance) {
            setupRSIIndicator(chartInstance);
          }
        }, 1000);
        
        setupWebSocket(chartInstance);

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
      cleanup();
    };
  }, [config.symbol, config.interval, config.limit, initializeChart, updateChartWithData, setupRSIIndicator, setupWebSocket, cleanup]);

  // Effect for RSI indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length) return;
    
    const timer = setTimeout(() => {
      setupRSIIndicator(chartRef.current);
    }, 300);

    return () => clearTimeout(timer);
  }, [config.indicators.rsi.show, setupRSIIndicator]);

  // Effect for chart type changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const timer = setTimeout(() => {
      try {
        const candleConfig = getChartTypeConfig(config.chartType);
        if (chartRef.current?.setStyles) {
          chartRef.current.setStyles({
            candle: candleConfig
          });
        }
      } catch (error) {
        console.error('Error updating chart type:', error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [config.chartType]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="w-full h-full flex flex-col relative">
        {/* Drawing Tools */}
        <DrawingTools 
          onToolSelect={handleDrawingToolSelect}
          activeTool={activeDrawingTool}
          showRSI={config.indicators.rsi.show}
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
        
        {/* Main Chart container */}
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