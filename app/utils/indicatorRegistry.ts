// utils/indicatorRegistry.ts
import { registerIndicator, KLineData } from 'klinecharts';
import { RSIConfig, MFIConfig, VolumeConfig, MAConfig, BBConfig, VWAPConfig, AVLConfig, SARConfig, TRIXConfig, SupertrendConfig } from '@/context/GlobalContext';

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

// Generate a unique key for SAR configurations
export const generateSARKey = (sarConfigs: SARConfig[]): string => {
  return sarConfigs
    .filter(sar => sar.show)
    .map(sar => `${sar.start}_${sar.maximum}_${sar.color}`)
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

// Add helper function to generate SuperTrend key
export const generateSupertrendKey = (supertrendConfigs: SupertrendConfig[]): string => {
  return supertrendConfigs
    .filter(st => st.show)
    .map(st => `${st.atrLength}_${st.factor}_${st.upTrend.lineColor}_${st.downTrend.lineColor}_${st.upTrend.background.show ? 'upbg' : 'noupbg'}_${st.downTrend.background.show ? 'dnbg' : 'nodnbg'}`)
    .sort()
    .join('_');
};

// Clear all overlay indicators from chart
export const clearOverlayIndicators = (chart: any) => {
  if (!chart) return;
  
  try {
    console.log('Clearing overlay indicators...');
    
    // Remove all possible overlay indicators by their base names and patterns
    const overlayPatterns = [
      'CUSTOM_MA', 'CUSTOM_EMA', 'CUSTOM_WMA', 'CUSTOM_AVL', 'CUSTOM_BB', 'CUSTOM_VWAP', 'CUSTOM_TRIX', 'CUSTOM_SUPERTREND',
      'MA', 'EMA', 'WMA', 'AVL', 'BB', 'VWAP', 'TRIX', 'BOLL', 'SUPERTREND'
    ];
    
    // Try to remove indicators by common names
    overlayPatterns.forEach(pattern => {
      try {
        chart.removeIndicator(pattern);
      } catch (e) {
        // Ignore errors if indicator doesn't exist
      }
    });
    
    // Also try to remove indicators that might have been created with dynamic names
    const knownIndicators = [
      'candle_pane', 'main_pane', 'overlay_1', 'overlay_2', 'overlay_3'
    ];
    
    knownIndicators.forEach(indicatorId => {
      try {
        chart.removeIndicator(indicatorId);
      } catch (e) {
        // Ignore removal errors
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

// Register Custom SAR Indicator
export const registerCustomSARIndicator = (sarConfigs: SARConfig[]) => {
  const enabledConfigs = sarConfigs.filter(sar => sar.show);

  if (enabledConfigs.length === 0) return null;

  const configKey = generateSARKey(sarConfigs);
  const uniqueName = `CUSTOM_SAR_${configKey}`;
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'SAR',
      calcParams: enabledConfigs.map(config => [config.start, config.maximum]).flat(),
      figures: enabledConfigs.map((sarConfig, index) => ({
        key: `sar${index}`,
        title: `SAR (${sarConfig.start}, ${sarConfig.maximum}): `,
        type: 'circle',
        styles: () => ({
          color: sarConfig.color,
          size: 4, // Size of the SAR dots
        })
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        if (!dataList || dataList.length === 0) {
          return result;
        }

        // Group params by config (each config has start and maximum)
        const configs: { start: number, maximum: number }[] = [];
        for (let i = 0; i < calcParams.length; i += 2) {
          configs.push({
            start: calcParams[i],
            maximum: calcParams[i + 1]
          });
        }

        // Initialize SAR calculation for each config
        configs.forEach((config, configIndex) => {
          const { start, maximum } = config;
          
          // Variables for SAR calculation
          let sar: number | null = null;
          let ep: number = 0; // Extreme point
          let af: number = start; // Acceleration factor
          let isUpTrend: boolean | null = null;
          
          for (let i = 0; i < dataList.length; i++) {
            const currentData = dataList[i];
            
            // Initialize result array if needed
            if (i >= result.length) {
              result.push({});
            }
            
            const key = `sar${configIndex}`;
            
            // First calculation
            if (i === 0) {
              // Start with no SAR value
              result[i][key] = null;
              continue;
            }
            
            const previousData = dataList[i - 1];
            
            // Determine initial trend on second candle
            if (i === 1) {
              if (currentData.close > previousData.close) {
                isUpTrend = true;
                sar = previousData.low; // Start SAR at previous low
                ep = currentData.high; // Extreme point is current high
              } else {
                isUpTrend = false;
                sar = previousData.high; // Start SAR at previous high
                ep = currentData.low; // Extreme point is current low
              }
              result[i][key] = sar;
              continue;
            }
            
            // Calculate SAR for current candle
            if (isUpTrend) {
              // Uptrend SAR calculation
              sar = (sar as number) + af * (ep - (sar as number));
              
              // Check if we need to reverse trend
              if (currentData.low <= sar) {
                // Reverse to downtrend
                isUpTrend = false;
                sar = ep; // Start SAR at the extreme point
                ep = currentData.low;
                af = start; // Reset acceleration factor
              } else {
                // Continue uptrend
                // Update extreme point if current high is higher
                if (currentData.high > ep) {
                  ep = currentData.high;
                  // Increase acceleration factor
                  af = Math.min(af + start, maximum);
                }
                
                // SAR should not be above the previous two lows
                if (i >= 2) {
                  const prevLow1 = dataList[i - 1].low;
                  const prevLow2 = dataList[i - 2].low;
                  sar = Math.min(sar as number, prevLow1, prevLow2);
                }
              }
            } else {
              // Downtrend SAR calculation
              sar = (sar as number) + af * (ep - (sar as number));
              
              // Check if we need to reverse trend
              if (currentData.high >= sar) {
                // Reverse to uptrend
                isUpTrend = true;
                sar = ep; // Start SAR at the extreme point
                ep = currentData.high;
                af = start; // Reset acceleration factor
              } else {
                // Continue downtrend
                // Update extreme point if current low is lower
                if (currentData.low < ep) {
                  ep = currentData.low;
                  // Increase acceleration factor
                  af = Math.min(af + start, maximum);
                }
                
                // SAR should not be below the previous two highs
                if (i >= 2) {
                  const prevHigh1 = dataList[i - 1].high;
                  const prevHigh2 = dataList[i - 2].high;
                  sar = Math.max(sar as number, prevHigh1, prevHigh2);
                }
              }
            }
            
            // Final SAR adjustment
            if (isUpTrend) {
              // SAR should not be above the previous low
              sar = Math.min(sar as number, previousData.low);
            } else {
              // SAR should not be below the previous high
              sar = Math.max(sar as number, previousData.high);
            }
            
            result[i][key] = sar;
          }
        });

        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    console.log(`Registered SAR indicator: ${uniqueName}`);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom SAR indicator:', error);
    return null;
  }
};

// Register Custom TRIX Indicator
export const registerCustomTRIXIndicator = (trixConfigs: TRIXConfig[]) => {
  const enabledPeriods = trixConfigs
    .filter(trix => trix.show)
    .map(trix => trix.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return null;

  const configKey = generateTRIXKey(trixConfigs);
  const uniqueName = `CUSTOM_TRIX_${configKey}`;
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'TRIX',
      calcParams: enabledPeriods,
      figures: enabledPeriods.map((period, index) => ({
        key: `trix${index + 1}`,
        title: `TRIX ${period}: `,
        type: 'line',
        styles: () => {
          const config = trixConfigs.find(t => t.period === period && t.show);
          return {
            color: config?.color || '#4A90E2',
            size: config?.lineSize || 1.5
          };
        }
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        if (!dataList || dataList.length === 0) {
          return result;
        }

        // Initialize arrays for each period
        calcParams.forEach((period, configIndex) => {
          const key = `trix${configIndex + 1}`;
          
          // Initialize EMA arrays for this period
          let ema1: number | null = null;
          let ema2: number | null = null;
          let ema3: number | null = null;
          
          // Smoothing factor
          const k = 2 / (period + 1);
          
          for (let i = 0; i < dataList.length; i++) {
            if (!result[i]) {
              result[i] = {};
            }
            
            const closePrice = dataList[i].close;
            
            // Calculate first EMA
            if (i === 0) {
              ema1 = closePrice;
            } else {
              ema1 = (closePrice * k) + (ema1! * (1 - k));
            }
            
            // Calculate second EMA (only after we have at least 'period' data points for stability)
            if (i < period) {
              // For initial periods, use the first EMA value
              ema2 = ema1;
            } else {
              ema2 = (ema1! * k) + (ema2! * (1 - k));
            }
            
            // Calculate third EMA (TRIX line)
            if (i < period * 2) {
              // For initial periods, use the second EMA value
              ema3 = ema2;
            } else {
              ema3 = (ema2! * k) + (ema3! * (1 - k));
            }
            
            // Store the TRIX value (which is the triple EMA)
            result[i][key] = ema3;
          }
        });
        
        return result;
      },
      shouldOhlc: true, // TRIX is an overlay on the price chart
      shouldFormatBigNumber: true,
    });

    registeredIndicators.add(uniqueName);
    console.log(`Registered TRIX indicator: ${uniqueName} with periods:`, enabledPeriods);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom TRIX indicator:', error);
    return null;
  }
};

// Add registerCustomSupertrendIndicator function
export const registerCustomSupertrendIndicator = (supertrendConfigs: SupertrendConfig[]) => {
  const enabledConfigs = supertrendConfigs.filter(st => st.show);

  if (enabledConfigs.length === 0) return null;

  const configKey = generateSupertrendKey(supertrendConfigs);
  const uniqueName = `CUSTOM_SUPERTREND_${configKey}`;
  
  try {    
    registerIndicator({
      name: uniqueName,
      shortName: 'SUPERTREND',
      calcParams: enabledConfigs.map(config => [config.atrLength, config.factor]).flat(),
      figures: enabledConfigs.flatMap((stConfig, index) => [
        // Up trend line
        {
          key: `st_up_${index}`,
          title: `Supertrend Up (${stConfig.atrLength}, ${stConfig.factor}): `,
          type: 'line',
          styles: () => ({
            color: stConfig.upTrend.lineColor,
            size: stConfig.upTrend.lineWidth,
          })
        },
        // Down trend line
        {
          key: `st_down_${index}`,
          title: `Supertrend Down (${stConfig.atrLength}, ${stConfig.factor}): `,
          type: 'line',
          styles: () => ({
            color: stConfig.downTrend.lineColor,
            size: stConfig.downTrend.lineWidth,
          })
        }
      ]),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        if (!dataList || dataList.length === 0) {
          return result;
        }

        // Group params by config (each config has atrLength and factor)
        const configs: { atrLength: number, factor: number }[] = [];
        for (let i = 0; i < calcParams.length; i += 2) {
          configs.push({
            atrLength: calcParams[i],
            factor: calcParams[i + 1]
          });
        }

        // Calculate for each SuperTrend configuration
        configs.forEach((config, configIndex) => {
          const { atrLength, factor } = config;
          const upKey = `st_up_${configIndex}`;
          const downKey = `st_down_${configIndex}`;
          
          // Initialize result array with undefined values
          for (let i = 0; i < dataList.length; i++) {
            result[i] = result[i] || {};
            result[i][upKey] = undefined;  // Use undefined instead of null
            result[i][downKey] = undefined; // Use undefined instead of null
          }
          
          // Don't calculate if not enough data
          if (dataList.length < atrLength) {
            return;
          }
          
          // Calculate True Range
          const tr: number[] = new Array(dataList.length).fill(0);
          for (let i = 0; i < dataList.length; i++) {
            if (i === 0) {
              tr[i] = dataList[i].high - dataList[i].low;
            } else {
              const hl = dataList[i].high - dataList[i].low;
              const hc = Math.abs(dataList[i].high - dataList[i - 1].close);
              const lc = Math.abs(dataList[i].low - dataList[i - 1].close);
              tr[i] = Math.max(hl, hc, lc);
            }
          }
          
          // Calculate ATR (simple moving average of TR)
          const atr: number[] = new Array(dataList.length).fill(0);
          for (let i = atrLength - 1; i < dataList.length; i++) {
            let sum = 0;
            for (let j = 0; j < atrLength; j++) {
              sum += tr[i - j];
            }
            atr[i] = sum / atrLength;
          }
          
          // Calculate HL/2 (typical price for bands)
          const hl2: number[] = new Array(dataList.length).fill(0);
          for (let i = 0; i < dataList.length; i++) {
            hl2[i] = (dataList[i].high + dataList[i].low) / 2;
          }
          
          // Calculate basic upper and lower bands
          const basicUpper: number[] = new Array(dataList.length).fill(0);
          const basicLower: number[] = new Array(dataList.length).fill(0);
          for (let i = atrLength - 1; i < dataList.length; i++) {
            basicUpper[i] = hl2[i] + (factor * atr[i]);
            basicLower[i] = hl2[i] - (factor * atr[i]);
          }
          
          // Calculate final upper and lower bands with SuperTrend logic
          const finalUpper: number[] = new Array(dataList.length).fill(0);
          const finalLower: number[] = new Array(dataList.length).fill(0);
          const supertrend: number[] = new Array(dataList.length).fill(0);
          const trend: number[] = new Array(dataList.length).fill(0); // 1 for uptrend, -1 for downtrend
          
          // Initialize
          finalUpper[atrLength - 1] = basicUpper[atrLength - 1];
          finalLower[atrLength - 1] = basicLower[atrLength - 1];
          
          // Determine initial trend
          if (dataList[atrLength - 1].close > finalUpper[atrLength - 1]) {
            trend[atrLength - 1] = 1;
            supertrend[atrLength - 1] = finalLower[atrLength - 1];
          } else {
            trend[atrLength - 1] = -1;
            supertrend[atrLength - 1] = finalUpper[atrLength - 1];
          }
          
          // Calculate for remaining candles
          for (let i = atrLength; i < dataList.length; i++) {
            // Adjust bands based on previous trend
            if (trend[i - 1] === 1) {
              finalUpper[i] = basicUpper[i];
              finalLower[i] = Math.max(basicLower[i], finalLower[i - 1]);
            } else {
              finalUpper[i] = Math.min(basicUpper[i], finalUpper[i - 1]);
              finalLower[i] = basicLower[i];
            }
            
            // Determine current trend
            if (dataList[i].close > finalUpper[i]) {
              trend[i] = 1;
              supertrend[i] = finalLower[i];
            } else if (dataList[i].close < finalLower[i]) {
              trend[i] = -1;
              supertrend[i] = finalUpper[i];
            } else {
              trend[i] = trend[i - 1];
              supertrend[i] = trend[i] === 1 ? finalLower[i] : finalUpper[i];
            }
          }
          
          // Set values - SIMPLE APPROACH: Only set the active trend line
          // Leave the inactive line as undefined (not set at all)
          for (let i = atrLength - 1; i < dataList.length; i++) {
            if (trend[i] === 1) {
              // Uptrend: only set upKey, leave downKey as undefined
              result[i][upKey] = supertrend[i];
              // downKey is already undefined
            } else if (trend[i] === -1) {
              // Downtrend: only set downKey, leave upKey as undefined
              result[i][downKey] = supertrend[i];
              // upKey is already undefined
            }
            // For trend[i] === 0 (initial), both remain undefined
          }
          
          // IMPORTANT: No post-processing needed
          // The lines will break naturally because:
          // 1. We're using undefined (not null or 0)
          // 2. When trend changes, the old line ends (last value set)
          // 3. New line starts fresh with its first value
          // 4. Since they're different keys, klinecharts won't connect them
        });

        return result;
      },
    });

    registeredIndicators.add(uniqueName);
    console.log(`Registered SuperTrend indicator: ${uniqueName}`);
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom SuperTrend indicator:', error);
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

// Register MFI Indicator with unique name
export const registerMFIIndicator = (mfiConfig: MFIConfig) => {
  const indicatorName = `MFI_${mfiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  try {
    registerIndicator({
      name: indicatorName,
      shortName: `MFI${mfiConfig.period}`,
      calcParams: [mfiConfig.period],
      figures: [
        { 
          key: 'mfi', 
          title: `MFI${mfiConfig.period}: `, 
          type: 'line',
          styles: (mfiData: any) => {
            const currentMFI = mfiData.mfi;
            if (currentMFI > mfiConfig.overbought) {
              return { 
                color: mfiConfig.overboughtLineColor,
                size: mfiConfig.lineSize 
              };
            } else if (currentMFI < mfiConfig.oversold) {
              return { 
                color: mfiConfig.oversoldLineColor,
                size: mfiConfig.lineSize 
              };
            }
            return { 
              color: mfiConfig.lineColor,
              size: mfiConfig.lineSize 
            };
          }
        }
      ],
      calc: (dataList: KLineData[]) => {
        const result: any[] = [];
        const period = mfiConfig.period;
        
        // Array to store typical prices and raw money flow
        const typicalPrices: number[] = [];
        const moneyFlows: number[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          // Calculate typical price: (high + low + close) / 3
          const typicalPrice = (dataList[i].high + dataList[i].low + dataList[i].close) / 3;
          typicalPrices.push(typicalPrice);
          
          // Calculate raw money flow: typical price * volume
          const moneyFlow = typicalPrice * (dataList[i].volume || 0);
          moneyFlows.push(moneyFlow);
          
          if (i < period) {
            // Not enough data for MFI calculation
            result.push({ mfi: 50 }); // Default to neutral 50
            continue;
          }
          
          // Calculate positive and negative money flow
          let positiveMF = 0;
          let negativeMF = 0;
          
          for (let j = i - period + 1; j <= i; j++) {
            if (typicalPrices[j] > typicalPrices[j - 1]) {
              positiveMF += moneyFlows[j];
            } else if (typicalPrices[j] < typicalPrices[j - 1]) {
              negativeMF += moneyFlows[j];
            }
            // If typical price is unchanged, no money flow is added
          }
          
          if (negativeMF === 0) {
            // Avoid division by zero
            result.push({ mfi: 100 });
          } else {
            const moneyRatio = positiveMF / negativeMF;
            const mfi = 100 - (100 / (1 + moneyRatio));
            result.push({ mfi: Math.max(0, Math.min(100, mfi)) });
          }
        }
        
        return result;
      },
    });

    return indicatorName;
  } catch (error) {
    console.error('Error registering MFI indicator:', error);
    return indicatorName;
  }
};

export const registerMultiPeriodRSIIndicator = (rsiConfigs: RSIConfig[]) => {
  const enabledConfigs = rsiConfigs.filter(rsi => rsi.show);
  
  if (enabledConfigs.length === 0) return null;

  // Sort by period to ensure consistent ordering
  enabledConfigs.sort((a, b) => a.period - b.period);
  
  const configKey = enabledConfigs.map(c => `${c.period}_${c.lineColor}_${c.lineSize}`).join('_');
  const uniqueName = `MULTI_RSI_${configKey}`;
  
  try {
    registerIndicator({
      name: uniqueName,
      shortName: 'RSI',
      calcParams: enabledConfigs.map(c => c.period),
      figures: enabledConfigs.map((config, index) => ({
        key: `rsi${index + 1}`,
        title: `RSI${config.period}: `,
        type: 'line',
        styles: () => ({
          color: config.lineColor,
          size: config.lineSize,
        })
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          // Calculate RSI for each period
          calcParams.forEach((period, index) => {
            const key = `rsi${index + 1}`;
            
            if (i < period) {
              item[key] = 50; // Not enough data, default to neutral
              return;
            }
            
            let gains = 0;
            let losses = 0;
            
            // Calculate gains and losses for the period
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
              item[key] = 100;
            } else {
              const rs = avgGain / avgLoss;
              const rsi = 100 - (100 / (1 + rs));
              item[key] = Math.max(0, Math.min(100, rsi));
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    return uniqueName;
  } catch (error) {
    console.error('Error registering multi-period RSI indicator:', error);
    return uniqueName;
  }
};

export const registerMultiPeriodMFIIndicator = (mfiConfigs: MFIConfig[]) => {
  const enabledConfigs = mfiConfigs.filter(mfi => mfi.show);
  
  if (enabledConfigs.length === 0) return null;

  // Sort by period to ensure consistent ordering
  enabledConfigs.sort((a, b) => a.period - b.period);
  
  const configKey = enabledConfigs.map(c => `${c.period}_${c.lineColor}_${c.lineSize}`).join('_');
  const uniqueName = `MULTI_MFI_${configKey}`;
  
  try {
    registerIndicator({
      name: uniqueName,
      shortName: 'MFI',
      calcParams: enabledConfigs.map(c => c.period),
      figures: enabledConfigs.map((config, index) => ({
        key: `mfi${index + 1}`,
        title: `MFI${config.period}: `,
        type: 'line',
        styles: (mfiData: any) => {
          const currentMFI = mfiData[`mfi${index + 1}`];
          if (currentMFI > config.overbought) {
            return { 
              color: config.overboughtLineColor,
              size: config.lineSize 
            };
          } else if (currentMFI < config.oversold) {
            return { 
              color: config.oversoldLineColor,
              size: config.lineSize 
            };
          }
          return { 
            color: config.lineColor,
            size: config.lineSize 
          };
        }
      })),
      calc: (dataList: KLineData[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          // Calculate MFI for each period
          calcParams.forEach((period, index) => {
            const key = `mfi${index + 1}`;
            
            if (i < period) {
              item[key] = 50; // Not enough data, default to neutral
              return;
            }
            
            // Arrays to store typical prices and raw money flow for this calculation
            const typicalPrices: number[] = [];
            const moneyFlows: number[] = [];
            
            // Calculate for the required period
            for (let j = i - period; j <= i; j++) {
              // Calculate typical price: (high + low + close) / 3
              const typicalPrice = (dataList[j].high + dataList[j].low + dataList[j].close) / 3;
              typicalPrices.push(typicalPrice);
              
              // Calculate raw money flow: typical price * volume
              const moneyFlow = typicalPrice * (dataList[j].volume || 0);
              moneyFlows.push(moneyFlow);
            }
            
            // Calculate positive and negative money flow
            let positiveMF = 0;
            let negativeMF = 0;
            
            for (let j = 1; j <= period; j++) {
              const idx = typicalPrices.length - j;
              const prevIdx = idx - 1;
              
              if (typicalPrices[idx] > typicalPrices[prevIdx]) {
                positiveMF += moneyFlows[idx];
              } else if (typicalPrices[idx] < typicalPrices[prevIdx]) {
                negativeMF += moneyFlows[idx];
              }
              // If typical price is unchanged, no money flow is added
            }
            
            if (negativeMF === 0) {
              // Avoid division by zero
              item[key] = 100;
            } else {
              const moneyRatio = positiveMF / negativeMF;
              const mfi = 100 - (100 / (1 + moneyRatio));
              item[key] = Math.max(0, Math.min(100, mfi));
            }
          });
          
          result.push(item);
        }
        
        return result;
      },
    });

    return uniqueName;
  } catch (error) {
    console.error('Error registering multi-period MFI indicator:', error);
    return uniqueName;
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