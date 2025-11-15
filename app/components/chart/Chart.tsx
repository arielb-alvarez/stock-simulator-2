// components/chart/Chart.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  init, 
  dispose,
  KLineData,
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

    return indicatorName;
  } catch (error) {
    console.error('Error registering RSI indicator:', error);
    return indicatorName;
  }
};

  // Register Custom Volume Indicator
  const registerCustomVolumeIndicator = (volumeConfig: VolumeConfig) => {
    const indicatorName = `CUSTOM_VOLUME_${volumeConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    try {
      // Calculate the MA periods for calcParams
      const maPeriods = volumeConfig.maLines
        .filter(ma => ma.show)
        .map(ma => ma.period);

      registerIndicator({
        name: indicatorName,
        shortName: 'VOL',
        calcParams: maPeriods,
        figures: [
          {
            key: 'volume',
            title: 'VOLUME: ',
            type: 'bar',
            baseValue: 0,
            styles: () => ({
              bar: {
                upColor: volumeConfig.upColor,
                downColor: volumeConfig.downColor,
                noChangeColor: volumeConfig.upColor,
              },
              opacity: volumeConfig.opacity,
            })
          },
          ...volumeConfig.maLines
            .filter(ma => ma.show)
            .map((maConfig, index) => ({
              key: `ma${index + 1}`,
              title: `MA${maConfig.period}: `,
              type: 'line',
              styles: () => ({
                color: maConfig.color,
                size: maConfig.lineSize,
              })
            }))
        ],
        calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
          const result: any[] = [];
          
          for (let i = 0; i < dataList.length; i++) {
            const currentData = dataList[i];
            const volume = currentData.volume || 0;
            const isUp = currentData.close >= currentData.open;
            
            const volumeItem: any = { 
              volume
            };

            // Calculate MAs for each period in calcParams
            calcParams.forEach((period, maIndex) => {
              const maKey = `ma${maIndex + 1}`;
              if (i >= period - 1) {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                  sum += dataList[i - j].volume || 0;
                }
                volumeItem[maKey] = sum / period;
              } else {
                volumeItem[maKey] = 0;
              }
            });

            result.push(volumeItem);
          }

          return result;
        },
      });

      console.log(`✅ Successfully registered custom volume indicator: ${indicatorName}`, {
        upColor: volumeConfig.upColor,
        downColor: volumeConfig.downColor,
        opacity: volumeConfig.opacity,
        maPeriods: maPeriods // Fixed: using maPeriods variable instead of calcParams
      });

      return indicatorName;
    } catch (error) {
      console.error('❌ Error registering custom Volume indicator:', error);
      return indicatorName;
    }
  };

// Volume Indicator Registration
// const registerVolumeIndicator = (volumeConfig: VolumeConfig) => {
//   const indicatorName = `VOLUME_${volumeConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
//   try {
//     registerIndicator({
//       name: indicatorName,
//       shortName: 'VOL',
//       calcParams: volumeConfig.showMA ? [volumeConfig.maPeriod] : [],
//       figures: [
//         {
//           key: 'volume',
//           title: 'VOLUME: ',
//           type: 'bar',
//           baseValue: 0,
//           styles: () => ({
//             bar: {
//               upColor: volumeConfig.upColor,
//               downColor: volumeConfig.downColor,
//               noChangeColor: volumeConfig.upColor,
//             },
//             opacity: volumeConfig.opacity,
//           })
//         },
//         ...(volumeConfig.showMA ? [{
//           key: 'ma',
//           title: `MA${volumeConfig.maPeriod}: `,
//           type: 'line',
//           styles: () => ({
//             color: volumeConfig.maColor,
//             size: volumeConfig.maLineSize,
//           })
//         }] : [])
//       ],
//       calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
//         const result: any[] = [];
//         const maPeriod = volumeConfig.showMA ? (calcParams[0] || volumeConfig.maPeriod) : 0;

//         for (let i = 0; i < dataList.length; i++) {
//           const currentData = dataList[i];
//           const volume = currentData.volume || 0;
//           const isUp = currentData.close >= currentData.open;
          
//           const volumeItem: any = { 
//             volume,
//             // Add color information for dynamic styling
//             color: isUp ? volumeConfig.upColor : volumeConfig.downColor
//           };

//           // Calculate MA if enabled
//           if (volumeConfig.showMA && maPeriod > 0) {
//             if (i >= maPeriod - 1) {
//               let sum = 0;
//               for (let j = 0; j < maPeriod; j++) {
//                 sum += dataList[i - j].volume || 0;
//               }
//               volumeItem.ma = sum / maPeriod;
//             } else {
//               volumeItem.ma = 0;
//             }
//           }

//           result.push(volumeItem);
//         }

//         return result;
//       },
//     });

//     console.log(`Successfully registered volume indicator: ${indicatorName}`, {
//       upColor: volumeConfig.upColor,
//       downColor: volumeConfig.downColor,
//       opacity: volumeConfig.opacity,
//       showMA: volumeConfig.showMA,
//       maPeriod: volumeConfig.maPeriod,
//       maColor: volumeConfig.maColor,
//       maLineSize: volumeConfig.maLineSize
//     });

//     return indicatorName;
//   } catch (error) {
//     console.error('Error registering Volume indicator:', error);
//     return indicatorName;
//   }
// };

// Helper function to get active tool from localStorage
const getStoredActiveTool = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('active-tool') || '';
  } catch (error) {
    console.error('Error loading active tool from localStorage:', error);
    return '';
  }
};

