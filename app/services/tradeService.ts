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

// Detect if we're in an iframe
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

// Configuration for using proxy
// You can set this via environment variable: NEXT_PUBLIC_USE_API_PROXY=true
const USE_PROXY = isInIframe || process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';

// Base URL for our Next.js app (for proxy routes)
const getBaseUrl = () => {
  // In browser, use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In SSR, use environment variable or default
  return process.env.NEXT_PUBLIC_SITE_URL || '';
};

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

      let url: string;
      
      if (USE_PROXY) {
        // Use our Next.js proxy API route
        const baseUrl = getBaseUrl();
        if (!baseUrl) {
          console.warn('Base URL not available for proxy. Falling back to direct API call.');
          url = `${EXTERNAL_API_URL}/api/orders/trades/history?${params}`;
        } else {
          url = `${baseUrl}/api/trades/proxy?${params}`;
          console.log('Using proxy URL for trade history:', url);
        }
      } else {
        // Use direct external API
        url = `${EXTERNAL_API_URL}/api/orders/trades/history?${params}`;
      }
      
      console.log('Fetching trade history from:', url);
      
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // When using proxy, we can use same-origin credentials
      if (USE_PROXY) {
        fetchOptions.credentials = 'same-origin';
      }
      
      const response = await fetch(url, fetchOptions);

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
      
      // Enhance error message for CORS issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        if (USE_PROXY) {
          throw new Error(
            'Network error. The proxy server might not be configured. ' +
            'Please check if the proxy API route is available at /api/trades/proxy'
          );
        } else {
          throw new Error(
            'Cross-Origin Request Blocked. ' +
            'Please enable CORS on the external API or use the proxy configuration.'
          );
        }
      }
      
      throw error;
    }
  },

  // Alternative method using JSONP for environments where CORS is strict
  async getTradeHistoryJSONP(
    token: string,
    symbol?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<TradeHistoryResponse> {
    return new Promise((resolve, reject) => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        reject(new Error('JSONP is only available in browser environment'));
        return;
      }

      const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
      
      // Build the JSONP URL
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        callback: callbackName,
        ...(symbol && { symbol }),
      });
      
      // Note: This requires the external API to support JSONP
      const script = document.createElement('script');
      script.src = `${EXTERNAL_API_URL}/api/orders/trades/history?${params}`;
      
      // Define the callback function
      (window as any)[callbackName] = (data: ApiResponse) => {
        // Clean up
        delete (window as any)[callbackName];
        document.body.removeChild(script);
        
        if (data.success) {
          resolve(data.data);
        } else {
          reject(new Error(data.message || 'Failed to fetch trade history'));
        }
      };
      
      script.onerror = () => {
        // Clean up on error
        delete (window as any)[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        reject(new Error('Network error'));
      };
      
      // Add script to document
      document.body.appendChild(script);
      
      // Set timeout for the request
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName];
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
          reject(new Error('Request timeout'));
        }
      }, 10000); // 10 second timeout
    });
  },
};