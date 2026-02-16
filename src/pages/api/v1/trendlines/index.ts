// pages/api/v1/trendlines/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import MAIN_SERVICES from "@/constant/constant.main.service";
import { ERROR_RESPONSE } from "@/services/dev-coin-user/main/services.main";
import { ListTrendlinesQuery, CreateTrendlinePayload } from "@/types/services/dev-coin-user/types.trendlines";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, any>>
) {
  try {
    if (req.method === "GET") {
      const query = req.query as ListTrendlinesQuery;
      const response = await MAIN_SERVICES.mainTrendlineService.mainListTrendlines({
        params: query,
      });
      return res.status(response.status).json(response.data);
    }

    if (req.method === "POST") {
      const body = req.body as CreateTrendlinePayload;
      const response = await MAIN_SERVICES.mainTrendlineService.mainCreateTrendline({
        data: body,
      });
      return res.status(response.status).json(response.data);
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      code: "METHOD_NOT_ALLOWED",
      message: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error("Trendlines API error:", error);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json(ERROR_RESPONSE);
  }
}