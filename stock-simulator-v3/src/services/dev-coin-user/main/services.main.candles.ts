import { AxiosResponse } from "axios";
import MainService from "./services.main";
import { TParamsTradingCandles, TResponseCandles, TDataTradingCandles } from "@/types/services/dev-coin-user/types.candles";

type CandleResponse<T = undefined> = Promise<AxiosResponse<TResponseCandles<T>>>

const MAIN_API_URL_TEMPLATE = "/api/candles"

class MainCandleService extends MainService {

    constructor() {
        super();
    }

    public async mainCandleService({
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
}

const mainCandleService = new MainCandleService();
export default mainCandleService;

