// utils/indicatorRegistry.ts
import { registerIndicator, KLineData } from 'klinecharts';
import { RSIConfig, VolumeConfig, MAConfig, BBConfig, VWAPConfig, AVLConfig, TRIXConfig  } from '@/context/GlobalContext';

// Track registered indicators - reset on each config change
const registeredIndicators = new Set();

// Generate a unique key for MA configurations
export const generateMAKey = (maConfigs: MAConfig[]): string => {
  return maConfigs
    .filter(ma => ma.show)
    .map(ma => `${ma.period}_${ma.color}_${ma.lineSize}`)
    .sort()
    .join('_');
};

// Generate a unique key for AVL configurations
export const generateAVLKey = (avlConfigs: AVLConfig[]): string => {
  return avlConfigs
    .filter(avl => avl.show)
    .map(avl => `${avl.period}_${avl.color}_${avl.lineSize}`)
    .sort()
    .join('_');
};

// Generate a unique key for BB configurations  
export const generateBBKey = (bbConfigs: BBConfig[]): string => {
  return bbConfigs
    .filter(bb => bb.show)
    .map(bb => `${bb.period}_${bb.stdDev}_${bb.background.show ? 'bg' : 'nobg'}_${bb.upLine.show ? 'up' : 'noup'}_${bb.middleLine.show ? 'mid' : 'nomid'}_${bb.downLine.show ? 'dn' : 'nodn'}`)
    .sort()
    .join('_');
};

// Generate a unique key for VWAP configurations
export const generateVWAPKey = (vwapConfigs: VWAPConfig[]): string => {
  return vwapConfigs
    .filter(vwap => vwap.show)
    .map(vwap => `${vwap.id}_${vwap.length}_${vwap.color}_${vwap.lineSize}`)
    .sort()
    .join('_');
};

// Generate a unique key for TRIX configurations
export const generateTRIXKey = (trixConfigs: TRIXConfig[]): string => {
  return trixConfigs
    .filter(trix => trix.show)
    .map(trix => `${trix.period}_${trix.color}_${trix.lineSize}`)
    .sort()
    .join('_');
};

// Clear all overlay indicators from chart
export const clearOverlayIndicators = (chart: any) => {
  if (!chart) return;
  
  try {
    console.log('Clearing overlay indicators...');
    
    const overlayPatterns = [
      'CUSTOM_MA', 'CUSTOM_EMA', 'CUSTOM_WMA', 'CUSTOM_AVL', 'CUSTOM_BB', 'CUSTOM_VWAP', 'CUSTOM_TRIX',
      'MA', 'EMA', 'WMA', 'AVL', 'BB', 'VWAP', 'TRIX', 'BOLL'
    ];
    
    overlayPatterns.forEach(pattern => {
      try {
        chart.removeIndicator(pattern);
      } catch (e) {
        // Ignore errors if indicator doesn't exist
      }
    });
    
    console.log('Overlay indicators cleared');
  } catch (error) {
    console.error('Error clearing overlay indicators:', error);
  }
};

