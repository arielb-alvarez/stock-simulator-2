// context/chartConfigUtils.ts
import { ChartType, ChartStyleConfig } from './types';

export const getChartTypeConfig = (chartType: ChartType): ChartStyleConfig['candle'] => {
  switch (chartType) {
    case 'line':
      return {
        type: 'line',
        line: {
          color: '#f0b90b',
          size: 2,
        },
        area: {
          show: false,
          color: 'rgba(41, 98, 255, 0.1)'
        },
      };
    case 'area':
      return {
        type: 'area',
        line: {
          color: '#f0b90b',
          size: 2,
        },
        area: {
          show: true,
          color: [
            'rgba(240, 185, 11, 0.4)',
            'rgba(240, 185, 11, 0.05)'
          ],
        },
      };
    case 'bar':
      return {
        type: 'ohlc',
        bar: {
          upColor: '#00b15d',
          downColor: '#ff5b5a',
        },
      };
    case 'candle':
    default:
      return {
        type: 'candle_solid',
        bar: {
          upColor: '#00b15d',
          downColor: '#ff5b5a',
        },
      };
  }
};