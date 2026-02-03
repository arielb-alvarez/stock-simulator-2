import { TDataTradingCandles, TParamsTradingCandles, TResponseCandles } from "@/types/services/dev-coin-user/types.candles";
import { LocalService } from "./services.local";

type CandleResponse<T = undefined> = Promise<TResponseCandles<T>>;

const LOCAL_API_URL_TEMPLATE = "/api/v1/candles"

class LocalCandleService extends LocalService {
    constructor() {
        super();
    }

    public async localTradingCandles(data: TParamsTradingCandles): CandleResponse<TDataTradingCandles[]> {
        try {
            return await this.client.post(LOCAL_API_URL_TEMPLATE + "/trading-candles", data);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const localCandleService = new LocalCandleService();
export default localCandleService;