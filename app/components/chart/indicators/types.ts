import { MAConfig, RSIConfig, VolumeConfig } from '@/context/GlobalContext';

export interface IndicatorRegistration {
  name: string;
  shortName: string;
  calcParams: number[];
  figures: any[];
  calc: (dataList: any[], options: any) => any[];
}

export interface MovingAverageConfigs {
  ma: MAConfig[];
  ema: MAConfig[];
  wma: MAConfig[];
}