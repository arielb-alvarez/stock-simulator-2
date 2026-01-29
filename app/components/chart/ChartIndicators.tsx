'use client';
import { useEffect } from 'react';
import { useIndicators } from '@/hooks/useIndicators';
import { useIndicatorSetup } from '@/hooks/useIndicatorSetup';

interface ChartIndicatorsProps {
  chartRef: React.MutableRefObject<any>;
  currentDataRef: React.MutableRefObject<any[]>;
  isChartReady: boolean;
  config: any;
}

export default function ChartIndicators({
  chartRef,
  currentDataRef,
  isChartReady,
  config
}: ChartIndicatorsProps) {
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

  // Register all custom indicators
  useEffect(() => {
    registerAllIndicators();
  }, [registerAllIndicators]);

  // Setup initial indicators when chart is ready
  useEffect(() => {
    if (!chartRef.current || !isChartReady) return;

    const setupInitialIndicators = () => {
      try {
        applyChartStyles(chartRef.current);
        
        // Setup indicators with delays
        setTimeout(() => setupRSIIndicators(chartRef.current), 100);
        setTimeout(() => setupMFIIndicators(chartRef.current), 150);
        setTimeout(() => setupVolumeIndicators(chartRef.current), 200);
        setTimeout(() => setupMovingAverageOverlays(chartRef.current), 250);
        setTimeout(() => setupKDJIndicators(chartRef.current), 175);
        setTimeout(() => setupEMVIndicators(chartRef.current), 225);
        setTimeout(() => setupMTMIndicators(chartRef.current), 125);
      } catch (error) {
        console.error('Error setting up initial indicators:', error);
      }
    };

    const timer = setTimeout(setupInitialIndicators, 300);
    return () => clearTimeout(timer);
  }, [isChartReady, chartRef]);

  return null;
}