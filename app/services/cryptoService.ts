// services/cryptoService.ts
export interface CryptoData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isFinal?: boolean;
}

export interface ChartData {
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export class CryptoDataService {
  private baseUrl = 'https://api.binance.com/api/v3';

  async getHistoricalData(
    symbol: string = 'BTCUSDT',
    interval: string = '15m',
    limit: number = 1000
  ): Promise<CryptoData[]> {
    try {
      console.log(`Fetching data from: ${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
      
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from API');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = data.map((kline: any[]): CryptoData => ({
        time: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
        isFinal: true,
      }));

      console.log(`Successfully fetched ${result.length} data points`);
      return result;

    } catch (error) {
      console.error('Error fetching crypto data:', error);
      throw error;
    }
  }

  // Convert to KLineCharts format
  convertToKLineData(candlestickData: CryptoData[]): ChartData[] {
    return candlestickData.map(item => ({
      timestamp: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  }

  // Enhanced real-time WebSocket data with better error handling
  subscribeToRealTimeData(
    symbol: string,
    interval: string,
    callback: (data: CryptoData) => void
  ): WebSocket {
    const wsSymbol = symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${wsSymbol}@kline_${interval}`;
    
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`WebSocket connected for ${symbol}@${interval}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (!data.k) {
          console.warn('Unexpected WebSocket message format:', data);
          return;
        }
        
        const kline = data.k;
        
        const cryptoData: CryptoData = {
          time: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
          isFinal: kline.x, // Whether this candle is final
        };
        
        callback(cryptoData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    return ws;
  }

  // Method to update single data point
  updateDataPoint(
    existingData: CryptoData[],
    newData: CryptoData,
    maxPoints: number = 200
  ): CryptoData[] {
    const data = [...existingData];
    
    if (newData.isFinal) {
      // If the candle is final, add it as a new candle
      data.push(newData);
      
      // Remove oldest data if we exceed max points
      if (data.length > maxPoints) {
        data.shift();
      }
    } else {
      // If the candle is not final, update the last candle
      const lastIndex = data.length - 1;
      if (lastIndex >= 0 && data[lastIndex].time === newData.time) {
        // Update existing candle
        data[lastIndex] = newData;
      } else {
        // Add as new candle if timestamp doesn't match
        data.push(newData);
      }
    }
    
    return data;
  }
}

export const cryptoService = new CryptoDataService();