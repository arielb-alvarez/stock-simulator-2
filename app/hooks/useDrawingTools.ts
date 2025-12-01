// hooks/useDrawingTools.ts
import { useState, useCallback, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { getStoredActiveTool, saveActiveTool } from '@/utils/chartHelpers';

export const useDrawingTools = (chartRef: React.MutableRefObject<any>) => {
  const { 
    toggleRSI, 
    toggleVolume, 
    toggleMA,
    toggleEMA,
    toggleWMA,
    toggleBB,
    toggleVWAP
  } = useGlobalContext();
  
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>(() => getStoredActiveTool());

  // Save active tool to localStorage whenever it changes
  useEffect(() => {
    saveActiveTool(activeDrawingTool);
  }, [activeDrawingTool]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
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

    // Add MA toggle support
    if (tool.startsWith('ma-toggle-')) {
      const maId = tool.replace('ma-toggle-', '');
      toggleMA(maId);
      return;
    }

    // Add EMA toggle support
    if (tool.startsWith('ema-toggle-')) {
      const emaId = tool.replace('ema-toggle-', '');
      toggleEMA(emaId);
      return;
    }

    // Add WMA toggle support
    if (tool.startsWith('wma-toggle-')) {
      const wmaId = tool.replace('wma-toggle-', '');
      toggleWMA(wmaId);
      return;
    }

    if (tool.startsWith('bb-toggle-')) {
      const bbId = tool.replace('bb-toggle-', '');
      toggleBB(bbId);
      return;
    }

    if (tool.startsWith('vwap-toggle-')) {
      const vwapId = tool.replace('vwap-toggle-', '');
      toggleVWAP(vwapId);
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
  }, [chartRef, toggleRSI, toggleVolume, toggleMA, toggleEMA, toggleWMA, toggleBB, toggleVWAP]);

  return {
    activeDrawingTool,
    handleDrawingToolSelect,
  };
};