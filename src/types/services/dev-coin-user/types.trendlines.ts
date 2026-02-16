// types/services/dev-coin-user/types.trendlines.ts
export interface TrendlinePoint {
  timestamp: number; // Unix milliseconds
  price: number;
}

export interface TrendlineMeta {
  color?: string;
  width?: number;
  label?: string;
  [key: string]: any;
}

export type TrendlineLineType = 'TREND' | 'SUPPORT' | 'RESISTANCE' | 'CHANNEL';

export interface Trendline {
  id: number;
  userId: number;
  balanceId?: number | null;
  symbol: string;
  interval: string;      // e.g., '1m', '5m', '1h'
  lineType: TrendlineLineType;
  points: TrendlinePoint[];
  meta: TrendlineMeta;
  createdAt: string;     // ISO date string
  updatedAt: string;
}

// Request / Response types
export interface ListTrendlinesQuery {
  symbol?: string;
  interval?: string;
  lineType?: TrendlineLineType;
  balanceId?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    count: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
}

export interface CreateTrendlinePayload {
  symbol: string;
  interval: string;
  lineType: TrendlineLineType;
  points: TrendlinePoint[];
  balanceId?: number | null;
  meta?: TrendlineMeta;
}

export type UpdateTrendlinePayload = Partial<CreateTrendlinePayload>;