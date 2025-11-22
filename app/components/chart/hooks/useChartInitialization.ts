import { useRef, useCallback } from 'react';
import { init, dispose } from 'klinecharts';

export const useChartInitialization = (chartContainerRef: React.RefObject<HTMLDivElement>) => {
  const chartRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return null;

    try {
      const chart = init(chartContainerRef.current, {});
      
      if (!chart) {
        throw new Error('Chart initialization returned null');
      }

      // Set up resize observer
      const handleResize = () => {
        chart.resize();
      };

      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartContainerRef.current);

      return chart;
    } catch (error) {
      console.error('Error initializing chart:', error);
      return null;
    }
  }, [chartContainerRef]);

  const cleanup = useCallback(() => {
    if (resizeObserverRef.current && chartContainerRef.current) {
      resizeObserverRef.current.unobserve(chartContainerRef.current);
      resizeObserverRef.current = null;
    }

    if (chartContainerRef.current) {
      try {
        dispose(chartContainerRef.current);
        chartRef.current = null;
      } catch (error) {
        console.warn('Error during chart disposal:', error);
      }
    }
  }, [chartContainerRef]);

  return {
    chartRef,
    initializeChart,
    cleanup
  };
};