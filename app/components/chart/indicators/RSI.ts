import { registerIndicator } from 'klinecharts';
import { RSIConfig } from '@/context/GlobalContext';

export const registerRSIIndicator = (rsiConfig: RSIConfig): string => {
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
      calc: (dataList: any[]) => {
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