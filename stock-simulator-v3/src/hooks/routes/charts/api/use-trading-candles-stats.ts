// hooks/routes/charts/api/use-trading-candles.ts
import LOCAL_SERVICES from "@/constant/constant.local.service";
import { ECandlesExchange, ECandlesInterval } from "@/enum/services/dev-coin-user/enum.candles";
import { TDataTradingCandlesStats, TParamsTradingCandlesStats } from "@/types/services/dev-coin-user/types.candles";
import { useEffect, useState } from "react";

const useTradingCandlesStats = ({ symbol }: Pick<TParamsTradingCandlesStats, "symbol">) => {

    const [params, setParams] = useState<Omit<TParamsTradingCandlesStats, "symbol">>({
        interval: ECandlesInterval.ONE_MINUTE,
        exchange: ECandlesExchange.KUCOIN,
    })

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<TDataTradingCandlesStats | undefined>(undefined);

    const getTradingCandlesStats = async () => {
        setLoading(true);
        try {
            const response = await LOCAL_SERVICES.localCandleService.localGetCandleSymbolStats({ symbol, ...params });
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

    useEffect(() => {
        if (!symbol) return;
        getTradingCandlesStats();
    }, [params]);

    return {
        data,
        setParams,
        loading
    }
}

export default useTradingCandlesStats;

export const MOCK_DATA_useTradingCandlesStats: TDataTradingCandlesStats = {
    open: 50000,    // opening price
    close: 50500,   // closing price
    high: 50750,    // highest price
    low: 49850,     // lowest price
    volume: 1234.56, // total traded volume
    count: 150      // number of trades in the interval
};