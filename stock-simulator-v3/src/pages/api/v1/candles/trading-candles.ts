// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MAIN_SERVICES from "@/constant/constant.main.service";
import { ERROR_RESPONSE } from "@/services/dev-coin-user/main/services.main";
import { TParamsTradingCandles } from "@/types/services/dev-coin-user/types.candles";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any>>,
) {
    try {
        if (req.method !== "POST") throw new Error("Method Not Allowed");
        const response = await MAIN_SERVICES.mainCandleService.mainCandleService(
            {
                data: req?.body as TParamsTradingCandles,
                // config: req.headers
                // config: getRequestConfig(req)
            })
        return res.status(response?.status || 200).json(response?.data);
    }
    catch (error: any) {
        console.error(error);
        // If error comes with a response (like Axios), use its status
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        // Fallback generic error
        return res.status(500).json(ERROR_RESPONSE);
    }
}
