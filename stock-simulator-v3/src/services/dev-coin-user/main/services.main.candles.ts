import { AxiosResponse } from "axios";
import MainService from "./services.main";
import { TParamsTradingCandles, TResponseCandles, TDataTradingCandles } from "@/types/services/dev-coin-user/types.candles";

type CandleResponse<T = undefined> = Promise<AxiosResponse<TResponseCandles<T>>>

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
            const endpoint: string = `/api/candles/${data?.symbol}`
            return await this.client.get(endpoint);
        }
        catch (error) {
            console.error(error);
            throw error
        }
    }
}

const mainCandleService = new MainCandleService();
export default mainCandleService;

