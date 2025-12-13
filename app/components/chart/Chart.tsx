// components/chart/Chart.tsx
'use client';
import { useEffect, useRef } from 'react';
import { cryptoService } from '@/services/cryptoService';
import { useChart } from '@/hooks/useChart';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useIndicators } from '@/hooks/useIndicators';
import { useIndicatorSetup } from '@/hooks/useIndicatorSetup';
import { useDrawingTools } from '@/hooks/useDrawingTools';
import { useGlobalContext } from '@/context/GlobalContext';
import DrawingTools from './DrawingTools';
import ChartStatus from './ChartStatus';

export default function MainChart() {
  const { config } = useGlobalContext();
  
  const {
    chartContainerRef,
    chartRef,
    isLoading,
    error,
    lastUpdateTime,
    chartKey,
    currentDataRef,
    setIsLoading,
    setError,
    setLastUpdateTime,
    initializeChart,
    updateChartWithData,
    cleanup,
  } = useChart();

  const { setupWebSocket } = useWebSocket(
    chartRef,
    currentDataRef,
    config,
    setLastUpdateTime,
    setError,
    updateChartWithData
  );

  const { registerAllIndicators } = useIndicators();
  const {
    setupRSIIndicators,
    setupVolumeIndicators,
    setupMovingAverageOverlays,
    applyChartStyles,
  } = useIndicatorSetup();

  const { activeDrawingTool, handleDrawingToolSelect } = useDrawingTools(chartRef);

  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Register all custom indicators
  useEffect(() => {
    registerAllIndicators();
  }, [registerAllIndicators]);

  // Main initialization effect
  useEffect(() => {
    let mounted = true;
    let chartInstance: any = null;

    const initializeChartAndData = async () => {
      if (!mounted) return;

      setIsLoading(true);
      setError(null);

      try {
        chartInstance = initializeChart();
        if (!chartInstance) {
          throw new Error('Chart initialization failed');
        }

        chartRef.current = chartInstance;

        // Set up resize observer
        const handleResize = () => {
          chartInstance.resize();
        };

        resizeObserverRef.current = new ResizeObserver(handleResize);
        if (chartContainerRef.current) {
          resizeObserverRef.current.observe(chartContainerRef.current);
        }

        const candlestickData = await cryptoService.getHistoricalData(
          config.symbol,
          config.interval,
          config.limit
        );

        if (!mounted) return;
        
        if (candlestickData.length === 0) {
          setError('No data received from API');
          return;
        }

        currentDataRef.current = candlestickData;

        updateChartWithData(chartInstance, candlestickData, false);
        
        // Apply styles and setup indicators
        applyChartStyles(chartInstance);
        setupRSIIndicators(chartInstance);
        setupMovingAverageOverlays(chartInstance);
        
        // Give a small delay before setting up volume to ensure chart is ready
        setTimeout(() => {
          if (mounted && chartInstance) {
            setupVolumeIndicators(chartInstance);
          }
        }, 100);
        
        setupWebSocket();

      } catch (err) {
        if (!mounted) return;
        
        console.error('Error in chart initialization:', err);
        setError(`Failed to initialize chart: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeChartAndData();

    return () => {
      mounted = false;
      
      if (resizeObserverRef.current && chartContainerRef.current) {
        resizeObserverRef.current.unobserve(chartContainerRef.current);
        resizeObserverRef.current = null;
      }
      
      cleanup();
    };
  }, [
    config.symbol, 
    config.interval, 
    config.limit,
    chartKey
  ]);

  // Effect for overlay indicator changes (MA, EMA, WMA, BB, VWAP, SAR)
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length) return;
    
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
    setupMovingAverageOverlays
  ]);

  // Effect for RSI indicator changes
  useEffect(() => {
    if (!chartRef.current || !currentDataRef.current.length) return;
    
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
  }, [config.indicators.rsi, setupRSIIndicators]);

  // Effect for Volume indicator changes
  useEffect(() => {
    if (!chartRef.current) {
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
  }, [config.indicators.volume, setupVolumeIndicators]);

  // Effect for chart style changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const timer = setTimeout(() => {
      applyChartStyles(chartRef.current);
    }, 100);

    return () => clearTimeout(timer);
  }, [config.chart, applyChartStyles]);

  return (
    <div className="w-full h-full flex flex-col relative">
      <ChartStatus 
        isLoading={isLoading}
        error={error}
        lastUpdateTime={lastUpdateTime}
      />
      
      {/* Main Chart container */}
      <div 
        key={chartKey}
        ref={chartContainerRef} 
        className="w-full h-full bg-gray-900 rounded-lg"
      />
      
      {/* <DrawingTools 
        activeTool={activeDrawingTool}
        onToolSelect={handleDrawingToolSelect}
      /> */}
    </div>
  );
}