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
            throw error
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