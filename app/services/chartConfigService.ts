// services/chartConfigService.ts
export const ChartConfigService = {
  savePinnedTimeFrames(timeFrames: string[]): void {
    try {
      localStorage.setItem('pinned-timeframes', JSON.stringify(timeFrames));
    } catch (error) {
      console.error('Error saving pinned timeframes');
    }
  },

  loadPinnedTimeFrames(): string[] {
    try {
      const stored = localStorage.getItem('pinned-timeframes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading pinned timeframes');
    }
    return ['15m', '1h', '4h', '1d', '1w'];
  },

  validateTimeFrame(timeFrame: string): boolean {
    const validTimeFrames = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];
    return validTimeFrames.includes(timeFrame);
  }
};