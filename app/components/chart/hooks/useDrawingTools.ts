import { useState, useCallback, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { getStoredActiveTool, saveActiveTool } from '../utils/localStorage';

export const useDrawingTools = (chartRef: any) => {
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>(() => getStoredActiveTool());
  const { toggleRSI, toggleVolume, toggleMA, toggleEMA, toggleWMA } = useGlobalContext();

  // Save active tool to localStorage whenever it changes
  useEffect(() => {
    saveActiveTool(activeDrawingTool);
  }, [activeDrawingTool]);

  const handleDrawingToolSelect = useCallback((tool: string) => {
    setActiveDrawingTool(tool);

    if (tool === 'rsi') {
      return;
    }

    if (tool.startsWith('rsi-toggle-')) {
      const rsiId = tool.replace('rsi-toggle-', '');
      toggleRSI(rsiId);
      return;
    }

    if (tool.startsWith('volume-toggle-')) {
      const volumeId = tool.replace('volume-toggle-', '');
      toggleVolume(volumeId);
      return;
    }

    if (tool.startsWith('ma-toggle-')) {
      const maId = tool.replace('ma-toggle-', '');
      toggleMA(maId);
      return;
    }

    if (tool.startsWith('ema-toggle-')) {
      const emaId = tool.replace('ema-toggle-', '');
      toggleEMA(emaId);
      return;
    }

    if (tool.startsWith('wma-toggle-')) {
      const wmaId = tool.replace('wma-toggle-', '');
      toggleWMA(wmaId);
      return;
    }
    
    if (chartRef.current) {
      try {
        switch (tool) {
          case 'horizontalLine':
            chartRef.current.createOverlay('horizontalStraightLine');
            break;
          case 'verticalLine':
            chartRef.current.createOverlay('verticalStraightLine');
            break;
          case 'trendLine':
            chartRef.current.createOverlay('straightLine');
            break;
          case 'fibonacci':
            chartRef.current.createOverlay('fibonacciLine');
            break;
          case 'rectangle':
            chartRef.current.createOverlay('rect');
            break;
          case 'circle':
            chartRef.current.createOverlay('circle');
            break;
          default:
            chartRef.current.overrideOverlay(null);
            break;
        }
      } catch (error) {
        console.warn('Error creating overlay:', error);
      }
    }
  }, [toggleRSI, toggleVolume, toggleMA, toggleEMA, toggleWMA, chartRef]);

  return {
    activeDrawingTool,
    handleDrawingToolSelect
  };
};