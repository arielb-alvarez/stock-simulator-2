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
    symbol: string, //example: btcusdt
}

