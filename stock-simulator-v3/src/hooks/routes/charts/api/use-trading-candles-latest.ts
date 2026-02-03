// hooks/routes/charts/api/use-trading-candles.ts
import LOCAL_SERVICES from "@/constant/constant.local.service";
import { ECandlesExchange, ECandlesInterval } from "@/enum/services/dev-coin-user/enum.candles";
import { TDataTradingCandlesLatest, TParamsTradingCandlesLatest } from "@/types/services/dev-coin-user/types.candles";
import { useEffect, useState } from "react";

const useTradingCandlesLatest = ({ symbol }: Pick<TParamsTradingCandlesLatest, "symbol">) => {

    const [params, setParams] = useState<Omit<TParamsTradingCandlesLatest, "symbol">>({
        interval: ECandlesInterval.ONE_MINUTE,
        exchange: ECandlesExchange.KUCOIN,
    })

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<TDataTradingCandlesLatest | undefined>(undefined);

    const getTradingCandlesLatest = async () => {
        setLoading(true);
        try {
            const response = await LOCAL_SERVICES.localCandleService.localGetCandleSymbolLatest({ symbol, ...params });
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
        getTradingCandlesLatest();
    }, [params]);

    return {
        data,
        setParams,
        loading
    }
}

export default useTradingCandlesLatest;

export const MOCK_DATA_useTradingCandlesLatest: TDataTradingCandlesLatest = {
    timestamp: 1675305600000,
    open: 50000,
    high: 50500,
    low: 49850,
    close: 50200,
    volume: 120.5
}