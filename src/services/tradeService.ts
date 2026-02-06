// services/tradeService.ts
export interface Trade {
  id: string;
  orderId: string;
  symbol: string;
  side: string;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: string;
  isBuyer: boolean;
  isMaker: boolean;
}

export interface TradeHistoryResponse {
  trades: Trade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse {
  success: boolean;
  data: TradeHistoryResponse;
  message?: string;
}

// External API URL
const EXTERNAL_API_URL = 'https://dev-coin-user-data.marginnova.com';

// Base URL for our Next.js app (for proxy routes)
const getBaseUrl = () => {
  // In browser, use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // In SSR, use environment variable or default
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export const tradeService = {
  async getTradeHistory(
    token: string,
    symbol?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<TradeHistoryResponse> {
    try {
      // Always use proxy to avoid CORS issues
      const baseUrl = getBaseUrl();

      if (!baseUrl) {
        throw new Error('Base URL not configured. Please set NEXT_PUBLIC_SITE_URL environment variable.');
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(symbol && { symbol }),
      });

      // Use proxy URL (without /proxy in the path)
      const url = `${baseUrl}/api/trades?${params}`;

      console.log('Fetching trade history via proxy:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        console.error('HTTP error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });

        // Try to parse error as JSON
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error || errorJson.message) {
            errorMessage = errorJson.error || errorJson.message;
          }
        } catch {
          // If not JSON, use the text as is
        }

        throw new Error(errorMessage);
      }

      const data: ApiResponse = await response.json();

      // Check for success flag
      if (!data.success) {
        console.error('API returned success: false:', data);
        throw new Error(data.message || 'Failed to fetch trade history');
      }

      console.log('Trade history fetched successfully via proxy:', {
        count: data.data.trades?.length || 0,
        symbol,
        page,
        limit
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching trade history via proxy:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(
          'Network error. The proxy server might not be available. ' +
          'Please check if the proxy API route is configured correctly at /api/trades'
        );
      }

      throw error;
    }
  },
};