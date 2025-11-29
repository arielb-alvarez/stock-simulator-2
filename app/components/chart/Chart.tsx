// components/chart/Chart.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  init, 
  dispose,
  KLineData,
  registerIndicator,
} from 'klinecharts';
import { useGlobalContext, RSIConfig, VolumeConfig, MAConfig, BBConfig, VWAPConfig } from '@/context/GlobalContext';
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

// Track registered indicators
const registeredIndicators = new Set();

// Register Custom MA Indicator that supports multiple periods
const registerCustomMAIndicator = (maConfigs: MAConfig[]) => {
  const enabledPeriods = maConfigs
    .filter(ma => ma.show)
    .map(ma => ma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const uniqueName = `CUSTOM_MA_${enabledPeriods.join('_')}`;
  
  // Check if already registered
  if (registeredIndicators.has(uniqueName)) {
    return uniqueName;
  }
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'MA',
      calcParams: enabledPeriods,
      figures: enabledPeriods.map((period, index) => ({
        key: `ma${index + 1}`,
        title: `MA${period}: `,
        type: 'line',
        styles: () => {
          const config = maConfigs.find(m => m.period === period && m.show);
          return {
            color: config?.color || '#2962FF',
            size: config?.lineSize || 1.5
          };
        }
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          // Calculate MA for each period
          calcParams.forEach((period, index) => {
            const key = `ma${index + 1}`;
            if (i >= period - 1) {
              let sum = 0;
              for (let j = 0; j < period; j++) {
                sum += dataList[i - j].close;
              }
              item[key] = sum / period;
            } else {
              item[key] = 0;
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom MA indicator:', error);
    return indicatorName;
  }
};

// Register Custom EMA Indicator that supports multiple periods
const registerCustomEMAIndicator = (emaConfigs: MAConfig[]) => {
  const enabledPeriods = emaConfigs
    .filter(ema => ema.show)
    .map(ema => ema.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const uniqueName = `CUSTOM_EMA_${enabledPeriods.join('_')}`;
  
  // Check if already registered
  if (registeredIndicators.has(uniqueName)) {
    return uniqueName;
  }
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'EMA',
      calcParams: enabledPeriods,
      figures: enabledPeriods.map((period, index) => ({
        key: `ema${index + 1}`,
        title: `EMA${period}: `,
        type: 'line',
        styles: () => {
          const config = emaConfigs.find(e => e.period === period && e.show);
          return {
            color: config?.color || '#FF6B6B',
            size: config?.lineSize || 1.5
          };
        }
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        const multipliers: number[] = calcParams.map(period => 2 / (period + 1));
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          calcParams.forEach((period, index) => {
            const key = `ema${index + 1}`;
            if (i === 0) {
              // First value is just the close price
              item[key] = dataList[i].close;
            } else if (i < period - 1) {
              // Not enough data for proper EMA calculation
              let sum = 0;
              for (let j = 0; j <= i; j++) {
                sum += dataList[j].close;
              }
              item[key] = sum / (i + 1);
            } else {
              // Standard EMA calculation: (Close - Previous EMA) * multiplier + Previous EMA
              const previousEMA = result[i - 1][key] || dataList[i - 1].close;
              item[key] = (dataList[i].close - previousEMA) * multipliers[index] + previousEMA;
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom EMA indicator:', error);
    return indicatorName;
  }
};

// Register Custom WMA Indicator that supports multiple periods
const registerCustomWMAIndicator = (wmaConfigs: MAConfig[]) => {
  const enabledPeriods = wmaConfigs
    .filter(wma => wma.show)
    .map(wma => wma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const uniqueName = `CUSTOM_WMA_${enabledPeriods.join('_')}`;
  
  // Check if already registered
  if (registeredIndicators.has(uniqueName)) {
    return uniqueName;
  }
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'WMA',
      calcParams: enabledPeriods,
      figures: enabledPeriods.map((period, index) => ({
        key: `wma${index + 1}`,
        title: `WMA${period}: `,
        type: 'line',
        styles: () => {
          const config = wmaConfigs.find(w => w.period === period && w.show);
          return {
            color: config?.color || '#4ECDC4',
            size: config?.lineSize || 1.5
          };
        }
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          calcParams.forEach((period, index) => {
            const key = `wma${index + 1}`;
            if (i >= period - 1) {
              let weightSum = 0;
              let weightedSum = 0;
              
              // Calculate weighted average
              for (let j = 0; j < period; j++) {
                const weight = period - j; // More weight to recent prices
                weightSum += weight;
                weightedSum += dataList[i - j].close * weight;
              }
              
              item[key] = weightedSum / weightSum;
            } else {
              // Not enough data, use simple average
              let sum = 0;
              for (let j = 0; j <= i; j++) {
                sum += dataList[j].close;
              }
              item[key] = sum / (i + 1);
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom WMA indicator:', error);
    return indicatorName;
  }
};

// Get current indicator names based on config
const getCurrentIndicatorNames = (
  maConfigs: MAConfig[], 
  emaConfigs: MAConfig[], 
  wmaConfigs: MAConfig[], 
  bbConfigs: BBConfig[],
  vwapConfigs: VWAPConfig[]
) => {
  const maPeriods = maConfigs.filter(ma => ma.show).map(ma => ma.period).sort((a, b) => a - b);
  const emaPeriods = emaConfigs.filter(ema => ema.show).map(ema => ema.period).sort((a, b) => a - b);
  const wmaPeriods = wmaConfigs.filter(wma => wma.show).map(wma => wma.period).sort((a, b) => a - b);
  const bbConfigParams = bbConfigs
    .filter(bb => bb.show)
    .map(bb => `${bb.period}_${bb.stdDev}`)
    .sort();
  const vwapConfigIds = vwapConfigs
    .filter(vwap => vwap.show)
    .map(vwap => vwap.id)
    .sort();

  return {
    ma: maPeriods.length > 0 ? `CUSTOM_MA_${maPeriods.join('_')}` : null,
    ema: emaPeriods.length > 0 ? `CUSTOM_EMA_${emaPeriods.join('_')}` : null,
    wma: wmaPeriods.length > 0 ? `CUSTOM_WMA_${wmaPeriods.join('_')}` : null,
    bb: bbConfigParams.length > 0 ? `CUSTOM_BB_${bbConfigParams.join('_')}` : null,
    vwap: vwapConfigIds.length > 0 ? `CUSTOM_VWAP_${vwapConfigIds.join('_')}` : null,
  };
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
          styles: (volumeData: any) => {
            // Use the direction flag we set in the calc function
            const isUp = volumeData?.current?.indicatorData?.isUp ?? true;
            
            return {
              color: isUp ? volumeConfig.upColor : volumeConfig.downColor,
              opacity: volumeConfig.opacity,
            };
          }
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
          
          // Determine if current candle is up or down
          const isUp = currentData.close >= currentData.open;
          
          const volumeItem: any = { 
            volume,
            // Pass the direction information to the styles function
            isUp
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
    return indicatorName;
  } catch (error) {
    console.error('❌ Error registering custom Volume indicator:', error);
    return indicatorName;
  }
};

// Register Custom Bollinger Bands Indicator
const registerCustomBBIndicator = (bbConfigs: BBConfig[]) => {
  const enabledConfigs = bbConfigs
    .filter(bb => bb.show)
    .sort((a, b) => a.period - b.period);

  if (enabledConfigs.length === 0) return null;

  const uniqueName = `CUSTOM_BB_${enabledConfigs.join('_')}`;
  
  // Check if already registered
  if (registeredIndicators.has(uniqueName)) {
    return uniqueName;
  }
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'BB',
      calcParams: enabledConfigs.map(bb => [bb.period, bb.stdDev]).flat(),
      figures: enabledConfigs.flatMap((bbConfig, index) => [
        {
          key: `bb_upper_${index}`,
          title: `BB Upper ${bbConfig.period}: `,
          type: 'line',
          styles: () => ({
            color: bbConfig.color,
            size: bbConfig.lineSize,
          })
        },
        {
          key: `bb_middle_${index}`,
          title: `BB Middle ${bbConfig.period}: `,
          type: 'line',
          styles: () => ({
            color: bbConfig.color,
            size: bbConfig.lineSize,
            style: 'dashed',
          })
        },
        {
          key: `bb_lower_${index}`,
          title: `BB Lower ${bbConfig.period}: `,
          type: 'line',
          styles: () => ({
            color: bbConfig.color,
            size: bbConfig.lineSize,
          })
        }
      ]),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        // Group params by config (each config has period and stdDev)
        const configs: { period: number, stdDev: number }[] = [];
        for (let i = 0; i < calcParams.length; i += 2) {
          configs.push({
            period: calcParams[i],
            stdDev: calcParams[i + 1]
          });
        }
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          configs.forEach((config, configIndex) => {
            const { period, stdDev } = config;
            
            if (i >= period - 1) {
              // Calculate SMA (middle band)
              let sum = 0;
              for (let j = 0; j < period; j++) {
                sum += dataList[i - j].close;
              }
              const sma = sum / period;
              
              // Calculate standard deviation
              let variance = 0;
              for (let j = 0; j < period; j++) {
                variance += Math.pow(dataList[i - j].close - sma, 2);
              }
              const deviation = Math.sqrt(variance / period);
              
              // Set Bollinger Bands values
              item[`bb_upper_${configIndex}`] = sma + (deviation * stdDev);
              item[`bb_middle_${configIndex}`] = sma;
              item[`bb_lower_${configIndex}`] = sma - (deviation * stdDev);
            } else {
              // Not enough data
              item[`bb_upper_${configIndex}`] = 0;
              item[`bb_middle_${configIndex}`] = 0;
              item[`bb_lower_${configIndex}`] = 0;
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom BB indicator:', error);
    return indicatorName;
  }
};

// Register Custom VWAP Indicator
const registerCustomVWAPIndicator = (vwapConfigs: VWAPConfig[]) => {
  const enabledConfigs = vwapConfigs.filter(vwap => vwap.show);

  if (enabledConfigs.length === 0) return null;

  try {
    const uniqueName = `CUSTOM_VWAP_${enabledConfigs.map(vwap => `${vwap.id}_${vwap.length}`).join('_')}`;
    
    // Check if already registered to avoid duplicates
    if (registeredIndicators.has(uniqueName)) {
      return uniqueName;
    }

    registerIndicator({
      name: uniqueName,
      shortName: 'VWAP',
      calcParams: enabledConfigs.map(config => config.length),
      figures: enabledConfigs.map((vwapConfig, index) => ({
        key: `vwap${index}`,
        title: `VWAP${vwapConfig.length > 0 ? ` (${vwapConfig.length})` : ''}: `,
        type: 'line',
        styles: () => ({
          color: vwapConfig.color,
          size: vwapConfig.lineSize,
        })
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        if (!dataList || dataList.length === 0) {
          return result;
        }

        // Pre-calculate typical prices for performance
        const typicalPrices = dataList.map(data => 
          (data.high + data.low + data.close) / 3
        );

        // Initialize cumulative arrays for each config
        const cumulativeVolumes = new Array(enabledConfigs.length).fill(0);
        const cumulativeVolumePrices = new Array(enabledConfigs.length).fill(0);
        const sessionStarts = new Array(enabledConfigs.length).fill('');
        
        for (let i = 0; i < dataList.length; i++) {
          const currentData = dataList[i];
          const typicalPrice = typicalPrices[i];
          const volume = currentData.volume || 0;
          const volumePrice = typicalPrice * volume;
          
          const item: any = {};
          
          enabledConfigs.forEach((config, configIndex) => {
            const length = calcParams[configIndex];
            
            if (length === 0) {
              // Session-based VWAP (resets at UTC midnight)
              const timestamp = currentData.timestamp;
              const date = new Date(timestamp);
              const sessionKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
              
              // Reset cumulative values if session changed
              if (sessionKey !== sessionStarts[configIndex]) {
                cumulativeVolumes[configIndex] = 0;
                cumulativeVolumePrices[configIndex] = 0;
                sessionStarts[configIndex] = sessionKey;
              }
              
              cumulativeVolumes[configIndex] += volume;
              cumulativeVolumePrices[configIndex] += volumePrice;
              
              const vwap = cumulativeVolumes[configIndex] > 0 
                ? cumulativeVolumePrices[configIndex] / cumulativeVolumes[configIndex] 
                : typicalPrice;
              
              item[`vwap${configIndex}`] = vwap;
            } else {
              // Rolling VWAP with specified length
              if (i >= length - 1) {
                let cumulativeVolume = 0;
                let cumulativeVolumePrice = 0;
                
                for (let j = 0; j < length; j++) {
                  const dataIndex = i - j;
                  const typicalPrice = typicalPrices[dataIndex];
                  const volume = dataList[dataIndex].volume || 0;
                  const volumePrice = typicalPrice * volume;
                  
                  cumulativeVolume += volume;
                  cumulativeVolumePrice += volumePrice;
                }
                
                item[`vwap${configIndex}`] = cumulativeVolume > 0 
                  ? cumulativeVolumePrice / cumulativeVolume 
                  : typicalPrice;
              } else {
                // Not enough data for rolling VWAP, use all available data
                let cumulativeVolume = 0;
                let cumulativeVolumePrice = 0;
                
                for (let j = 0; j <= i; j++) {
                  const typicalPrice = typicalPrices[j];
                  const volume = dataList[j].volume || 0;
                  const volumePrice = typicalPrice * volume;
                  
                  cumulativeVolume += volume;
                  cumulativeVolumePrice += volumePrice;
                }
                
                item[`vwap${configIndex}`] = cumulativeVolume > 0 
                  ? cumulativeVolumePrice / cumulativeVolume 
                  : typicalPrice;
              }
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    console.log(`✅ Registered VWAP indicator: ${uniqueName}`);
    return uniqueName;
  } catch (error) {
    console.error('❌ Error registering custom VWAP indicator:', error);
    return null;
  }
};

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
  const { 
    config, 
    toggleRSI, 
    toggleVolume, 
    toggleMA,
    toggleEMA,
    toggleWMA,
    toggleBB,
    toggleVWAP
  } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>(() => getStoredActiveTool());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [chartKey, setChartKey] = useState(0);

  // Force chart refresh when MA configurations change
  const forceChartRefresh = useCallback(() => {
    if (chartRef.current && chartContainerRef.current) {
      console.log('Force refreshing chart due to MA configuration change');
      setChartKey(prev => prev + 1);
    }
  }, []);

  // Register all custom indicators
  useEffect(() => {
    let mounted = true;
    
    const registerAllIndicators = async () => {
      if (!mounted) return;
      
      try {
        console.log('🔄 Registering all custom indicators...');
        
        // Register all custom indicators
        registerCustomMAIndicator(config.indicators.ma);
        registerCustomEMAIndicator(config.indicators.ema);
        registerCustomWMAIndicator(config.indicators.wma);
        registerCustomBBIndicator(config.indicators.bb);
        registerCustomVWAPIndicator(config.indicators.vwap);
        
        // Register RSI indicators
        if ((window as any).__registeredRSIIndicators) {
          (window as any).__registeredRSIIndicators = [];
        }
        
        config.indicators.rsi.forEach(rsiConfig => {
          const indicatorName = registerRSIIndicator(rsiConfig);
          if (!(window as any).__registeredRSIIndicators) {
            (window as any).__registeredRSIIndicators = [];
          }
          (window as any).__registeredRSIIndicators.push(indicatorName);
        });

        // Register volume indicators
        if ((window as any).__registeredVolumeIndicators) {
          (window as any).__registeredVolumeIndicators = [];
        }
        
        config.indicators.volume.forEach(volumeConfig => {
          const indicatorName = registerCustomVolumeIndicator(volumeConfig);
          if (!(window as any).__registeredVolumeIndicators) {
            (window as any).__registeredVolumeIndicators = [];
          }
          (window as any).__registeredVolumeIndicators.push(indicatorName);
        });

        console.log('✅ All indicators registered successfully');
      } catch (error) {
        console.error('❌ Error registering indicators:', error);
      }
    };

    registerAllIndicators();

    return () => {
      mounted = false;
    };
  }, [
    config.indicators.rsi, 
    config.indicators.volume, 
    config.indicators.ma, 
    config.indicators.ema, 
    config.indicators.wma, 
    config.indicators.bb,
    config.indicators.vwap
  ]);

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

    // Add MA toggle support
    if (tool.startsWith('ma-toggle-')) {
      const maId = tool.replace('ma-toggle-', '');
      toggleMA(maId);
      return;
    }

    // Add EMA toggle support
    if (tool.startsWith('ema-toggle-')) {
      const emaId = tool.replace('ema-toggle-', '');
      toggleEMA(emaId);
      return;
    }

    // Add WMA toggle support
    if (tool.startsWith('wma-toggle-')) {
      const wmaId = tool.replace('wma-toggle-', '');
      toggleWMA(wmaId);
      return;
    }

    if (tool.startsWith('bb-toggle-')) {
      const bbId = tool.replace('bb-toggle-', '');
      toggleBB(bbId);
      return;
    }

    if (tool.startsWith('vwap-toggle-')) {
      const vwapId = tool.replace('vwap-toggle-', '');
      toggleVWAP(vwapId);
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
  }, [toggleRSI, toggleVolume, toggleMA, toggleEMA, toggleWMA, toggleBB, toggleVWAP]);

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
      // Remove ALL existing volume indicators
      const volumeIds = ['volume', 'VOL', 'VOLUME', 'volume_1', 'volume_2', 'CUSTOM_VOLUME'];
      volumeIds.forEach(id => {
        try {
          chart.removeIndicator(id);
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
        
        try {
          // Create the custom volume indicator
          chart.createIndicator(indicatorName, false, {
            id: 'volume',
            height: 80,
            gap: {
              top: 0.1,
              bottom: 0.1,
            },
          });

          // Apply volume styles directly to the chart's volume indicator
          setTimeout(() => {
            try {
              chart.setStyles({
                indicator: {
                  volume: {
                    bar: {
                      upColor: volumeConfig.upColor,
                      downColor: volumeConfig.downColor,
                      noChangeColor: volumeConfig.upColor,
                    },
                    opacity: volumeConfig.opacity,
                  }
                }
              });
            } catch (styleError) {
              console.error('Error applying volume styles:', styleError);
            }
          }, 100);
          console.log('Custom volume indicator created successfully');
        } catch (createError) {
          console.error('Error creating custom volume indicator:', createError);
        }
      } else {
        console.log('No enabled volume configurations - volume indicator hidden');
      }
    } catch (error) {
      console.error('Error in volume indicator setup:', error);
    }
  }, [config.indicators.volume]);

  // Setup MA, EMA, WMA as technical indicator overlays in the candle pane
  const setupMovingAverageOverlays = useCallback((chart: any) => {
    if (!chart) {
      console.warn('Chart instance not available for moving average setup');
      return;
    }

    try {
      // Register indicators first and get their unique names
      const maUniqueName = registerCustomMAIndicator(config.indicators.ma);
      const emaUniqueName = registerCustomEMAIndicator(config.indicators.ema);
      const wmaUniqueName = registerCustomWMAIndicator(config.indicators.wma);
      const bbUniqueName = registerCustomBBIndicator(config.indicators.bb);
      const vwapUniqueName = registerCustomVWAPIndicator(config.indicators.vwap);

      // Remove all existing moving average overlays first
      const allOverlayNames = [
        maUniqueName, emaUniqueName, wmaUniqueName, bbUniqueName, vwapUniqueName,
        'CUSTOM_MA', 'CUSTOM_EMA', 'CUSTOM_WMA', 'CUSTOM_BB', 'CUSTOM_VWAP'
      ].filter(Boolean); // Remove null values
      
      console.log('Setting up moving average overlays, removing:', allOverlayNames);
      
      // Clean up existing overlays
      allOverlayNames.forEach(indicatorName => {
        try {
          if (indicatorName) {
            chart.removeIndicator(indicatorName);
            console.log(`Removed overlay: ${indicatorName}`);
          }
        } catch (e) {
          // Ignore removal errors - indicator might not exist
        }
      });

      // Get enabled configurations for each type
      const enabledMA = config.indicators.ma.filter(ma => ma.show);
      const enabledEMA = config.indicators.ema.filter(ema => ema.show);
      const enabledWMA = config.indicators.wma.filter(wma => wma.show);
      const enabledBB = config.indicators.bb.filter(bb => bb.show);
      const enabledVWAP = config.indicators.vwap.filter(vwap => vwap.show);

      // Create overlays for enabled indicators
      if (enabledMA.length > 0 && maUniqueName) {
        try {
          chart.createIndicator(maUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created MA overlay with periods:`, enabledMA.map(ma => ma.period));
        } catch (createError) {
          console.error('Failed to create MA overlay:', createError);
        }
      }

      if (enabledEMA.length > 0 && emaUniqueName) {
        try {
          chart.createIndicator(emaUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created EMA overlay with periods:`, enabledEMA.map(ema => ema.period));
        } catch (createError) {
          console.error('Failed to create EMA overlay:', createError);
        }
      }

      if (enabledWMA.length > 0 && wmaUniqueName) {
        try {
          chart.createIndicator(wmaUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created WMA overlay with periods:`, enabledWMA.map(wma => wma.period));
        } catch (createError) {
          console.error('Failed to create WMA overlay:', createError);
        }
      }

      if (enabledBB.length > 0 && bbUniqueName) {
        try {
          chart.createIndicator(bbUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created BB overlay with periods:`, enabledBB.map(bb => bb.period));
        } catch (createError) {
          console.error('Failed to create BB overlay:', createError);
        }
      }

      if (enabledVWAP.length > 0 && vwapUniqueName) {
        try {
          chart.createIndicator(vwapUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created VWAP overlay with lengths:`, enabledVWAP.map(vwap => vwap.length));
        } catch (createError) {
          console.error('Failed to create VWAP overlay:', createError);
        }
      }

      const totalOverlays = [enabledMA, enabledEMA, enabledWMA, enabledBB, enabledVWAP]
        .filter(arr => arr.length > 0).length;
      console.log(`Created ${totalOverlays} moving average overlays in candle pane`);

    } catch (error) {
      console.error('Critical error in moving average overlay setup:', error);
    }
  }, [config.indicators.ma, config.indicators.ema, config.indicators.wma, config.indicators.bb, config.indicators.vwap]);

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
        // Initial load or full refresh
        chart.applyNewData(klineData);
      } else {
        // Real-time update - update last candle
        const lastCandle = klineData[klineData.length - 1];
        
        // Use updateData for real-time updates
        const success = chart.updateData(lastCandle);
        
        if (!success) {
          // If update fails, do a full refresh
          console.log('Real-time update failed, doing full refresh');
          chart.applyNewData(klineData);
        }
        
        // Force indicators to recalculate
        setTimeout(() => {
          chart.resize();
        }, 50);
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
        setupMovingAverageOverlays(chartInstance);
        
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
  }, [
    config.symbol, 
    config.interval, 
    config.limit, 
    initializeChart, 
    updateChartWithData, 
    applyChartStyles, 
    setupRSIIndicators, 
    setupMovingAverageOverlays,
    setupVolumeIndicators, 
    setupWebSocket, 
    cleanup,
    chartKey // Add chartKey as dependency to reinitialize when it changes
  ]);

  // Effect for MA, EMA, WMA, BB overlay changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length) return;
    
    console.log('configuration changed, forcing complete refresh');
    
    // Force a complete chart refresh when MA configurations change
    const timer = setTimeout(() => {
      forceChartRefresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [
    config.indicators.ma, 
    config.indicators.ema, 
    config.indicators.wma, 
    config.indicators.bb, 
    config.indicators.vwap, 
    forceChartRefresh
  ]);

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
      console.log('Chart not ready for volume update');
      return;
    }

    const updateVolumeIndicators = () => {
      try {
        setupVolumeIndicators(chartRef.current);
        
        // Force complete chart refresh
        setTimeout(() => {
          if (chartRef.current && currentDataRef.current.length > 0) {
            const klineData = convertToKLineData(currentDataRef.current);
            chartRef.current.applyNewData(klineData);
            chartRef.current.resize();
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
            setupMovingAverageOverlays(newChart);
            setupVolumeIndicators(newChart);
          }
        }, 100);
      } catch (error) {
        console.error('❌ Error resetting chart:', error);
      }
    }
  }, [
    initializeChart, 
    applyChartStyles, 
    setupRSIIndicators, 
    setupMovingAverageOverlays,
    setupVolumeIndicators
  ]);

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
            key={chartKey} // Add key to force re-render
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