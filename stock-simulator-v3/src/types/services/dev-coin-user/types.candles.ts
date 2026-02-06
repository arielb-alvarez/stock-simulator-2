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


export type TDataTradingCandlesStats = {
    open: number,
    close: number,
    high: number,
    low: number,
    volume: number,
    count: number
}

export type TDataTradingCandlesLatest = {
    timestamp: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
}

export type TParamsTradingCandlesLatest = {
    symbol: string;
    interval?: ECandlesInterval;     // e.g., '1m', '5m', '1h', defaults to '1m'
    exchange?: ECandlesExchange;     // lowercase, defaults to 'kucoin'
}

export type TParamsTradingCandlesStats = {
    symbol: string;
    interval?: ECandlesInterval;     // e.g., '1m', '5m', '1h', defaults to '1m'
    exchange?: ECandlesExchange;     // lowercase, defaults to 'kucoin'
}

export type TDataCandlesWebsockets = {
    close: string,
    header: {
        exchange: string,
        symbol: string,
        timestamp: number,
    },
    high: string,
    interval: string,
    low: string,
    open: string,
    trades: number,
    volume: string
}