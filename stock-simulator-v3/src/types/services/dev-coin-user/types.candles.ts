import { ECandlesExchange, ECandlesInterval } from "@/enum/services/dev-coin-user/enum.candles"

export type TResponseCandles<T = unknown> = {
    success: boolean,
    data: T,
    meta?: Record<string, unknown>
}

export type TDataTradingCandles = {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export type TParamsTradingCandles = {
    symbol: string;       // symbol in lowercase, with '-' removed
    interval?: ECandlesInterval;     // e.g., '1m', '5m', '1h', defaults to '1m'
    exchange?: ECandlesExchange;     // lowercase, defaults to 'kucoin'
    startTime?: number;   // optional, UNIX timestamp in ms
    endTime?: number;     // optional, UNIX timestamp in ms
    limit?: number;        // min 100, max 1000
}

