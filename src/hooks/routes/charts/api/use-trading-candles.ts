// hooks/routes/charts/api/use-trading-candles.ts
import LOCAL_SERVICES from "@/constant/constant.local.service";
import { ECandlesExchange, ECandlesInterval } from "@/enum/services/dev-coin-user/enum.candles";
import { TDataTradingCandles, TParamsTradingCandles } from "@/types/services/dev-coin-user/types.candles";
import { useEffect, useRef, useState } from "react";
import useWebsocketsTradingCandles from "../websockets/use-websockets-trading-candles";

const WS_INTERVAL: number = 2000;

const useTradingCandles = ({ symbol }: Pick<TParamsTradingCandles, "symbol">) => {

  const WS_REF = useRef<WebSocket | null>(null);
  const wsQueueRef = useRef<TDataTradingCandles[]>([]);
  const [params, setParams] = useState<Omit<TParamsTradingCandles, "symbol">>({
    interval: ECandlesInterval.ONE_MINUTE,
    exchange: ECandlesExchange.KUCOIN,
    startTime: undefined,
    endTime: undefined,
    limit: 100
  })


  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TDataTradingCandles[]>([]);

  const getTradingCandles = async () => {
    setLoading(true);
    try {
      const response = await LOCAL_SERVICES.localCandleService.localGetCandleSymbol({ symbol, ...params });
      if (!response?.success) throw new Error();
      setData(response?.data)
    }
    catch (error) {
      console.error(error);
      return;
    }
    finally {
      setLoading(false);
    }
  }

  const {
    WS_CONNECT
  } = useWebsocketsTradingCandles({
    parameters: {
      symbol,
      interval: params.interval
    },
    wsRef: WS_REF,
    wsQueueRef
  })

  useEffect(() => {
    if (!symbol) return;
    getTradingCandles();
  }, [params]);

  useEffect(() => {
    if (!symbol) return;
    WS_CONNECT();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if(wsQueueRef.current.length === 0) return;
      const message = wsQueueRef.current.shift();
      if(!message) return;

      
      setData(prev => {
        if (prev.length === 0) return [message];
        
        const updated = [...prev];
        updated[updated.length - 1] = message;
        return [...prev, message];
      });
    }, WS_INTERVAL)

    return () => clearInterval(interval);
  }, []);
  return {
    data,
    setParams,
    loading
  }
}

export default useTradingCandles;

// Helper function to generate realistic mock data
const generateRealisticCandles = (
  basePrice: number = 50000,
  candleCount: number = 100,
  intervalMs: number = 60000, // 1 minute
  startTime: number = Date.now() - (candleCount * intervalMs)
): TDataTradingCandles[] => {
  const candles: TDataTradingCandles[] = [];
  let currentPrice = basePrice;
  let currentTime = startTime;

  // Market trend parameters (slight upward trend)
  let trend = 0.0001; // 0.01% per candle upward bias
  let volatility = 0.002; // 0.2% volatility

  for (let i = 0; i < candleCount; i++) {
    // Add some market noise and occasional spikes
    const noise = (Math.random() - 0.5) * 2 * volatility;

    // Simulate occasional news events (5% chance of significant move)
    const newsEvent = Math.random() < 0.05 ? (Math.random() - 0.5) * 0.01 : 0;

    // Simulate trading sessions (higher volatility at certain times)
    const sessionHour = new Date(currentTime).getUTCHours();
    const sessionMultiplier = sessionHour >= 13 && sessionHour <= 21 ? 1.5 : 1; // US market hours more volatile

    const priceChange = trend + (noise * sessionMultiplier) + newsEvent;
    const nextPrice = currentPrice * (1 + priceChange);

    // Determine open, close, high, low
    const open = currentPrice;
    const close = nextPrice;

    // Generate realistic high/low based on price movement
    const priceRange = Math.abs(close - open);
    const minPrice = Math.min(open, close);
    const maxPrice = Math.max(open, close);

    // High is usually above both open and close
    const high = maxPrice + (Math.random() * priceRange * 0.5);
    // Low is usually below both open and close
    const low = minPrice - (Math.random() * priceRange * 0.5);

    // Ensure high is always >= both open and close, low is always <= both
    const finalHigh = Math.max(high, open, close);
    const finalLow = Math.min(low, open, close);

    // Volume tends to be higher during larger price movements
    const volumeMultiplier = 1 + (Math.abs(priceChange) * 100);
    const volume = 50 + (Math.random() * 150 * volumeMultiplier);

    candles.push({
      timestamp: currentTime,
      open,
      high: finalHigh,
      low: finalLow,
      close,
      volume: Math.round(volume * 100) / 100
    });

    // Update for next candle
    currentPrice = close;
    currentTime += intervalMs;

    // Occasionally change trend direction
    if (Math.random() < 0.02) {
      trend *= -0.5; // Reverse trend with reduced strength
    }

    // Occasionally increase volatility (market stress)
    if (Math.random() < 0.03) {
      volatility *= 1.2;
    } else if (Math.random() < 0.03 && volatility > 0.001) {
      volatility *= 0.9; // Revert to normal
    }
  }

  return candles;
};

