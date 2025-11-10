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
import { useGlobalContext, RSIConfig, VolumeConfig } from '@/context/GlobalContext';
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

// Register RSI Indicator with unique name
const registerRSIIndicator = (rsiConfig: RSIConfig) => {
  const indicatorName = `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  try {
    // Check if already registered to avoid duplicates
    if ((window as any).__registeredIndicators?.includes(indicatorName)) {
      return indicatorName;
    }

    registerIndicator({
      name: indicatorName,
      shortName: `RSI${rsiConfig.period}`,
      calcParams: [rsiConfig.period],
      figures: [
        { 
          key: 'rsi', 
          title: `RSI${rsiConfig.period}: `, 
          type: 'line',
          styles: (rsiData: any) => {
            const currentRSI = rsiData.rsi;
            if (currentRSI > rsiConfig.overbought) {
              return { color: rsiConfig.overboughtLineColor };
            } else if (currentRSI < rsiConfig.oversold) {
              return { color: rsiConfig.oversoldLineColor };
            }
            return { color: rsiConfig.lineColor };
          }
        }
      ],
      calc: (dataList: KLineData[]) => {
        const result: any[] = [];
        const period = rsiConfig.period;
        
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

    // Track registered indicators
    if (!(window as any).__registeredIndicators) {
      (window as any).__registeredIndicators = [];
    }
    (window as any).__registeredIndicators.push(indicatorName);

    return indicatorName;
  } catch (error) {
    console.error('Error registering RSI indicator:', error);
    return indicatorName;
  }
};

// Register Volume Indicator
const registerVolumeIndicator = (volumeConfig: VolumeConfig) => {
  const indicatorName = `VOLUME_${volumeConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  try {
    // Check if already registered to avoid duplicates
    if ((window as any).__registeredIndicators?.includes(indicatorName)) {
      return indicatorName;
    }

    registerIndicator({
      name: indicatorName,
      shortName: 'VOL',
      calcParams: volumeConfig.showMA ? [volumeConfig.maPeriod] : [],
      figures: [
        {
          key: 'volume',
          title: 'VOLUME: ',
          type: 'bar',
          baseValue: 0,
          // styles: (kLineData: KLineData) => {
          //   const isUp = kLineData.close >= kLineData.open;
          //   return {
          //     color: isUp ? volumeConfig.upColor : volumeConfig.downColor,
          //     opacity: volumeConfig.opacity,
          //   };
          // }
        },
        ...(volumeConfig.showMA ? [{
          key: 'ma',
          title: `MA${volumeConfig.maPeriod}: `,
          type: 'line',
          // styles: {
          //   color: volumeConfig.maColor,
          //   size: volumeConfig.maLineSize,
          // }
        }] : [])
      ],
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        const maPeriod = calcParams[0] || volumeConfig.maPeriod;

        for (let i = 0; i < dataList.length; i++) {
          const volume = dataList[i].volume || 0;
          const volumeItem: any = { volume };

          // Calculate MA if enabled
          if (volumeConfig.showMA && i >= maPeriod - 1) {
            let sum = 0;
            for (let j = 0; j < maPeriod; j++) {
              sum += dataList[i - j].volume || 0;
            }
            volumeItem.ma = sum / maPeriod;
          } else if (volumeConfig.showMA) {
            volumeItem.ma = 0;
          }

          result.push(volumeItem);
        }

        return result;
      },
    });

    // Track registered indicators
    if (!(window as any).__registeredIndicators) {
      (window as any).__registeredIndicators = [];
    }
    (window as any).__registeredIndicators.push(indicatorName);

    return indicatorName;
  } catch (error) {
    console.error('Error registering Volume indicator:', error);
    return indicatorName;
  }
};

