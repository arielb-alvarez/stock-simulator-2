import { registerIndicator } from 'klinecharts';
import { MAConfig } from '@/context/GlobalContext';

// Track registered indicators to avoid duplicates
const registeredIndicators = new Set();

export const registerCustomMAIndicator = (maConfigs: MAConfig[]): string => {
  const enabledPeriods = maConfigs
    .filter(ma => ma.show)
    .map(ma => ma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) {
    console.log('📊 No enabled MA periods, skipping registration');
    return 'CUSTOM_MA';
  }

  // Create unique name based on periods
  const uniqueName = `CUSTOM_MA_${enabledPeriods.join('_')}`;
  
  // Skip if already registered
  if (registeredIndicators.has(uniqueName)) {
    console.log('📊 MA indicator already registered:', uniqueName);
    return uniqueName;
  }

  console.log('📊 Registering MA indicator with periods:', enabledPeriods, 'Name:', uniqueName);

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
      calc: (dataList: any[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
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
    console.log('✅ MA indicator registered successfully:', uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('❌ Error registering custom MA indicator:', error);
    return uniqueName;
  }
};

export const registerCustomEMAIndicator = (emaConfigs: MAConfig[]): string => {
  const enabledPeriods = emaConfigs
    .filter(ema => ema.show)
    .map(ema => ema.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) {
    console.log('📊 No enabled EMA periods, skipping registration');
    return 'CUSTOM_EMA';
  }

  // Create unique name based on periods
  const uniqueName = `CUSTOM_EMA_${enabledPeriods.join('_')}`;
  
  // Skip if already registered
  if (registeredIndicators.has(uniqueName)) {
    console.log('📊 EMA indicator already registered:', uniqueName);
    return uniqueName;
  }

  console.log('📊 Registering EMA indicator with periods:', enabledPeriods, 'Name:', uniqueName);

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
      calc: (dataList: any[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        const multipliers: number[] = calcParams.map(period => 2 / (period + 1));
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          calcParams.forEach((period, index) => {
            const key = `ema${index + 1}`;
            if (i === 0) {
              item[key] = dataList[i].close;
            } else if (i < period - 1) {
              let sum = 0;
              for (let j = 0; j <= i; j++) {
                sum += dataList[j].close;
              }
              item[key] = sum / (i + 1);
            } else {
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
    console.log('✅ EMA indicator registered successfully:', uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('❌ Error registering custom EMA indicator:', error);
    return uniqueName;
  }
};

export const registerCustomWMAIndicator = (wmaConfigs: MAConfig[]): string => {
  const enabledPeriods = wmaConfigs
    .filter(wma => wma.show)
    .map(wma => wma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) {
    console.log('📊 No enabled WMA periods, skipping registration');
    return 'CUSTOM_WMA';
  }

  // Create unique name based on periods
  const uniqueName = `CUSTOM_WMA_${enabledPeriods.join('_')}`;
  
  // Skip if already registered
  if (registeredIndicators.has(uniqueName)) {
    console.log('📊 WMA indicator already registered:', uniqueName);
    return uniqueName;
  }

  console.log('📊 Registering WMA indicator with periods:', enabledPeriods, 'Name:', uniqueName);

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
      calc: (dataList: any[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const item: any = {};
          
          calcParams.forEach((period, index) => {
            const key = `wma${index + 1}`;
            if (i >= period - 1) {
              let weightSum = 0;
              let weightedSum = 0;
              
              for (let j = 0; j < period; j++) {
                const weight = period - j;
                weightSum += weight;
                weightedSum += dataList[i - j].close * weight;
              }
              
              item[key] = weightedSum / weightSum;
            } else {
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
    console.log('✅ WMA indicator registered successfully:', uniqueName);
    return uniqueName;
  } catch (error) {
    console.error('❌ Error registering custom WMA indicator:', error);
    return uniqueName;
  }
};

// Helper function to get current indicator names based on config
export const getCurrentIndicatorNames = (maConfigs: MAConfig[], emaConfigs: MAConfig[], wmaConfigs: MAConfig[]) => {
  const maPeriods = maConfigs.filter(ma => ma.show).map(ma => ma.period).sort((a, b) => a - b);
  const emaPeriods = emaConfigs.filter(ema => ema.show).map(ema => ema.period).sort((a, b) => a - b);
  const wmaPeriods = wmaConfigs.filter(wma => wma.show).map(wma => wma.period).sort((a, b) => a - b);

  return {
    ma: maPeriods.length > 0 ? `CUSTOM_MA_${maPeriods.join('_')}` : null,
    ema: emaPeriods.length > 0 ? `CUSTOM_EMA_${emaPeriods.join('_')}` : null,
    wma: wmaPeriods.length > 0 ? `CUSTOM_WMA_${wmaPeriods.join('_')}` : null,
  };
};

// Clean up function to remove specific indicators
export const cleanupIndicator = (indicatorName: string) => {
  registeredIndicators.delete(indicatorName);
};