// Generate more realistic mock data
export const MOCK_DATA_useTradingCandles: TDataTradingCandles[] = generateRealisticCandles(
  50000, // Starting price ~$50,000
  1000,   // 1000 candles
  60000, // 1-minute intervals
  Date.now() - (100 * 60000) // Start 100 minutes ago
);

// Alternative: Pre-generated realistic data with visible patterns
export const MOCK_DATA_useTradingCandles_ALT: TDataTradingCandles[] = [
  // Uptrend phase
  { timestamp: 1675305600000, open: 49850, high: 50230, low: 49780, close: 50120, volume: 245.7 },
  { timestamp: 1675305660000, open: 50120, high: 50480, low: 50050, close: 50390, volume: 198.3 },
  { timestamp: 1675305720000, open: 50390, high: 50670, low: 50210, close: 50550, volume: 212.5 },
  { timestamp: 1675305780000, open: 50550, high: 50890, low: 50430, close: 50780, volume: 256.9 },
  { timestamp: 1675305840000, open: 50780, high: 51120, low: 50650, close: 51010, volume: 278.4 },

  // Consolidation with doji
  { timestamp: 1675305900000, open: 51010, high: 51150, low: 50890, close: 51005, volume: 145.2 },
  { timestamp: 1675305960000, open: 51005, high: 51180, low: 50920, close: 51015, volume: 132.7 },

  // Continuation uptrend
  { timestamp: 1675306020000, open: 51015, high: 51340, low: 50960, close: 51280, volume: 201.8 },
  { timestamp: 1675306080000, open: 51280, high: 51620, low: 51190, close: 51550, volume: 267.3 },

  // Large green candle (bullish momentum)
  { timestamp: 1675306140000, open: 51550, high: 52010, low: 51480, close: 51940, volume: 356.9 },

  // Profit taking (upper wick)
  { timestamp: 1675306200000, open: 51940, high: 52150, low: 51670, close: 51780, volume: 312.4 },

  // Small pullback
  { timestamp: 1675306260000, open: 51780, high: 51920, low: 51530, close: 51640, volume: 189.6 },

  // Hammer reversal pattern
  { timestamp: 1675306320000, open: 51640, high: 51710, low: 51280, close: 51680, volume: 234.1 },

  // Recovery
  { timestamp: 1675306380000, open: 51680, high: 51990, low: 51620, close: 51910, volume: 198.7 },

  // More data points... (you can continue this pattern)
  { timestamp: 1675306440000, open: 51910, high: 52140, low: 51830, close: 52080, volume: 176.5 },
  { timestamp: 1675306500000, open: 52080, high: 52360, low: 51990, close: 52270, volume: 223.8 },
  { timestamp: 1675306560000, open: 52270, high: 52420, low: 52050, close: 52190, volume: 187.3 },
  { timestamp: 1675306620000, open: 52190, high: 52250, low: 51870, close: 51980, volume: 201.4 },
  { timestamp: 1675306680000, open: 51980, high: 52110, low: 51740, close: 52060, volume: 156.9 },
];

// Helper function to generate mock data that mimics real trading patterns
export const generateMockCandles = (
  count: number,
  baseTimestamp: number = Date.now() - (count * 60000)
): TDataTradingCandles[] => {
  return generateRealisticCandles(50000, count, 60000, baseTimestamp);
};