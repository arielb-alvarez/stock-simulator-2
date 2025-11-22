import { registerIndicator } from 'klinecharts';
import { MAConfig } from '@/context/GlobalContext';

// Fixed indicator names
const FIXED_INDICATOR_NAMES = {
  MA: 'CUSTOM_MA',
  EMA: 'CUSTOM_EMA', 
  WMA: 'CUSTOM_WMA'
};

export const registerCustomMAIndicator = (maConfigs: MAConfig[]): string => {
  const enabledPeriods = maConfigs
    .filter(ma => ma.show)
    .map(ma => ma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) {
    console.log('📊 No enabled MA periods, skipping registration');
    return FIXED_INDICATOR_NAMES.MA;
  }

  console.log('📊 Registering MA indicator with periods:', enabledPeriods);

  try {
    registerIndicator({
      name: FIXED_INDICATOR_NAMES.MA,
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

    console.log('✅ MA indicator registered successfully');
    return FIXED_INDICATOR_NAMES.MA;
  } catch (error) {
    console.error('❌ Error registering custom MA indicator:', error);
    return FIXED_INDICATOR_NAMES.MA;
  }
};

export const registerCustomEMAIndicator = (emaConfigs: MAConfig[]): string => {
  const enabledPeriods = emaConfigs
    .filter(ema => ema.show)
    .map(ema => ema.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) {
    console.log('📊 No enabled EMA periods, skipping registration');
    return FIXED_INDICATOR_NAMES.EMA;
  }

  console.log('📊 Registering EMA indicator with periods:', enabledPeriods);

  try {
    registerIndicator({
      name: FIXED_INDICATOR_NAMES.EMA,
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

    console.log('✅ EMA indicator registered successfully');
    return FIXED_INDICATOR_NAMES.EMA;
  } catch (error) {
    console.error('❌ Error registering custom EMA indicator:', error);
    return FIXED_INDICATOR_NAMES.EMA;
  }
};

export const registerCustomWMAIndicator = (wmaConfigs: MAConfig[]): string => {
  const enabledPeriods = wmaConfigs
    .filter(wma => wma.show)
    .map(wma => wma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) {
    console.log('📊 No enabled WMA periods, skipping registration');
    return FIXED_INDICATOR_NAMES.WMA;
  }

  console.log('📊 Registering WMA indicator with periods:', enabledPeriods);

  try {
    registerIndicator({
      name: FIXED_INDICATOR_NAMES.WMA,
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

    console.log('✅ WMA indicator registered successfully');
    return FIXED_INDICATOR_NAMES.WMA;
  } catch (error) {
    console.error('❌ Error registering custom WMA indicator:', error);
    return FIXED_INDICATOR_NAMES.WMA;
  }
};

export const getCurrentIndicatorNames = () => {
  return {
    ma: FIXED_INDICATOR_NAMES.MA,
    ema: FIXED_INDICATOR_NAMES.EMA,
    wma: FIXED_INDICATOR_NAMES.WMA,
  };
};