'use client';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { cryptoService } from '@/services/cryptoService';
import { useChart } from '@/hooks/useChart';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDrawingTools } from '@/hooks/useDrawingTools';
import { AuthState } from './ChartAuth';

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

  const { setupWebSocket } = useWebSocket(
    chartRef,
    currentDataRef,
    currentSymbol,
    config.interval,
    setLastUpdateTime,
    setError,
    updateChartWithData
  );

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
      
      // Fetch data
      const candlestickData = await cryptoService.getHistoricalData(
        currentSymbol,
        config.interval,
        config.limit
      );
      
      if (candlestickData.length === 0) {
        throw new Error(`No data available for ${currentSymbol}`);
      }
      
      console.log(`Received ${candlestickData.length} candles for ${currentSymbol}`);
      
      currentDataRef.current = candlestickData;
      
      // Update chart with data
      updateChartWithData(chartInstance, candlestickData, false);
      
      setIsChartReady(true);
      
      // Setup WebSocket
      setupWebSocket();
      
    } catch (err) {
      console.error('Chart initialization error:', err);
      setError(`Failed to load ${currentSymbol}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentSymbol, 
    config.interval, 
    config.limit, 
    chartVersion, 
    token, 
    authState.hasValidToken,
    authState.isLoadingAuth,
    initializeChart,
    chartCleanup,
    setupWebSocket,
    updateChartWithData
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
  }, [initializeChartLifecycle]);

  const lifecycleState: LifecycleState = {
    chartContainerRef,
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
    setError,
    setIsLoading,
    setLastUpdateTime,
    setIsChartReady
  };

  return <>{children(lifecycleState)}</>;
}