// components/chart/Chart.tsx
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cryptoService } from '@/services/cryptoService';
import { tradeService } from '@/services/tradeService';
import { useChart } from '@/hooks/routes/charts/useChart';
import { useWebSocket } from '@/hooks/routes/charts/useWebSocket';
import { useIndicators } from '@/hooks/routes/charts/useIndicators';
import { useIndicatorSetup } from '@/hooks/routes/charts/useIndicatorSetup';
import { useDrawingTools } from '@/hooks/routes/charts/useDrawingTools';
import { useGlobalContext } from '@/context/GlobalContext';
import DrawingTools from './DrawingTools';
import ChartStatus from './ChartStatus';

export default function MainChart() {
  const { config, updateConfig } = useGlobalContext();
  const searchParams = useSearchParams();

  // Read symbol and token from query parameters
  const symbolFromQuery = searchParams?.get('symbol') || 'BTCUSDT';
  const token = searchParams?.get('token') || null;
  const currentSymbol = symbolFromQuery.toUpperCase();

  // State to track symbol changes and chart loading
  const [previousSymbol, setPreviousSymbol] = useState(currentSymbol);
  const [chartVersion, setChartVersion] = useState(0);
  const [isChartReady, setIsChartReady] = useState(false);

  // State for authentication status
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasValidToken, setHasValidToken] = useState<boolean | null>(null);

  // Refs for cleanup and tracking
  const cleanupRequestedRef = useRef(false);
  const chartInstanceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isInitializingRef = useRef(false);
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

  const { registerAllIndicators } = useIndicators();
  const {
    setupRSIIndicators,
    setupMFIIndicators,
    setupVolumeIndicators,
    setupKDJIndicators,
    setupEMVIndicators,
    setupMTMIndicators,
    setupMovingAverageOverlays,
    applyChartStyles,
  } = useIndicatorSetup();

  const { activeDrawingTool, handleDrawingToolSelect } = useDrawingTools(chartRef);

  // Function to validate token using tradeService
  const validateToken = useCallback(async () => {
    if (!token) {
      setHasValidToken(null); // No token means public access
      setAuthError(null);
      return;
    }

    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      // Use the tradeService to validate token (fetch just 1 trade to check auth)
      await tradeService.getTradeHistory(
        token,
        currentSymbol, // Use current symbol for validation
        1, // page
        1 // limit - just need to check if auth works
      );

      // If we get here without error, token is valid
      setHasValidToken(true);
    } catch (err) {
      console.error('Token validation error:', err);
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
      setHasValidToken(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }, [token, currentSymbol]);

  // Effect to validate token when it changes
  useEffect(() => {
    validateToken();
  }, [token, currentSymbol, validateToken]);

  // Safe cleanup function
  const performCleanup = useCallback(() => {
    console.log('Performing cleanup...');

    // Set flag to prevent any further operations on the chart
    isChartReadyRef.current = false;

    // Clean up resize observer
    if (resizeObserverRef.current) {
      try {
        if (chartContainerRef.current) {
          resizeObserverRef.current.unobserve(chartContainerRef.current);
        }
      } catch (e) {
        console.warn('Error unobserving resize observer:', e);
      }
      resizeObserverRef.current = null;
    }

    // Clean up chart instance
    if (chartInstanceRef.current) {
      try {
        // Don't call destroy() directly - let klinecharts dispose handle it
        chartInstanceRef.current = null;
      } catch (e) {
        console.warn('Error clearing chart instance:', e);
      }
    }

    // Clean up via chartCleanup (dispose)
    try {
      // Only call chartCleanup if container exists
      if (chartContainerRef.current) {
        chartCleanup();
      } else {
        console.log('Chart container not available for cleanup');
      }
    } catch (e) {
      console.warn('Error in chartCleanup:', e);
    }

    // Clear refs
    chartRef.current = null;

    cleanupRequestedRef.current = false;
  }, [chartCleanup, chartContainerRef, chartRef]);

  // Ref for tracking chart readiness
  const isChartReadyRef = useRef(false);

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

  // Register all custom indicators
  useEffect(() => {
    registerAllIndicators();
  }, [registerAllIndicators]);

  // Main initialization effect - only run if token is valid or no token
  useEffect(() => {
    // Don't initialize chart if we have a token and it's invalid
    if (token && hasValidToken === false) {
      // Clean up any existing chart
      performCleanup();
      return;
    }

    let mounted = true;
    mountedRef.current = true;
    cleanupRequestedRef.current = false;
    isInitializingRef.current = true;
    isChartReadyRef.current = false;

    const initChart = async () => {
      if (!mounted || cleanupRequestedRef.current) return;

      console.log(`Initializing chart for ${currentSymbol} (version: ${chartVersion})`);
      setIsLoading(true);
      setError(null);
      setIsChartReady(false);

      try {
        // Clean up any existing chart
        performCleanup();

        // Check if container exists
        if (!chartContainerRef.current) {
          console.warn('Chart container not found');
          return;
        }

        // Initialize new chart
        const chartInstance = initializeChart();
        if (!chartInstance) throw new Error('Chart initialization failed');

        // Store chart instance for cleanup
        chartInstanceRef.current = chartInstance;
        chartRef.current = chartInstance;

        // Setup resize observer
        resizeObserverRef.current = new ResizeObserver(() => {
          if (chartInstance && mounted) {
            chartInstance.resize();
          }
        });

        if (chartContainerRef.current) {
          resizeObserverRef.current.observe(chartContainerRef.current);
        }

        // Fetch data with current symbol
        console.log(`Fetching data for ${currentSymbol}...`);
        const candlestickData = await cryptoService.getHistoricalData(
          currentSymbol,
          config.interval,
          config.limit
        );

        if (!mounted || cleanupRequestedRef.current) return;

        if (candlestickData.length === 0) {
          throw new Error(`No data available for ${currentSymbol}`);
        }

        console.log(`Received ${candlestickData.length} candles for ${currentSymbol}`);

        // Update data reference
        currentDataRef.current = candlestickData;

        // Update chart with data
        updateChartWithData(chartInstance, candlestickData, false);

        // Apply styles and indicators
        applyChartStyles(chartInstance);

        // Setup indicators with delays to ensure chart is ready
        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupRSIIndicators(chartInstance);
          }
        }, 100);

        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupMFIIndicators(chartInstance);
          }
        }, 150);

        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupVolumeIndicators(chartInstance);
          }
        }, 200);

        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupMovingAverageOverlays(chartInstance);
          }
        }, 250);

        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupKDJIndicators(chartInstance);
          }
        }, 175);

        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupEMVIndicators(chartInstance);
          }
        }, 225);

        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current && chartRef.current) {
            setupMTMIndicators(chartInstance);
          }
        }, 125);

        // Mark chart as ready after a delay
        setTimeout(() => {
          if (mounted && !cleanupRequestedRef.current) {
            setIsChartReady(true);
            isChartReadyRef.current = true;
          }
        }, 300);

        // Setup WebSocket
        setupWebSocket();

      } catch (err) {
        if (!mounted || cleanupRequestedRef.current) return;

        console.error('Chart initialization error:', err);
        setError(`Failed to load ${currentSymbol}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        if (mounted && !cleanupRequestedRef.current) {
          setIsLoading(false);
          isInitializingRef.current = false;
        }
      }
    };

    // Small delay to ensure cleanup completes
    const timer = setTimeout(() => {
      initChart();
    }, 100);

    return () => {
      console.log('Cleanup requested for chart effect');
      mounted = false;
      mountedRef.current = false;
      cleanupRequestedRef.current = true;
      clearTimeout(timer);

      // Don't perform cleanup here - let the next initialization handle it
      // This prevents the disposal error
    };
  }, [
    currentSymbol,
    config.interval,
    config.limit,
    chartVersion,
    token,
    hasValidToken,
  ]);

  // Effect for overlay indicator changes (MA, EMA, WMA, BB, VWAP, SAR)
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;

    console.log('Overlay configuration changed, updating indicators...');

    const updateOverlayIndicators = () => {
      try {
        setupMovingAverageOverlays(chartRef.current);

        // Force a complete chart refresh to ensure indicators are recalculated
        setTimeout(() => {
          if (chartRef.current && currentDataRef.current.length > 0) {
            updateChartWithData(chartRef.current, currentDataRef.current, false);
            chartRef.current.resize();
          }
        }, 150);
      } catch (error) {
        console.error('Error updating overlay indicators:', error);
      }
    };

    const timer = setTimeout(updateOverlayIndicators, 50);
    return () => clearTimeout(timer);
  }, [
    config.indicators.ma,
    config.indicators.ema,
    config.indicators.wma,
    config.indicators.avl,
    config.indicators.bb,
    config.indicators.vwap,
    config.indicators.sar,
    config.indicators.trix,
    config.indicators.supertrend,
    setupMovingAverageOverlays,
    isChartReady
  ]);

  // Effect for RSI indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;

    const updateRSIIndicators = async () => {
      try {
        setupRSIIndicators(chartRef.current);

        // Force complete refresh
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating RSI indicators:', error);
      }
    };

    const timer = setTimeout(updateRSIIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.rsi, setupRSIIndicators, isChartReady]);

  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;

    const updateMFIIndicators = async () => {
      try {
        setupMFIIndicators(chartRef.current);

        // Force complete refresh
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating MFI indicators:', error);
      }
    };

    const timer = setTimeout(updateMFIIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.mfi, setupMFIIndicators, isChartReady]);

  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;

    const updateKDJIndicators = async () => {
      try {
        setupKDJIndicators(chartRef.current);

        // Force complete refresh
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating KDJ indicators:', error);
      }
    };

    const timer = setTimeout(updateKDJIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.kdj, setupKDJIndicators, isChartReady]);

  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;

    const updateEMVIndicators = async () => {
      try {
        setupEMVIndicators(chartRef.current);

        // Force complete refresh
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating EMV indicators:', error);
      }
    };

    const timer = setTimeout(updateEMVIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.emv, setupEMVIndicators, isChartReady]);

  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length || !isChartReady) return;

    const updateMTMIndicators = async () => {
      try {
        setupMTMIndicators(chartRef.current);

        // Force complete refresh
        setTimeout(() => {
          chartRef.current?.resize();
        }, 50);
      } catch (error) {
        console.error('Error updating MTM indicators:', error);
      }
    };

    const timer = setTimeout(updateMTMIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.mtm, setupMTMIndicators, isChartReady]);

  // Effect for Volume indicator changes
  useEffect(() => {
    if (!chartRef.current || !isChartReady) {
      console.log('Chart not ready for volume update');
      return;
    }

    const updateVolumeIndicators = () => {
      try {
        setupVolumeIndicators(chartRef.current);

        // Force complete chart refresh
        setTimeout(() => {
          if (chartRef.current && currentDataRef.current.length > 0) {
            updateChartWithData(chartRef.current, currentDataRef.current, false);
            chartRef.current.resize();
          }
        }, 100);
      } catch (error) {
        console.error('Error updating volume indicators:', error);
      }
    };

    const timer = setTimeout(updateVolumeIndicators, 50);
    return () => clearTimeout(timer);
  }, [config.indicators.volume, setupVolumeIndicators, isChartReady]);

  // Effect for chart style changes
  useEffect(() => {
    if (!chartRef.current || !isChartReady) return;

    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 100);

    return () => clearTimeout(timer);
  }, [config.chart, applyChartStyles, isChartReady]);

  // Don't show ChartStatus when token is invalid
  const shouldShowChartStatus = () => {
    // Don't show chart status when:
    // 1. We're loading authentication
    // 2. There's an authentication error
    // 3. Token exists but is invalid
    if (isLoadingAuth || authError || (token && hasValidToken === false)) {
      return false;
    }
    return true;
  };

  // Render authentication error message
  const renderAuthError = () => {
    let errorMessage = authError || 'Authentication failed';

    // Provide more user-friendly messages for common errors
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Invalid or expired authentication token.';
    } else if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
      errorMessage = 'Network error. Please check your connection.';
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">🔒</div>
          <h2 className="text-white text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-300 mb-4">{errorMessage}</p>
          <div className="text-gray-400 text-sm mt-4">
            <p>Please provide a valid authentication token to view the chart.</p>
            <p className="mt-2">Current symbol: <span className="text-blue-400">{currentSymbol}</span></p>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state for authentication
  const renderAuthLoading = () => {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
        <div className="text-white text-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Verifying authentication...</p>
        </div>
      </div>
    );
  };

  // Render the chart
  const renderChart = () => {
    return (
      <div className="w-full h-full relative">
        <div
          key={`chart-${currentSymbol}-${chartVersion}`}
          ref={chartContainerRef}
          className="w-full h-full bg-gray-900 rounded-lg absolute inset-0"
        />
        <DrawingTools
          onToolSelect={handleDrawingToolSelect}
          activeTool={activeDrawingTool}
        />
      </div>
    );
  };

  // Main render logic
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Show ChartStatus only when authentication is valid */}
      {shouldShowChartStatus() && (
        <ChartStatus
          isLoading={isLoading}
          error={error}
          lastUpdateTime={lastUpdateTime}
        />
      )}

      {/* Conditional rendering based on authentication status */}
      {isLoadingAuth && renderAuthLoading()}
      {!isLoadingAuth && token && hasValidToken === false && renderAuthError()}
      {!isLoadingAuth && (!token || hasValidToken === true) && (
        <div className="flex-1 relative min-h-0">
          {renderChart()}
        </div>
      )}
    </div>
  );
}