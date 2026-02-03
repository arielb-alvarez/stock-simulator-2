// components/routes/chart/ChartLifecycle.tsx
'use client';
import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { cryptoService } from '@/services/cryptoService';
import { useChart } from '@/hooks/routes/charts/useChart';
import { useWebSocket } from '@/hooks/routes/charts/useWebSocket';
import { useDrawingTools } from '@/hooks/routes/charts/useDrawingTools';
import { AuthState } from './ChartAuth';
import useTradingCandles from '@/hooks/routes/charts/api/use-trading-candles';
import useTradingCandlesLatest from '@/hooks/routes/charts/api/use-trading-candles-latest';
import useTradingCandlesStats from '@/hooks/routes/charts/api/use-trading-candles-stats';

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

  // Use the new trading candles hook
  const { data: tradingCandles, loading: tradingCandlesLoading } = useTradingCandles({
    symbol: currentSymbol
  });


  const cleanupRequestedRef = useRef(false);
  const chartInstanceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mountedRef = useRef(true);

  const {
    chartContainerRef,
    chartRef,
    isLoading,
    error,
    lastUpdateTime,
    currentDataRef,
    setIsLoading,
    setError,
    setLastUpdateTime,
    initializeChart,
    updateChartWithData,
    cleanup: chartCleanup,
  } = useChart();

  // const { setupWebSocket } = useWebSocket(
  //   chartRef,
  //   currentDataRef,
  //   currentSymbol,
  //   config.interval,
  //   setLastUpdateTime,
  //   setError,
  //   updateChartWithData
  // );

  const { activeDrawingTool, handleDrawingToolSelect } = useDrawingTools(chartRef);

  // Update config when symbol changes
  useEffect(() => {
    if (currentSymbol !== config.symbol) {
      updateConfig({ symbol: currentSymbol });
    }
  }, [currentSymbol, config.symbol, updateConfig]);

  // For symbol change detection
  useEffect(() => {
    if (currentSymbol !== previousSymbol) {
      console.log(`Symbol changed from ${previousSymbol} to ${currentSymbol}`);
      setPreviousSymbol(currentSymbol);
      setChartVersion(prev => prev + 1);
    }
  }, [currentSymbol, previousSymbol]);

  // Main initialization effect - now depends on tradingCandles
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
    setIsLoading(true);
    setError(null);
    setIsChartReady(false);

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

      // Use trading candles data instead of cryptoService
      if (!tradingCandles || tradingCandles.length === 0) {
        throw new Error(`No data available for ${currentSymbol}`);
      }

      console.log(`Received ${tradingCandles.length} candles for ${currentSymbol} from tradingCandles API`);

      // Convert trading candles to chart data format
      const candlestickData = tradingCandles;

      currentDataRef.current = candlestickData;

      // Update chart with data
      updateChartWithData(chartInstance, candlestickData, false);

      setIsChartReady(true);

      // Setup WebSocket for real-time updates
      // setupWebSocket();

    } catch (err) {
      console.error('Chart initialization error:', err);
      setError(`Failed to load ${currentSymbol}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentSymbol,
    chartVersion,
    token,
    authState.hasValidToken,
    authState.isLoadingAuth,
    initializeChart,
    chartCleanup,
    // setupWebSocket,
    updateChartWithData,
    tradingCandles,
  ]);

  // Effect for chart initialization
  useEffect(() => {
    // Only initialize if we have trading candles data
    if (!tradingCandlesLoading && tradingCandles && tradingCandles.length > 0) {
      initializeChartLifecycle();
    }
  }, [initializeChartLifecycle, tradingCandles, tradingCandlesLoading]);

  // Cleanup function
  useEffect(() => {
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
  }, [chartCleanup]);

  // Show loading state when trading candles are loading
  useEffect(() => {
    if (tradingCandlesLoading) {
      setIsLoading(true);
    }
  }, [tradingCandlesLoading]);

  const lifecycleState: LifecycleState = {
    chartContainerRef: chartContainerRef as RefObject<HTMLDivElement>,
    chartRef,
    currentDataRef,
    isLoading: isLoading || tradingCandlesLoading,
    error,
    lastUpdateTime,
    isChartReady,
    chartVersion,
    previousSymbol,
    activeDrawingTool,
    handleDrawingToolSelect,
    setError,
    setIsLoading,
    setLastUpdateTime: setLastUpdateTime as (time: number | null) => void,
    setIsChartReady
  };

  return <>{children(lifecycleState)}</>;
}