// Helper function to save active tool to localStorage
const saveActiveTool = (tool: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('active-tool', tool);
  } catch (error) {
    console.error('Error saving active tool to localStorage:', error);
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
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>(() => getStoredActiveTool());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Register all RSI indicators
  useEffect(() => {
    let mounted = true;
    
    const registerAllRSIIndicators = async () => {
      if (!mounted) return;
      
      try {
        // Clear any previously registered RSI indicators
        if ((window as any).__registeredRSIIndicators) {
          (window as any).__registeredRSIIndicators = [];
        }
        
        // Register all RSI indicators
        config.indicators.rsi.forEach(rsiConfig => {
          const indicatorName = registerRSIIndicator(rsiConfig);
          if (!(window as any).__registeredRSIIndicators) {
            (window as any).__registeredRSIIndicators = [];
          }
          (window as any).__registeredRSIIndicators.push(indicatorName);
        });
      } catch (error) {
        console.error('Error registering RSI indicators:', error);
      }
    };

    registerAllRSIIndicators();

    return () => {
      mounted = false;
    };
  }, [config.indicators.rsi]);

  // Register all Volume indicators
  useEffect(() => {
    let mounted = true;
    
    const registerAllVolumeIndicators = async () => {
      if (!mounted) return;
      
      try {
        // Clear any previously registered custom volume indicators
        if ((window as any).__registeredVolumeIndicators) {
          (window as any).__registeredVolumeIndicators.forEach((indicatorName: string) => {
            try {
              // You might need to unregister indicators if klinecharts supports it
            } catch (error) {
              // Ignore errors
            }
          });
          (window as any).__registeredVolumeIndicators = [];
        }
        
        // Register all volume indicators
        config.indicators.volume.forEach(volumeConfig => {
          const indicatorName = registerCustomVolumeIndicator(volumeConfig);
          if (!(window as any).__registeredVolumeIndicators) {
            (window as any).__registeredVolumeIndicators = [];
          }
          (window as any).__registeredVolumeIndicators.push(indicatorName);
        });
      } catch (error) {
        console.error('Error registering volume indicators:', error);
      }
    };

    registerAllVolumeIndicators();

    return () => {
      mounted = false;
    };
  }, [config.indicators.volume]);

  // Save active tool to localStorage whenever it changes
  useEffect(() => {
    saveActiveTool(activeDrawingTool);
  }, [activeDrawingTool]);

  // Handle drawing tool selection
  const handleDrawingToolSelect = useCallback((tool: string) => {
    setActiveDrawingTool(tool);

    if (tool === 'rsi') {
      return;
    }

    if (tool.startsWith('rsi-toggle-')) {
      const rsiId = tool.replace('rsi-toggle-', '');
      toggleRSI(rsiId);
      return;
    }

    if (tool.startsWith('volume-toggle-')) {
      const volumeId = tool.replace('volume-toggle-', '');
      toggleVolume(volumeId);
      return;
    }
    
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
  }, [toggleRSI, toggleVolume]);

  // Setup RSI indicators on chart
  const setupRSIIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing RSI indicators first
      const allRSINames = config.indicators.rsi.map(rsiConfig => 
        `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`
      );
      
      allRSINames.forEach(indicatorName => {
        try {
          chart.removeIndicator(indicatorName);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Add visible RSI indicators with updated styles
      config.indicators.rsi
        .filter(rsiConfig => rsiConfig.show)
        .forEach((rsiConfig, index) => {
          const indicatorName = `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
          
          try {
            chart.createIndicator(indicatorName, false, {
              id: indicatorName,
              height: 100,
              gap: {
                top: 0.2,
                bottom: 0.2,
              },
              styles: {
                rsi: {
                  color: rsiConfig.lineColor,
                  size: rsiConfig.lineSize,
                },
                marginTop: 10 * index,
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

  // Volume indicator setup
  const setupVolumeIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      console.log('🔧 Setting up CUSTOM volume indicators with config:', config.indicators.volume);

      // Remove ALL existing volume indicators
      const volumeIds = ['volume', 'VOL', 'VOLUME', 'volume_1', 'volume_2', 'CUSTOM_VOLUME'];
      volumeIds.forEach(id => {
        try {
          chart.removeIndicator(id);
          console.log(`🗑️ Removed volume indicator: ${id}`);
        } catch (e) {
          // Ignore errors - indicator might not exist
        }
      });

      // Only setup volume if at least one volume config is enabled
      const enabledVolumes = config.indicators.volume.filter(vol => vol.show);
      
      if (enabledVolumes.length > 0) {
        const volumeConfig = enabledVolumes[0];
        
        // Register and create custom volume indicator
        const indicatorName = registerCustomVolumeIndicator(volumeConfig);
        
        // Get enabled MA periods for calcParams
        const enabledMAPeriods = (volumeConfig.maLines || [])
          .filter(ma => ma && ma.show)
          .map(ma => ma.period);

        console.log('📊 Creating CUSTOM volume indicator with:', {
          indicatorName,
          upColor: volumeConfig.upColor,
          downColor: volumeConfig.downColor,
          opacity: volumeConfig.opacity,
          maPeriods: enabledMAPeriods
        });

        try {
          // Create the custom volume indicator
          chart.createIndicator(indicatorName, false, {
            id: 'volume',
            height: 80,
            gap: {
              top: 0.1,
              bottom: 0.1,
            }
          });

          console.log('✅ Custom volume indicator created successfully');
          
        } catch (createError) {
          console.error('❌ Error creating custom volume indicator:', createError);
        }
      } else {
        console.log('ℹ️ No enabled volume configurations - volume indicator hidden');
      }
    } catch (error) {
      console.error('💥 Error in volume indicator setup:', error);
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
        
        // Give a small delay before setting up volume to ensure chart is ready
        setTimeout(() => {
          if (mounted && chartInstance) {
            setupVolumeIndicators(chartInstance);
          }
        }, 100);
        
        setupWebSocket(chartInstance);

      } catch (err) {
        if (!mounted) return;
        
        console.error('❌ Error in chart initialization:', err);
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
    
    const updateRSIIndicators = async () => {
      try {
        // Re-register all RSI indicators first
        config.indicators.rsi.forEach(rsiConfig => {
          registerRSIIndicator(rsiConfig);
        });
        
        // Then setup the indicators on chart
        setupRSIIndicators(chartRef.current);
        
        // Force complete refresh
        setTimeout(() => {
          chartRef.current?.resize();
          // Re-apply data to force indicator recalculation
          if (currentDataRef.current.length > 0) {
            const klineData = convertToKLineData(currentDataRef.current);
            chartRef.current?.applyNewData(klineData);
          }
        }, 50);
      } catch (error) {
        console.error('Error updating RSI indicators:', error);
      }
    };

    const timer = setTimeout(updateRSIIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.rsi, setupRSIIndicators]);

  // Effect for Volume indicator changes
  useEffect(() => {
    if (!chartRef.current) {
      console.log('📈 Chart not ready for volume update');
      return;
    }
    
    console.log('🔄 Volume config changed, forcing complete refresh...');

    const updateVolumeIndicators = () => {
      try {
        console.log('🔄 Recreating volume indicator with new config...');
        setupVolumeIndicators(chartRef.current);
        
        // Force complete chart refresh
        setTimeout(() => {
          if (chartRef.current && currentDataRef.current.length > 0) {
            const klineData = convertToKLineData(currentDataRef.current);
            chartRef.current.applyNewData(klineData);
            chartRef.current.resize();
            console.log('✅ Chart completely refreshed with new volume settings');
          }
        }, 100);
      } catch (error) {
        console.error('💥 Error updating volume indicators:', error);
      }
    };

    const timer = setTimeout(updateVolumeIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.volume, setupVolumeIndicators]);

  // handle migration from old config structure
  useEffect(() => {
    const checkAndMigrateVolumeConfig = () => {
      const volumeConfigs = config.indicators.volume;
      
      // Check if any volume config needs migration
      const needsMigration = volumeConfigs.some(vol => {
        // If maLines doesn't exist or isn't an array, needs migration
        return !vol.maLines || !Array.isArray(vol.maLines);
      });
      
      if (needsMigration) {
        console.log('🔄 Detected old volume config structure, triggering refresh...');
        // Force a complete refresh of the chart
        setTimeout(() => {
          if (chartRef.current) {
            setupVolumeIndicators(chartRef.current);
          }
        }, 500);
      }
    };

    checkAndMigrateVolumeConfig();
  }, [config.indicators.volume, setupVolumeIndicators]);

  // Force refresh function for immediate updates
  const forceChartReset = useCallback(() => {
    if (chartRef.current && chartContainerRef.current) {
      try {
        // Completely dispose and reinitialize the chart
        dispose(chartContainerRef.current);
        
        setTimeout(() => {
          const newChart = initializeChart();
          if (newChart && currentDataRef.current.length > 0) {
            chartRef.current = newChart;
            const klineData = convertToKLineData(currentDataRef.current);
            newChart.applyNewData(klineData);
            applyChartStyles(newChart);
            setupRSIIndicators(newChart);
            setupVolumeIndicators(newChart);
            console.log('🔄 Chart completely reset');
          }
        }, 100);
      } catch (error) {
        console.error('❌ Error resetting chart:', error);
      }
    }
  }, [initializeChart, applyChartStyles, setupRSIIndicators, setupVolumeIndicators]);

  // Debug effect to track volume config changes
  useEffect(() => {
    console.log('=== 🎯 VOLUME CONFIG DEBUG ===');
    console.log('Full volume config array:', config.indicators.volume);
    
    config.indicators.volume.forEach((vol, index) => {
      console.log(`Volume config ${index}:`, {
        id: vol.id,
        show: vol.show,
        name: vol.name,
        upColor: vol.upColor,
        downColor: vol.downColor,
        opacity: vol.opacity,
        maLines: vol.maLines?.map(ma => ({
          id: ma.id,
          show: ma.show,
          period: ma.period,
          color: ma.color,
          lineSize: ma.lineSize
        }))
      });
    });
    
    // Check if any volume is enabled
    const enabledVolumes = config.indicators.volume.filter(vol => vol.show);
    console.log(`Enabled volumes: ${enabledVolumes.length}`);
    
    if (enabledVolumes.length > 0) {
      const firstEnabled = enabledVolumes[0];
      const enabledMAs = firstEnabled.maLines?.filter(ma => ma.show) || [];
      console.log(`Enabled MAs: ${enabledMAs.length}`, enabledMAs);
    }
    
    console.log('=== 🎯 END DEBUG ===');
  }, [config.indicators.volume]);

  // Effect for chart style changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 100);

    return () => clearTimeout(timer);
  }, [config.chart, applyChartStyles]);

  // Effect for chart type changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 100);

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