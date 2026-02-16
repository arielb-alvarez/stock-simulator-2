// services/dev-coin-user/main/services.main.trendlines.ts
import { AxiosResponse } from "axios";
import MainService from "./services.main";
import {
  ApiResponse,
  CreateTrendlinePayload,
  ListTrendlinesQuery,
  PaginatedResponse,
  Trendline,
  UpdateTrendlinePayload,
} from "@/types/services/dev-coin-user/types.trendlines";

type TrendlineResponse<T = undefined> = Promise<AxiosResponse<ApiResponse<T>>>;

const MAIN_API_URL_TEMPLATE = "/api/trendlines"; // adjust to your external backend path

class MainTrendlineService extends MainService {
  constructor() {
    super();
  }

  // List trendlines (GET)
  public async mainListTrendlines({
    params,
  }: {
    params?: ListTrendlinesQuery;
  }): TrendlineResponse<PaginatedResponse<Trendline>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    const url = `${MAIN_API_URL_TEMPLATE}${query.toString() ? `?${query}` : ''}`;
    return await this.client.get(url);
  }

  // Get single trendline (GET)
  public async mainGetTrendline({
    id,
  }: {
    id: number;
  }): TrendlineResponse<Trendline> {
    return await this.client.get(`${MAIN_API_URL_TEMPLATE}/${id}`);
  }

  // Create trendline (POST)
  public async mainCreateTrendline({
    data,
  }: {
    data: CreateTrendlinePayload;
  }): TrendlineResponse<Trendline> {
    return await this.client.post(MAIN_API_URL_TEMPLATE, data);
  }

  // Update trendline (PUT)
  public async mainUpdateTrendline({
    id,
    data,
  }: {
    id: number;
    data: UpdateTrendlinePayload;
  }): TrendlineResponse<Trendline> {
    return await this.client.put(`${MAIN_API_URL_TEMPLATE}/${id}`, data);
  }

  // Delete trendline (DELETE)
  public async mainDeleteTrendline({
    id,
  }: {
    id: number;
  }): TrendlineResponse<{ id: number }> {
    return await this.client.delete(`${MAIN_API_URL_TEMPLATE}/${id}`);
  }
}

const mainTrendlineService = new MainTrendlineService();
export default mainTrendlineService;