// Register Custom MA Indicator that supports multiple periods
export const registerCustomMAIndicator = (maConfigs: MAConfig[]) => {
  const enabledPeriods = maConfigs
    .filter(ma => ma.show)
    .map(ma => ma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const configKey = generateMAKey(maConfigs);
  const uniqueName = `CUSTOM_MA_${configKey}`;
  
  // Always re-register to ensure latest config is used
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

    // Always update the set to track current registration
    registeredIndicators.add(uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom MA indicator:', error);
    return uniqueName;
  }
};

// Register Custom EMA Indicator that supports multiple periods
export const registerCustomEMAIndicator = (emaConfigs: MAConfig[]) => {
  const enabledPeriods = emaConfigs
    .filter(ema => ema.show)
    .map(ema => ema.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const configKey = generateMAKey(emaConfigs);
  const uniqueName = `CUSTOM_EMA_${configKey}`;
  
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
    return uniqueName;
  }
};

// Register Custom WMA Indicator that supports multiple periods
export const registerCustomWMAIndicator = (wmaConfigs: MAConfig[]) => {
  const enabledPeriods = wmaConfigs
    .filter(wma => wma.show)
    .map(wma => wma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const configKey = generateMAKey(wmaConfigs);
  const uniqueName = `CUSTOM_WMA_${configKey}`;
  
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
    return uniqueName;
  }
};

// Register Custom AVL (Average Value Line) Indicator that supports multiple periods
export const registerCustomAVLIndicator = (avlConfigs: AVLConfig[]) => {
  const enabledPeriods = avlConfigs
    .filter(avl => avl.show)
    .map(avl => avl.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const configKey = generateAVLKey(avlConfigs);
  const uniqueName = `CUSTOM_AVL_${configKey}`;
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'AVL',
      calcParams: enabledPeriods,
      figures: enabledPeriods.map((period, index) => ({
        key: `avl${index + 1}`,
        title: `AVL${period}: `,
        type: 'line',
        styles: () => {
          const config = avlConfigs.find(a => a.period === period && a.show);
          return {
            color: config?.color || '#9C27B0',
            size: config?.lineSize || 1.5
          };
        }
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          // Calculate AVL for each period
          calcParams.forEach((period, index) => {
            const key = `avl${index + 1}`;
            if (i >= period - 1) {
              let sum = 0;
              for (let j = 0; j < period; j++) {
                // AVL uses typical price: (high + low + close) / 3
                const typicalPrice = (dataList[i - j].high + dataList[i - j].low + dataList[i - j].close) / 3;
                sum += typicalPrice;
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
    console.error('Error registering custom AVL indicator:', error);
    return uniqueName;
  }
};

// Register Custom Bollinger Bands Indicator
export const registerCustomBBIndicator = (bbConfigs: BBConfig[]) => {
  const enabledConfigs = bbConfigs
    .filter(bb => bb.show)
    .sort((a, b) => a.period - b.period);

  if (enabledConfigs.length === 0) return null;

  const configKey = generateBBKey(bbConfigs);
  const uniqueName = `CUSTOM_BB_${configKey}`;
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'BB',
      calcParams: enabledConfigs.map(bb => [bb.period, bb.stdDev]).flat(),
      figures: enabledConfigs.flatMap((bbConfig, index) => [
        // Upper band - only include if show is true
        ...(bbConfig.upLine.show ? [{
          key: `bb_upper_${index}`,
          title: `BB Upper ${bbConfig.period}: `,
          type: 'line',
          styles: () => ({
            color: bbConfig.upLine.color,
            size: bbConfig.upLine.lineWidth,
          })
        }] : []),
        // Middle band - only include if show is true
        ...(bbConfig.middleLine.show ? [{
          key: `bb_middle_${index}`,
          title: `BB Middle ${bbConfig.period}: `,
          type: 'line',
          styles: () => ({
            color: bbConfig.middleLine.color,
            size: bbConfig.middleLine.lineWidth,
            style: 'dashed',
          })
        }] : []),
        // Lower band - only include if show is true
        ...(bbConfig.downLine.show ? [{
          key: `bb_lower_${index}`,
          title: `BB Lower ${bbConfig.period}: `,
          type: 'line',
          styles: () => ({
            color: bbConfig.downLine.color,
            size: bbConfig.downLine.lineWidth,
          })
        }] : [])
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
    return uniqueName;
  }
};

// Register Custom VWAP Indicator
export const registerCustomVWAPIndicator = (vwapConfigs: VWAPConfig[]) => {
  const enabledConfigs = vwapConfigs.filter(vwap => vwap.show);

  if (enabledConfigs.length === 0) return null;

  try {
    const configKey = generateVWAPKey(vwapConfigs);
    const uniqueName = `CUSTOM_VWAP_${configKey}`;

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
    console.log(`Registered VWAP indicator: ${uniqueName}`);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom VWAP indicator:', error);
    return null;
  }
};

// Register Custom TRIX Indicator
export const registerCustomTRIXIndicator = (trixConfigs: TRIXConfig[]) => {
  const enabledConfigs = trixConfigs.filter(trix => trix.show);

  if (enabledConfigs.length === 0) return null;

  const configKey = generateTRIXKey(trixConfigs);
  const uniqueName = `CUSTOM_TRIX_${configKey}`;
  
  try {
    registerIndicator({
      name: uniqueName,
      shortName: 'TRIX',
      calcParams: enabledConfigs.map(config => config.period),
      figures: enabledConfigs.map((trixConfig, index) => ({
        key: `trix_${index}`,
        title: `TRIX${trixConfig.period}: `,
        type: 'line',
        styles: () => ({
          color: trixConfig.color,
          size: trixConfig.lineSize,
        })
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        if (!dataList || dataList.length === 0) {
          return result;
        }

        // Extract close prices
        const closePrices = dataList.map(data => data.close);
        
        calcParams.forEach((period, configIndex) => {
          const multiplier = 2 / (period + 1);
          
          // Step 1: Calculate first EMA
          const ema1: number[] = [];
          for (let i = 0; i < closePrices.length; i++) {
            if (i === 0) {
              ema1[i] = closePrices[i];
            } else {
              ema1[i] = (closePrices[i] * multiplier) + (ema1[i-1] * (1 - multiplier));
            }
          }
          
          // Step 2: Calculate second EMA (EMA of EMA1)
          const ema2: number[] = [];
          for (let i = 0; i < ema1.length; i++) {
            if (i === 0) {
              ema2[i] = ema1[i];
            } else {
              ema2[i] = (ema1[i] * multiplier) + (ema2[i-1] * (1 - multiplier));
            }
          }
          
          // Step 3: Calculate third EMA (EMA of EMA2)
          const ema3: number[] = [];
          for (let i = 0; i < ema2.length; i++) {
            if (i === 0) {
              ema3[i] = ema2[i];
            } else {
              ema3[i] = (ema2[i] * multiplier) + (ema3[i-1] * (1 - multiplier));
            }
          }
          
          // Step 4: Calculate TRIX as percentage change of triple EMA
          for (let i = 0; i < closePrices.length; i++) {
            if (!result[i]) {
              result[i] = {};
            }
            
            // Need at least 2 points to calculate percentage change
            if (i < 1) {
              result[i][`trix_${configIndex}`] = 0;
            } else {
              // TRIX = ((TripleEMA_t - TripleEMA_t-1) / TripleEMA_t-1) * 100
              const currentEMA3 = ema3[i];
              const prevEMA3 = ema3[i-1];
              
              if (prevEMA3 !== 0) {
                // Multiply by 10000 to get more visible values (show as basis points)
                const trixValue = ((currentEMA3 - prevEMA3) / prevEMA3) * 10000;
                result[i][`trix_${configIndex}`] = trixValue;
              } else {
                result[i][`trix_${configIndex}`] = 0;
              }
              
              // Debug logging for first few values
              if (i < 10 && configIndex === 0) {
                console.log(`TRIX[${i}]: EMA3=${currentEMA3}, prevEMA3=${prevEMA3}, TRIX=${result[i][`trix_${configIndex}`]}`);
              }
            }
          }
        });
        
        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    console.log(`Registered TRIX indicator: ${uniqueName}`);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom TRIX indicator:', error);
    return null;
  }
};

// Register RSI Indicator with unique name
export const registerRSIIndicator = (rsiConfig: RSIConfig) => {
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
export const registerCustomVolumeIndicator = (volumeConfig: VolumeConfig) => {
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
    console.error('Error registering custom Volume indicator:', error);
    return indicatorName;
  }
};