import { registerIndicator } from 'klinecharts';
import { MAConfig } from '@/context/GlobalContext';

const registeredIndicators = new Set();

export const registerCustomMAIndicator = (maConfigs: MAConfig[]): string => {
  const enabledPeriods = maConfigs
    .filter(ma => ma.show)
    .map(ma => ma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return 'CUSTOM_MA';

  const uniqueName = `CUSTOM_MA_${enabledPeriods.join('_')}`;
  
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
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom MA indicator:', error);
    return 'CUSTOM_MA';
  }
};

export const registerCustomEMAIndicator = (emaConfigs: MAConfig[]): string => {
  const enabledPeriods = emaConfigs
    .filter(ema => ema.show)
    .map(ema => ema.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return 'CUSTOM_EMA';

  const uniqueName = `CUSTOM_EMA_${enabledPeriods.join('_')}`;
  
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
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom EMA indicator:', error);
    return 'CUSTOM_EMA';
  }
};

export const registerCustomWMAIndicator = (wmaConfigs: MAConfig[]): string => {
  const enabledPeriods = wmaConfigs
    .filter(wma => wma.show)
    .map(wma => wma.period)
    .sort((a, b) => a - b);

  if (enabledPeriods.length === 0) return 'CUSTOM_WMA';

  const uniqueName = `CUSTOM_WMA_${enabledPeriods.join('_')}`;
  
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
    return uniqueName;
  } catch (error) {
    console.error('Error registering custom WMA indicator:', error);
    return 'CUSTOM_WMA';
  }
};

export const getCurrentIndicatorNames = (
  maConfigs: MAConfig[], 
  emaConfigs: MAConfig[], 
  wmaConfigs: MAConfig[]
) => {
  const maPeriods = maConfigs.filter(ma => ma.show).map(ma => ma.period).sort((a, b) => a - b);
  const emaPeriods = emaConfigs.filter(ema => ema.show).map(ema => ema.period).sort((a, b) => a - b);
  const wmaPeriods = wmaConfigs.filter(wma => wma.show).map(wma => wma.period).sort((a, b) => a - b);

  return {
    ma: maPeriods.length > 0 ? `CUSTOM_MA_${maPeriods.join('_')}` : null,
    ema: emaPeriods.length > 0 ? `CUSTOM_EMA_${emaPeriods.join('_')}` : null,
    wma: wmaPeriods.length > 0 ? `CUSTOM_WMA_${wmaPeriods.join('_')}` : null,
  };
};