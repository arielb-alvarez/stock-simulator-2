// services/dev-coin-user/local/services.local.trendlines.ts
import { LocalService } from "./services.local";
import {
  ApiResponse,
  CreateTrendlinePayload,
  ListTrendlinesQuery,
  PaginatedResponse,
  Trendline,
  UpdateTrendlinePayload,
} from "@/types/services/dev-coin-user/types.trendlines";

const LOCAL_API_URL = "/api/v1/trendlines";

class LocalTrendlineService extends LocalService {
  constructor() {
    super();
  }

  async list(query?: ListTrendlinesQuery): Promise<ApiResponse<PaginatedResponse<Trendline>>> {
    try {
      const params = new URLSearchParams();
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const url = `${LOCAL_API_URL}${params.toString() ? `?${params}` : ''}`;
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error("LocalTrendlineService.list error:", error);
      throw error;
    }
  }

  async get(id: number): Promise<ApiResponse<Trendline>> {
    try {
      const response = await this.client.get(`${LOCAL_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("LocalTrendlineService.get error:", error);
      throw error;
    }
  }

  async create(payload: CreateTrendlinePayload): Promise<ApiResponse<Trendline>> {
    try {
      const response = await this.client.post(LOCAL_API_URL, payload);
      return response.data;
    } catch (error) {
      console.error("LocalTrendlineService.create error:", error);
      throw error;
    }
  }

  async update(id: number, payload: UpdateTrendlinePayload): Promise<ApiResponse<Trendline>> {
    try {
      const response = await this.client.put(`${LOCAL_API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("LocalTrendlineService.update error:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<ApiResponse<{ id: number }>> {
    try {
      const response = await this.client.delete(`${LOCAL_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("LocalTrendlineService.delete error:", error);
      throw error;
    }
  }
}

const localTrendlineService = new LocalTrendlineService();
export default localTrendlineService;