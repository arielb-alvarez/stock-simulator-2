import { registerIndicator } from 'klinecharts';
import { VolumeConfig } from '@/context/GlobalContext';

export const registerCustomVolumeIndicator = (volumeConfig: VolumeConfig): string => {
  const indicatorName = `CUSTOM_VOLUME_${volumeConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  try {
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
      calc: (dataList: any[], { calcParams }: { calcParams: number[] }) => {
        const result: any[] = [];
        
        for (let i = 0; i < dataList.length; i++) {
          const currentData = dataList[i];
          const volume = currentData.volume || 0;
          
          const isUp = currentData.close >= currentData.open;
          
          const volumeItem: any = { 
            volume,
            isUp
          };

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