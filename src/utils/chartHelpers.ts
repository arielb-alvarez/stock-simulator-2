// utils/chartHelpers.ts
import { KLineData } from 'klinecharts';
import { CryptoData } from '@/services/cryptoService';
import { TDataTradingCandles } from '@/types/services/dev-coin-user/types.candles';

// Convert new trading candles format to KLineData
export const convertTradingCandlesToKLineData = (tradingCandles: TDataTradingCandles[]): KLineData[] => {
  return tradingCandles.map(item => ({
    timestamp: item.timestamp,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    turnover: item.volume * item.close, // Calculate turnover from volume and close
  }));
};

// Keep existing function for CryptoData
export const convertToKLineData = (cryptoData: CryptoData[]): KLineData[] => {
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

// Helper function to get active tool from localStorage
export const getStoredActiveTool = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('active-tool') || '';
  } catch (error) {
    console.error('Error loading active tool from localStorage:', error);
    return '';
  }
};

// Helper function to save active tool to localStorage
export const saveActiveTool = (tool: string): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('active-tool', tool);
  } catch (error) {
    console.error('Error saving active tool to localStorage:', error);
  }
};