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

const BASE_API_URL = 'https://dev-coin-user-data.marginnova.com';

export const tradeService = {
  async getTradeHistory(
    token: string, 
    symbol?: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<TradeHistoryResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(symbol && { symbol }),
      });

      const url = `${BASE_API_URL}/api/orders/trades/history?${params}`;
      
      console.log('Fetching trade history from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        console.error('HTTP error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      // Check for success flag as mentioned in the requirements
      if (!data.success) {
        console.error('API returned success: false:', data);
        throw new Error(data.message || 'Failed to fetch trade history');
      }

      console.log('Trade history fetched successfully:', {
        count: data.data.trades?.length || 0,
        symbol,
        page,
        limit
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching trade history:', error);
      throw error;
    }
  },
};