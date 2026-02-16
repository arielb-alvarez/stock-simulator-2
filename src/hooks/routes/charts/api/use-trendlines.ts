// hooks/routes/charts/api/use-trendlines.ts
import LOCAL_SERVICES from "@/constant/constant.local.service";
import { 
  Trendline, 
  ListTrendlinesQuery, 
  CreateTrendlinePayload, 
  UpdateTrendlinePayload,
  PaginatedResponse
} from "@/types/services/dev-coin-user/types.trendlines";
import { useState, useCallback } from "react";

interface UseTrendlinesReturn {
  // State
  trendlines: Trendline[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    count: number;
  };
  error: string | null;

  // Actions
  fetchTrendlines: (query?: ListTrendlinesQuery) => Promise<void>;
  getTrendline: (id: number) => Promise<Trendline | null>;
  createTrendline: (payload: CreateTrendlinePayload) => Promise<Trendline | null>;
  updateTrendline: (id: number, payload: UpdateTrendlinePayload) => Promise<Trendline | null>;
  deleteTrendline: (id: number) => Promise<boolean>;
  resetState: () => void;
}

const useTrendlines = (initialQuery?: ListTrendlinesQuery): UseTrendlinesReturn => {
  const [trendlines, setTrendlines] = useState<Trendline[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    count: 0
  });
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setTrendlines([]);
    setLoading(false);
    setPagination({ page: 1, limit: 50, count: 0 });
    setError(null);
  }, []);

  const fetchTrendlines = useCallback(async (query?: ListTrendlinesQuery) => {
    setLoading(true);
    setError(null);
    try {
      const mergedQuery = { ...initialQuery, ...query };
      const response = await LOCAL_SERVICES.localTrendlineService.list(mergedQuery);
      
      if (response.success && response.data) {
        setTrendlines(response.data.items);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || "Failed to fetch trendlines");
      }
    } catch (err: any) {
      console.error("useTrendlines.fetchTrendlines error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [initialQuery]);

  const getTrendline = useCallback(async (id: number): Promise<Trendline | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await LOCAL_SERVICES.localTrendlineService.get(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch trendline");
      }
    } catch (err: any) {
      console.error("useTrendlines.getTrendline error:", err);
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrendline = useCallback(async (payload: CreateTrendlinePayload): Promise<Trendline | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await LOCAL_SERVICES.localTrendlineService.create(payload);
      if (response.success && response.data) {
        // Optionally refresh list or add to local state
        // fetchTrendlines(); // if you want to refresh
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create trendline");
      }
    } catch (err: any) {
      console.error("useTrendlines.createTrendline error:", err);
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTrendline = useCallback(async (id: number, payload: UpdateTrendlinePayload): Promise<Trendline | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await LOCAL_SERVICES.localTrendlineService.update(id, payload);
      if (response.success && response.data) {
        // Update local list if needed
        setTrendlines(prev => prev.map(t => t.id === id ? response.data! : t));
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update trendline");
      }
    } catch (err: any) {
      console.error("useTrendlines.updateTrendline error:", err);
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrendline = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await LOCAL_SERVICES.localTrendlineService.delete(id);
      if (response.success) {
        // Remove from local list
        setTrendlines(prev => prev.filter(t => t.id !== id));
        return true;
      } else {
        throw new Error(response.message || "Failed to delete trendline");
      }
    } catch (err: any) {
      console.error("useTrendlines.deleteTrendline error:", err);
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trendlines,
    loading,
    pagination,
    error,
    fetchTrendlines,
    getTrendline,
    createTrendline,
    updateTrendline,
    deleteTrendline,
    resetState
  };
};

export default useTrendlines;

// Optional: Mock data generator for trendlines (if needed for testing)
export const generateMockTrendlines = (count: number = 10): Trendline[] => {
  const now = Date.now();
  const mockTrendlines: Trendline[] = [];
  for (let i = 1; i <= count; i++) {
    mockTrendlines.push({
      id: i,
      userId: 1,
      balanceId: i % 2 === 0 ? 100 + i : null,
      symbol: "BTCUSDT",
      interval: "1m",
      lineType: i % 3 === 0 ? "SUPPORT" : i % 3 === 1 ? "RESISTANCE" : "TREND",
      points: [
        { timestamp: now - 60000 * i, price: 50000 + i * 100 },
        { timestamp: now - 30000 * i, price: 51000 + i * 50 }
      ],
      meta: { color: i % 2 === 0 ? "#ff0000" : "#00ff00", width: 2 },
      createdAt: new Date(now - 86400000 * i).toISOString(),
      updatedAt: new Date(now - 3600000 * i).toISOString()
    });
  }
  return mockTrendlines;
};