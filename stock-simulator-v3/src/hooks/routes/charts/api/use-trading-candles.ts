// hooks/routes/charts/api/use-trading-candles.ts
import LOCAL_SERVICES from "@/constant/constant.local.service";
import { TDataTradingCandles, TParamsTradingCandles } from "@/types/services/dev-coin-user/types.candles";
import { useEffect, useState } from "react";

const useTradingCandles = ({ symbol }: TParamsTradingCandles) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<TDataTradingCandles[]>([]);

    const getTradingCandles = async () => {
        setLoading(true);
        try {
            const response = await LOCAL_SERVICES.localCandleService.localTradingCandles({ symbol });
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
    }, []);

    return {
        data,
        loading
    }
}

export default useTradingCandles;