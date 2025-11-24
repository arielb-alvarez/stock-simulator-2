// Export RSI indicators
export { registerRSIIndicator } from './RSI';

// Export Volume indicators  
export { registerCustomVolumeIndicator } from './Volume';

// Export the updated moving average functions
export {
  registerCustomMAIndicator,
  registerCustomEMAIndicator,
  registerCustomWMAIndicator,
  getCurrentIndicatorNames,
  cleanupIndicator
} from './MovingAverages';