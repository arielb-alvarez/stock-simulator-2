// services/dev-coin-user/main/services.main.candles.ts
import { AxiosResponse } from "axios";
import MainService from "./services.main";
import { TParamsTradingCandles, TResponseCandles, TDataTradingCandles, TParamsTradingCandlesStats, TDataTradingCandlesStats, TDataTradingCandlesLatest } from "@/types/services/dev-coin-user/types.candles";

type CandleResponse<T = undefined> = Promise<AxiosResponse<TResponseCandles<T>>>

const MAIN_API_URL_TEMPLATE = "/api/candles"

class MainCandleService extends MainService {

    constructor() {
        super();
    }

    public async mainGetCandleSymbol({
        data
    }: {
        data: TParamsTradingCandles
    }): CandleResponse<TDataTradingCandles[]> {
        try {
            const query = new URLSearchParams();
            if (data?.limit) query.append("limit", data?.limit?.toString());
            if (data?.interval) query.append("interval", data?.interval);
            if (data?.exchange) query.append("exchange", data?.exchange);
            if (data?.startTime) query.append("startTime", data?.startTime?.toString());
            if (data?.endTime) query.append("endTime", data?.endTime?.toString());

            const endpoint: string = `/${data?.symbol}?${query}`
            return await this.client.get(MAIN_API_URL_TEMPLATE + endpoint);
        }
        catch (error) {
            console.error(error);
            throw error
        }
    }

    public async mainGetCandleSymbolStats({
        data
    }: {
        data: TParamsTradingCandlesStats
    }): CandleResponse<TDataTradingCandlesStats> {
        const query = new URLSearchParams();
        if (data?.interval) query.append("interval", data?.interval);
        if (data?.exchange) query.append("exchange", data?.exchange);

        const endpoint: string = `/${data?.symbol}/stats?${query}`
        return await this.client.get(MAIN_API_URL_TEMPLATE + endpoint);
    }


    public async mainGetCandleSymbolLatest({
        data
    }: {
        data: TParamsTradingCandlesStats
    }): CandleResponse<TDataTradingCandlesLatest> {
        const query = new URLSearchParams();
        if (data?.interval) query.append("interval", data?.interval);
        if (data?.exchange) query.append("exchange", data?.exchange);

        const endpoint: string = `/${data?.symbol}/latest?${query}`
        return await this.client.get(MAIN_API_URL_TEMPLATE + endpoint);
    }

}

const mainCandleService = new MainCandleService();
export default mainCandleService;

