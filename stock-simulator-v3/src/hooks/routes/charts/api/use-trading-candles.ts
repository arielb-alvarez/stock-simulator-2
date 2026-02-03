// hooks/routes/charts/api/use-trading-candles.ts
import LOCAL_SERVICES from "@/constant/constant.local.service";
import { ECandlesExchange, ECandlesInterval } from "@/enum/services/dev-coin-user/enum.candles";
import { TDataTradingCandles, TParamsTradingCandles } from "@/types/services/dev-coin-user/types.candles";
import { useEffect, useState } from "react";

const useTradingCandles = ({ symbol }: Pick<TParamsTradingCandles, "symbol">) => {

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
            throw error
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!symbol) return;
        getTradingCandles();
    }, [params]);

    return {
        data,
        setParams,
        loading
    }
}

export default useTradingCandles;

export const MOCK_DATA_useTradingCandles: TDataTradingCandles[] = [
    { timestamp: 1675305600000, open: 50000, high: 50500, low: 49500, close: 50200, volume: 120.5 },
    { timestamp: 1675305660000, open: 50200, high: 50650, low: 50000, close: 50450, volume: 98.7 },
    { timestamp: 1675305720000, open: 50450, high: 50800, low: 50300, close: 50700, volume: 135.2 },
    { timestamp: 1675305780000, open: 50700, high: 51000, low: 50550, close: 50950, volume: 150.3 },
    { timestamp: 1675305840000, open: 50950, high: 51100, low: 50750, close: 50850, volume: 110.8 },
    { timestamp: 1675305900000, open: 50850, high: 51050, low: 50700, close: 50900, volume: 99.9 },
    { timestamp: 1675305960000, open: 50900, high: 51200, low: 50800, close: 51150, volume: 125.4 },
    { timestamp: 1675306020000, open: 51150, high: 51500, low: 51000, close: 51400, volume: 140.1 },
    { timestamp: 1675306080000, open: 51400, high: 51600, low: 51250, close: 51550, volume: 130.7 },
    { timestamp: 1675306140000, open: 51550, high: 51800, low: 51400, close: 51750, volume: 145.6 },
];