export default function MainChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentDataRef = useRef<CryptoData[]>([]);
  const { config, toggleRSI, toggleVolume } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>('');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Register all RSI indicators
  useEffect(() => {
    config.indicators.rsi.forEach(rsiConfig => {
      registerRSIIndicator(rsiConfig);
    });
  }, [config.indicators.rsi]);

  // Register all Volume indicators
  useEffect(() => {
    config.indicators.volume.forEach(volumeConfig => {
      registerVolumeIndicator(volumeConfig);
    });
  }, [config.indicators.volume]);

  // Handle drawing tool selection
  const handleDrawingToolSelect = useCallback((tool: string) => {
    if (tool === 'rsi') {
      setActiveDrawingTool(tool);
      return;
    }

    if (tool.startsWith('rsi-toggle-')) {
      const rsiId = tool.replace('rsi-toggle-', '');
      toggleRSI(rsiId);
      setActiveDrawingTool(tool);
      return;
    }

    if (tool.startsWith('volume-toggle-')) {
      const volumeId = tool.replace('volume-toggle-', '');
      toggleVolume(volumeId);
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
      } catch (error) {
        console.warn('Error creating overlay:', error);
      }
    }
  }, [toggleRSI, toggleVolume, config.indicators.rsi.length, config.indicators.volume.length]);

  // Setup RSI indicators on chart
  const setupRSIIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing RSI indicators first
      config.indicators.rsi.forEach(rsiConfig => {
        const indicatorName = `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
        try {
          chart.removeIndicator(indicatorName);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Add visible RSI indicators
      config.indicators.rsi
        .filter(rsiConfig => rsiConfig.show)
        .forEach((rsiConfig, index) => {
          const indicatorName = `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
          
          try {
            chart.createIndicator(indicatorName, false, {
              id: indicatorName,
              height: 100,
              gap: {
                top: 0.1,
                bottom: 0.1,
              },
              styles: {
                rsi: {
                  color: rsiConfig.lineColor,
                  size: rsiConfig.lineSize,
                },
                marginTop: 10 * index, // Stagger indicators slightly
              },
              bands: [
                {
                  value: rsiConfig.overbought,
                  color: rsiConfig.overboughtLineColor,
                  width: 1,
                  style: 'dashed',
                },
                {
                  value: rsiConfig.oversold,
                  color: rsiConfig.oversoldLineColor,
                  width: 1,
                  style: 'dashed',
                },
              ],
            });
          } catch (indicatorError) {
            console.error(`Error creating RSI indicator ${indicatorName}:`, indicatorError);
          }
        });
    } catch (error) {
      console.error('Error in RSI setup:', error);
    }
  }, [config.indicators.rsi]);

  // Setup Volume indicators on chart
  const setupVolumeIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing Volume indicators first
      config.indicators.volume.forEach(volumeConfig => {
        const indicatorName = `VOLUME_${volumeConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
        try {
          chart.removeIndicator(indicatorName);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Add visible Volume indicators
      config.indicators.volume
        .filter(volumeConfig => volumeConfig.show)
        .forEach((volumeConfig, index) => {
          const indicatorName = `VOLUME_${volumeConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
          
          try {
            chart.createIndicator(indicatorName, false, {
              id: indicatorName,
              height: 80,
              gap: {
                top: 0.1,
                bottom: 0.1,
              },
              styles: {
                marginTop: 5 * index,
              },
            });
          } catch (indicatorError) {
            console.error(`Error creating Volume indicator ${indicatorName}:`, indicatorError);
          }
        });
    } catch (error) {
      console.error('Error in Volume setup:', error);
    }
  }, [config.indicators.volume]);

  // Apply chart styles from global config
  const applyChartStyles = useCallback((chart: any) => {
    if (!chart) return;

    try {
      chart.setStyles({
        candle: config.chart.candle,
        grid: config.chart.grid,
        crosshair: config.chart.crosshair,
      });
    } catch (error) {
      console.error('Error applying chart styles:', error);
    }
  }, [config.chart]);

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
  }, []);

  // Function to update chart with data
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
        
        // Apply styles and setup indicators
        applyChartStyles(chartInstance);
        setupRSIIndicators(chartInstance);
        setupVolumeIndicators(chartInstance);
        
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
  }, [config.symbol, config.interval, config.limit, initializeChart, updateChartWithData, applyChartStyles, setupRSIIndicators, setupVolumeIndicators, setupWebSocket, cleanup]);

  // Effect for RSI indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length) return;
    
    const timer = setTimeout(() => {
      setupRSIIndicators(chartRef.current);
    }, 300);

    return () => clearTimeout(timer);
  }, [config.indicators.rsi, setupRSIIndicators]);

  // Effect for Volume indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length) return;
    
    const timer = setTimeout(() => {
      setupVolumeIndicators(chartRef.current);
    }, 300);

    return () => clearTimeout(timer);
  }, [config.indicators.volume, setupVolumeIndicators]);

  // Effect for chart style changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 200);

    return () => clearTimeout(timer);
  }, [config.chart, applyChartStyles]);

  // Effect for chart type changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 200);

    return () => clearTimeout(timer);
  }, [config.chartType, applyChartStyles]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="w-full h-full flex flex-col relative">
        {/* Drawing Tools */}
        {/* <DrawingTools 
          onToolSelect={handleDrawingToolSelect}
          activeTool={activeDrawingTool}
        /> */}
        
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