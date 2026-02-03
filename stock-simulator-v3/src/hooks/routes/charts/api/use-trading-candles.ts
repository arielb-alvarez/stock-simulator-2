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
            const response = await LOCAL_SERVICES.localCandleService.localTradingCandles({ symbol, ...params });
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