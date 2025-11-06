// components/chart/RSIChart.tsx
'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { init, dispose, KLineData } from 'klinecharts';
import { CryptoData } from '@/services/cryptoService';

interface RSIChartProps {
  data: CryptoData[];
  height: string;
}

// Helper function to convert CryptoData to KLineData
const convertToKLineData = (cryptoData: CryptoData[]): KLineData[] => {
  return cryptoData.map(item => ({
    timestamp: item.time,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    turnover: item.volume * item.close,
  }));
};

// RSI calculation function
const calculateRSI = (data: KLineData[], period: number = 14): { timestamp: number; value: number }[] => {
  if (data.length < period + 1) {
    return data.map(item => ({ timestamp: item.timestamp, value: 50 }));
  }

  const results: { timestamp: number; value: number }[] = [];
  
  // Fill initial period with 50
  for (let i = 0; i < period; i++) {
    results.push({ timestamp: data[i].timestamp, value: 50 });
  }

  // Calculate RSI for remaining data points
  for (let i = period; i < data.length; i++) {
    let gains = 0;
    let losses = 0;

    // Calculate gains and losses for the period
    for (let j = i - period + 1; j <= i; j++) {
      const change = data[j].close - data[j - 1].close;
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) {
      results.push({ timestamp: data[i].timestamp, value: 100 });
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      results.push({ timestamp: data[i].timestamp, value: rsi });
    }
  }

  return results;
};

export default function RSIChart({ data, height }: RSIChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize RSI chart
  const initializeRSIChart = useCallback(() => {
    if (!chartContainerRef.current || chartRef.current) {
      return;
    }

    try {
      console.log('Initializing RSI chart...');
      
      const chart = init(chartContainerRef.current, {
        // Hide the main candle series
        candle: {
          type: 'area',
          line: {
            color: 'transparent',
            size: 0,
          },
          area: {
            show: false,
          },
        },
        // Grid styling
        grid: {
          horizontal: {
            color: '#2b3139',
            size: 1,
          },
          vertical: {
            color: '#2b3139',
            size: 1,
          },
        },
        // Hide x-axis
        xAxis: {
          show: false,
        },
        // Y-axis configuration for RSI (0-100)
        yAxis: {
          show: true,
          axisLine: { 
            show: true,
            color: '#2b3139' 
          },
          tickLine: { 
            show: true,
            color: '#2b3139' 
          },
          tickText: { 
            color: '#7f7f7f',
            size: 10 
          },
          minValue: 0,
          maxValue: 100,
        },
        // Technical indicator settings
        technicalIndicator: {
          margin: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        // Crosshair configuration
        crosshair: {
          show: true,
          horizontal: {
            show: true,
            line: {
              color: '#eaecef',
              size: 1,
              style: 'dashed'
            },
          },
          vertical: {
            show: true,
            line: {
              color: '#eaecef', 
              size: 1,
              style: 'dashed'
            },
          },
        },
      });

      if (chart) {
        chartRef.current = chart;
        setIsInitialized(true);
        console.log('RSI chart initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing RSI chart:', error);
    }
  }, []);

  // Update RSI data when data changes
  const updateRSIData = useCallback(() => {
    if (!chartRef.current || !data.length) return;

    try {
      const klineData = convertToKLineData(data);
      const rsiData = calculateRSI(klineData);

      // Clear existing overlays
      const existingOverlays = chartRef.current.getOverlays();
      existingOverlays.forEach((overlay: any) => {
        try {
          chartRef.current.removeOverlay(overlay.id);
        } catch (error) {
          console.warn('Error removing overlay:', error);
        }
      });

      // Apply empty data to establish time scale
      chartRef.current.applyNewData(klineData);

      // Create RSI line
      if (rsiData.length > 0) {
        chartRef.current.createOverlay({
          name: 'rsi_line',
          points: rsiData.map(item => [item.timestamp, item.value]),
          styles: {
            line: {
              color: '#ff9600',
              size: 2,
            },
          },
          lock: true,
        });

        // Create overbought line (70)
        chartRef.current.createOverlay({
          name: 'overbought',
          points: [
            [rsiData[0].timestamp, 70],
            [rsiData[rsiData.length - 1].timestamp, 70]
          ],
          styles: {
            line: {
              color: '#ff5b5a',
              size: 1,
              style: 'dashed'
            },
          },
          lock: true,
        });

        // Create oversold line (30)
        chartRef.current.createOverlay({
          name: 'oversold',
          points: [
            [rsiData[0].timestamp, 30],
            [rsiData[rsiData.length - 1].timestamp, 30]
          ],
          styles: {
            line: {
              color: '#00b15d',
              size: 1,
              style: 'dashed'
            },
          },
          lock: true,
        });

        console.log('RSI data updated:', rsiData.length, 'points');
      }
    } catch (error) {
      console.error('Error updating RSI data:', error);
    }
  }, [data]);

  // Initialize chart on mount
  useEffect(() => {
    initializeRSIChart();

    return () => {
      // Cleanup on unmount
      if (chartContainerRef.current && chartRef.current) {
        try {
          console.log('Disposing RSI chart...');
          dispose(chartContainerRef.current);
          chartRef.current = null;
          setIsInitialized(false);
        } catch (error) {
          console.warn('Error disposing RSI chart:', error);
        }
      }
    };
  }, [initializeRSIChart]);

  // Update data when chart is initialized or data changes
  useEffect(() => {
    if (isInitialized && data.length > 0) {
      updateRSIData();
    }
  }, [isInitialized, data, updateRSIData]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      if (chartContainerRef.current) {
        resizeObserver.unobserve(chartContainerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={chartContainerRef} 
      style={{ height }}
      className="w-full bg-gray-800 border-t border-gray-700"
    />
  );
}