// hooks/usePinnedTimeFrames.ts
import { useState, useEffect } from 'react';

const ALL_TIME_FRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
  { label: '1M', value: '1M' },
];

export const usePinnedTimeFrames = (currentInterval: string) => {
  const [pinnedTimeFrames, setPinnedTimeFrames] = useState<string[]>(['15m', '1h', '4h', '1d', '1w']);

  useEffect(() => {
    const loadPinnedTimeFrames = () => {
      try {
        const stored = sessionStorage.getItem('pinned-timeframes');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setPinnedTimeFrames(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading pinned timeframes');
      }
    };

    loadPinnedTimeFrames();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('pinned-timeframes', JSON.stringify(pinnedTimeFrames));
  }, [pinnedTimeFrames]);

  const isCurrentTimeFramePinned = pinnedTimeFrames.includes(currentInterval);

  const getDisplayTimeFrames = () => {
    return ALL_TIME_FRAMES.filter(tf => pinnedTimeFrames.includes(tf.value));
  };

  const getAvailableTimeFrames = () => {
    return ALL_TIME_FRAMES.filter(tf => !pinnedTimeFrames.includes(tf.value));
  };

  const togglePinnedTimeFrame = (timeFrame: string) => {
    setPinnedTimeFrames(prev => 
      prev.includes(timeFrame) 
        ? prev.filter(tf => tf !== timeFrame)
        : [...prev, timeFrame]
    );
  };

  return {
    pinnedTimeFrames,
    isCurrentTimeFramePinned,
    getDisplayTimeFrames,
    getAvailableTimeFrames,
    togglePinnedTimeFrame
  };
};