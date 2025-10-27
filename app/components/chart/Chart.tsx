// components/chart/Chart.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  createChart,
  IChartApi, 
  ISeriesApi,
  LineSeries,
  AreaSeries,
  BarSeries,
  CandlestickSeries,
  LineData,
  AreaData,
  BarData,
  CandlestickData,
  ColorType,
  Time
} from 'lightweight-charts';
import { useGlobalContext } from '@/context/GlobalContext';
import { cryptoService, ChartData, CryptoData } from '@/services/cryptoService';

// Binance-like color scheme
const BINANCE_THEME = {
  dark: {
    background: '#0c0e14',
    textColor: '#eaecef',
    gridColor: '#2b3139',
    lineColor: '#f0b90b',
    areaTopColor: 'rgba(240, 185, 11, 0.4)',
    areaBottomColor: 'rgba(240, 185, 11, 0.05)',
    borderColor: '#2b3139',
    upColor: '#00b15d',
    downColor: '#ff5b5a',
    upColorTransparent: 'rgba(0, 177, 93, 0.2)',
    downColorTransparent: 'rgba(255, 91, 90, 0.2)',
  }
};

// Helper function to convert timestamp to Lightweight Charts time format
const convertToChartTime = (timestamp: number): Time => {
  return (timestamp / 1000) as Time;
};

export default function Chart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line' | 'Area' | 'Bar' | 'Candlestick'> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentDataRef = useRef<CryptoData[]>([]);
  const { config } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
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

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { 
          type: ColorType.Solid,
          color: BINANCE_THEME.dark.background,
        },
        textColor: BINANCE_THEME.dark.textColor,
        fontSize: 12,
        fontFamily: 'Arial, Helvetica, sans-serif',
      },
      grid: {
        vertLines: { 
          color: BINANCE_THEME.dark.gridColor,
          style: 1,
        },
        horzLines: { 
          color: BINANCE_THEME.dark.gridColor,
          style: 1,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      crosshair: {
        mode: 1,
        vertLine: {
          color: BINANCE_THEME.dark.textColor,
          width: 1,
          style: 3,
        },
        horzLine: {
          color: BINANCE_THEME.dark.textColor,
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: BINANCE_THEME.dark.borderColor,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: BINANCE_THEME.dark.borderColor,
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 8,
      },
      autoSize: true,
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      cleanup();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [cleanup]);

  // Function to create or update chart series
  const createSeries = useCallback(() => {
    if (!chartRef.current) return;

    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    let series: ISeriesApi<'Line' | 'Area' | 'Bar' | 'Candlestick'>;
    
    switch (config.chartType) {
      case 'line':
        series = chartRef.current.addSeries(LineSeries, {
          color: BINANCE_THEME.dark.lineColor,
          lineWidth: 2,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
        });
        break;
      case 'area':
        series = chartRef.current.addSeries(AreaSeries, {
          topColor: BINANCE_THEME.dark.areaTopColor,
          bottomColor: BINANCE_THEME.dark.areaBottomColor,
          lineColor: BINANCE_THEME.dark.lineColor,
          lineWidth: 2,
        });
        break;
      case 'bar':
        series = chartRef.current.addSeries(BarSeries, {
          upColor: BINANCE_THEME.dark.upColor,
          downColor: BINANCE_THEME.dark.downColor,
        });
        break;
      case 'candle':
      default:
        series = chartRef.current.addSeries(CandlestickSeries, {
          upColor: BINANCE_THEME.dark.upColor,
          downColor: BINANCE_THEME.dark.downColor,
          borderUpColor: BINANCE_THEME.dark.upColor,
          borderDownColor: BINANCE_THEME.dark.downColor,
          wickUpColor: BINANCE_THEME.dark.upColor,
          wickDownColor: BINANCE_THEME.dark.downColor,
        });
        break;
    }

    seriesRef.current = series;
    return series;
  }, [config.chartType]);

  // Function to update chart with data
  const updateChartWithData = useCallback((data: CryptoData[], isRealtime: boolean = false) => {
    if (!chartRef.current || !seriesRef.current || data.length === 0) {
      console.log('Chart not ready or no data available');
      return;
    }

    try {
      let chartData: (LineData | AreaData | BarData | CandlestickData)[] = [];

      switch (config.chartType) {
        case 'line':
          chartData = data.map(item => ({
            time: convertToChartTime(item.time),
            value: item.close,
          }));
          (seriesRef.current as ISeriesApi<'Line'>).setData(chartData as LineData[]);
          break;

        case 'area':
          chartData = data.map(item => ({
            time: convertToChartTime(item.time),
            value: item.close,
          }));
          (seriesRef.current as ISeriesApi<'Area'>).setData(chartData as AreaData[]);
          break;

        case 'bar':
          chartData = data.map(item => ({
            time: convertToChartTime(item.time),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }));
          (seriesRef.current as ISeriesApi<'Bar'>).setData(chartData as BarData[]);
          break;

        case 'candle':
        default:
          chartData = data.map(item => ({
            time: convertToChartTime(item.time),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }));
          (seriesRef.current as ISeriesApi<'Candlestick'>).setData(chartData as CandlestickData[]);
          break;
      }

      if (!isRealtime && chartRef.current) {
        requestAnimationFrame(() => {
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
          }
        });
      }

      console.log(`Chart updated with ${data.length} data points`);
    } catch (error) {
      console.error('Error updating chart:', error);
      setError('Failed to update chart display');
    }
  }, [config.chartType]);

  // Function to setup WebSocket for real-time data
  const setupWebSocket = useCallback(() => {
    cleanup();

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
          
          updateChartWithData(currentDataRef.current, true);
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
          setupWebSocket();
        }, 3000);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        
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
  }, [config.symbol, config.interval, config.limit, updateChartWithData, cleanup]);

  // Effect for initial data loading
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!chartRef.current) {
        console.log('Chart not initialized yet');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching historical data...', {
          symbol: config.symbol,
          interval: config.interval,
          limit: config.limit
        });

        createSeries();

        const candlestickData = await cryptoService.getHistoricalData(
          config.symbol,
          config.interval,
          config.limit
        );

        console.log('Historical data received:', candlestickData.length, 'items');
        
        if (candlestickData.length === 0) {
          setError('No data received from API');
          return;
        }

        currentDataRef.current = candlestickData;
        updateChartWithData(candlestickData, false);
        setupWebSocket();

      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(`Failed to fetch chart data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setupWebSocket();
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [config.symbol, config.interval, config.limit, setupWebSocket, updateChartWithData, createSeries]);

  // Effect for chart type changes
  useEffect(() => {
    if (!chartRef.current || currentDataRef.current.length === 0) return;

    console.log('Chart type changed to:', config.chartType);
    createSeries();
    updateChartWithData(currentDataRef.current, false);
  }, [config.chartType, createSeries, updateChartWithData]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="w-full h-full flex flex-col">
        {/* Loading and error states */}
        {(isLoading || error) && (
            <div className="flex-shrink-0 z-10 p-4">
            {isLoading && (
                <div className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm">
                Loading chart data...
                </div>
            )}
            {error && (
                <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm">
                {error}
                </div>
            )}
            </div>
        )}
        
        {/* Chart container - fills remaining space */}
        <div 
            ref={chartContainerRef} 
            className="w-full h-full bg-gray-900 rounded-lg"
        />
    </div>
  );
}