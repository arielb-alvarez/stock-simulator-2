// components/routes/chart/ChartLifecycle.tsx
'use client';
import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useChart } from '@/hooks/routes/charts/useChart';
import { useWebSocket } from '@/hooks/routes/charts/useWebSocket';
import { useDrawingTools } from '@/hooks/routes/charts/useDrawingTools';
import { AuthState } from './ChartAuth';
import { ECandlesInterval, ECandlesExchange } from '@/enum/services/dev-coin-user/enum.candles';
import useTradingCandles, { MOCK_DATA_useTradingCandles } from '@/hooks/routes/charts/api/use-trading-candles';

export interface LifecycleState {
  chartContainerRef: React.RefObject<HTMLDivElement>;
  chartRef: React.MutableRefObject<any>;
  currentDataRef: React.MutableRefObject<any[]>;
  isLoading: boolean;
  error: string | null;
  lastUpdateTime: number | null;
  isChartReady: boolean;
  chartVersion: number;
  previousSymbol: string;
  activeDrawingTool: string;
  handleDrawingToolSelect: (tool: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLastUpdateTime: (time: number | null) => void;
  setIsChartReady: (ready: boolean) => void;
}

interface ChartLifecycleProps {
  currentSymbol: string;
  token: string | null;
  config: any;
  updateConfig: (config: any) => void;
  authState: AuthState;
  children: (lifecycleState: LifecycleState) => ReactNode;
}

// Helper function to map interval strings to ECandlesInterval
const mapIntervalToECandlesInterval = (interval: string): ECandlesInterval => {
  const intervalMap: Record<string, ECandlesInterval> = {
    '1m': ECandlesInterval.ONE_MINUTE,
    '3m': ECandlesInterval.THREE_MINUTES,
    '5m': ECandlesInterval.FIVE_MINUTES,
    '15m': ECandlesInterval.FIFTEEN_MINUTES,
    '30m': ECandlesInterval.THIRTY_MINUTES,
    '1h': ECandlesInterval.ONE_HOUR,
    '2h': ECandlesInterval.TWO_HOURS,
    '4h': ECandlesInterval.FOUR_HOURS,
    '6h': ECandlesInterval.SIX_HOURS,
    '8h': ECandlesInterval.EIGHT_HOURS,
    '12h': ECandlesInterval.TWELVE_HOURS,
    '1d': ECandlesInterval.ONE_DAY,
    '3d': ECandlesInterval.THREE_DAYS,
    '1w': ECandlesInterval.ONE_WEEK,
    '1M': ECandlesInterval.ONE_MONTH,
  };
  return intervalMap[interval] || ECandlesInterval.ONE_MINUTE;
};

export default function ChartLifecycle({
  currentSymbol,
  token,
  config,
  updateConfig,
  authState,
  children
}: ChartLifecycleProps) {
  const [previousSymbol, setPreviousSymbol] = useState(currentSymbol);
  const [chartVersion, setChartVersion] = useState(0);
  const [isChartReady, setIsChartReady] = useState(false);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  const cleanupRequestedRef = useRef(false);
  const chartInstanceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mountedRef = useRef(true);
  const initializationAttemptedRef = useRef(false);

  // Use the new trading candles hook
  const { data: tradingCandlesData, loading: candlesLoading, setParams: setCandlesParams } = useTradingCandles({
    symbol: currentSymbol,
  });

  const {
    chartContainerRef,
    chartRef,
    isLoading: chartLoading,
    error: chartError,
    lastUpdateTime,
    currentDataRef,
    setIsLoading: setChartLoading,
    setError: setChartError,
    setLastUpdateTime,
    initializeChart,
    updateChartWithData,
    cleanup: chartCleanup,
  } = useChart();

  const { setupWebSocket } = useWebSocket(
    chartRef,
    currentDataRef,
    currentSymbol,
    config.interval,
    setLastUpdateTime,
    setChartError,
    updateChartWithData
  );

  const { activeDrawingTool, handleDrawingToolSelect } = useDrawingTools(chartRef);

  // Update config when symbol changes
  useEffect(() => {
    if (currentSymbol !== config.symbol) {
      updateConfig({ symbol: currentSymbol });
    }
  }, [currentSymbol, config.symbol, updateConfig]);

  // Update candles params when config changes
  useEffect(() => {
    setCandlesParams(prev => ({
      ...prev,
      interval: mapIntervalToECandlesInterval(config.interval),
      limit: config.limit,
      exchange: ECandlesExchange.KUCOIN
    }));
  }, [config.interval, config.limit, setCandlesParams]);

  // For symbol change detection
  useEffect(() => {
    if (currentSymbol !== previousSymbol) {
      console.log(`Symbol changed from ${previousSymbol} to ${currentSymbol}`);
      setPreviousSymbol(currentSymbol);
      setChartVersion(prev => prev + 1);
      setIsUsingMockData(false);
      initializationAttemptedRef.current = false;
    }
  }, [currentSymbol, previousSymbol]);

  // Process and update chart with data from the new hook
  const processChartData = useCallback((data: any[], isMockData: boolean = false) => {
    if (!chartInstanceRef.current || data.length === 0) return;

    try {
      // Convert data format if needed (based on the sample you provided)
      const formattedData = data.map(item => ({
        time: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }));

      currentDataRef.current = formattedData;
      updateChartWithData(chartInstanceRef.current, formattedData, false);
      setIsUsingMockData(isMockData);
      
      if (isMockData) {
        console.warn('Using mock data due to API failure');
      }
    } catch (err) {
      console.error('Error processing chart data:', err);
      setChartError(`Failed to process chart data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [updateChartWithData, currentDataRef, setChartError]);

  // Handle data from the new hook
  useEffect(() => {
    if (!initializationAttemptedRef.current || !isChartReady) return;

    if (!candlesLoading && tradingCandlesData && tradingCandlesData.length > 0) {
      // Use real API data
      processChartData(tradingCandlesData, false);
    } else if (!candlesLoading && tradingCandlesData && tradingCandlesData.length === 0) {
      // API returned empty data, use mock data as fallback
      console.warn('API returned empty data, using mock data as fallback');
      processChartData(MOCK_DATA_useTradingCandles, true);
    }
  }, [tradingCandlesData, candlesLoading, isChartReady, processChartData]);

  // Main initialization effect
  const initializeChartLifecycle = useCallback(async () => {
    // Don't initialize if we have an invalid token
    if (token && authState.hasValidToken === false) {
      return;
    }

    // Don't initialize if still loading auth
    if (authState.isLoadingAuth) {
      return;
    }

    console.log(`Initializing chart for ${currentSymbol} (version: ${chartVersion})`);
    setChartLoading(true);
    setChartError(null);
    setIsChartReady(false);
    initializationAttemptedRef.current = true;

    try {
      // Clean up any existing chart
      if (chartInstanceRef.current) {
        try {
          chartCleanup();
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
        chartInstanceRef.current = null;
      }

      // Initialize new chart
      const chartInstance = initializeChart();
      if (!chartInstance) {
        throw new Error('Chart initialization failed');
      }

      chartInstanceRef.current = chartInstance;
      chartRef.current = chartInstance;

      // Setup resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      resizeObserverRef.current = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize();
        }
      });

      if (chartContainerRef.current) {
        resizeObserverRef.current.observe(chartContainerRef.current);
      }

      // Wait for initial data to load
      if (!candlesLoading && tradingCandlesData && tradingCandlesData.length > 0) {
        processChartData(tradingCandlesData, false);
      } else if (!candlesLoading) {
        // If data is not available yet or empty, use mock data temporarily
        console.log('Using mock data for initial display');
        processChartData(MOCK_DATA_useTradingCandles, true);
      }

      setIsChartReady(true);

      // Setup WebSocket for real-time updates
      setupWebSocket();

    } catch (err) {
      console.error('Chart initialization error:', err);
      setChartError(`Failed to load ${currentSymbol}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Even if chart initialization fails, try to show mock data
      if (chartInstanceRef.current && MOCK_DATA_useTradingCandles.length > 0) {
        processChartData(MOCK_DATA_useTradingCandles, true);
        setIsChartReady(true);
      }
    } finally {
      setChartLoading(false);
    }
  }, [
    currentSymbol,
    chartVersion,
    token,
    authState.hasValidToken,
    authState.isLoadingAuth,
    initializeChart,
    chartCleanup,
    setupWebSocket,
    processChartData,
    candlesLoading,
    tradingCandlesData,
    setChartLoading,
    setChartError,
    chartContainerRef,
    chartRef
  ]);

  // Effect for chart initialization
  useEffect(() => {
    initializeChartLifecycle();

    // Cleanup function
    return () => {
      cleanupRequestedRef.current = true;
      mountedRef.current = false;

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      if (chartInstanceRef.current) {
        try {
          chartCleanup();
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
        chartInstanceRef.current = null;
      }
    };
  }, [initializeChartLifecycle, chartCleanup]);

  // Combined loading state
  const isLoading = chartLoading || candlesLoading;

  // Combined error state (prefer chart errors, then data errors)
  const error = chartError || (candlesLoading ? null : (tradingCandlesData?.length === 0 ? 'No data available' : null));

  const lifecycleState: LifecycleState = {
    chartContainerRef: chartContainerRef as RefObject<HTMLDivElement>,
    chartRef,
    currentDataRef,
    isLoading,
    error,
    lastUpdateTime,
    isChartReady,
    chartVersion,
    previousSymbol,
    activeDrawingTool,
    handleDrawingToolSelect,
    setError: setChartError,
    setIsLoading: setChartLoading,
    setLastUpdateTime: setLastUpdateTime as (time: number | null) => void,
    setIsChartReady
  };

  return <>{children(lifecycleState)}</>;
}