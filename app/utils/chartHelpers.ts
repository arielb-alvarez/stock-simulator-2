// utils/chartHelpers.ts
import { KLineData } from 'klinecharts';
import { CryptoData } from '@/services/cryptoService';

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
    localStorage.setItem('active-tool', tool);
  } catch (error) {
    console.error('Error saving active tool to localStorage:', error);
  }
};