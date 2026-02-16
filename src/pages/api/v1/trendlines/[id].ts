// pages/api/v1/trendlines/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import MAIN_SERVICES from "@/constant/constant.main.service";
import { ERROR_RESPONSE } from "@/services/dev-coin-user/main/services.main";
import { UpdateTrendlinePayload } from "@/types/services/dev-coin-user/types.trendlines";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, any>>
) {
  try {
    const { id } = req.query;
    const trendlineId = parseInt(id as string);
    if (isNaN(trendlineId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_ID",
        message: "Invalid trendline ID",
      });
    }

    if (req.method === "GET") {
      const response = await MAIN_SERVICES.mainTrendlineService.mainGetTrendline({
        id: trendlineId,
      });
      return res.status(response.status).json(response.data);
    }

    if (req.method === "PUT") {
      const body = req.body as UpdateTrendlinePayload;
      const response = await MAIN_SERVICES.mainTrendlineService.mainUpdateTrendline({
        id: trendlineId,
        data: body,
      });
      return res.status(response.status).json(response.data);
    }

    if (req.method === "DELETE") {
      const response = await MAIN_SERVICES.mainTrendlineService.mainDeleteTrendline({
        id: trendlineId,
      });
      return res.status(response.status).json(response.data);
    }

    return res.status(405).json({
      success: false,
      code: "METHOD_NOT_ALLOWED",
      message: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error("Trendline detail API error:", error);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json(ERROR_RESPONSE);
  }
}