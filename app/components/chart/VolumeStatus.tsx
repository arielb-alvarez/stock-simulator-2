// components/chart/VolumeStatus.tsx
'use client';
import { useGlobalContext } from '@/context/GlobalContext';

export function VolumeStatus() {
  const { config } = useGlobalContext();
  const volumeConfig = config.indicators.volume[0];

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-20">
      <div className="font-bold mb-1">Volume Status</div>
      <div className="flex items-center gap-2 mb-1">
        <div>Visible:</div>
        <div className={`px-2 py-1 rounded ${volumeConfig.show ? 'bg-green-500' : 'bg-red-500'}`}>
          {volumeConfig.show ? 'YES' : 'NO'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div>Colors:</div>
        <div className="w-3 h-3 rounded" style={{ backgroundColor: volumeConfig.upColor }} title="Up Color"></div>
        <div className="w-3 h-3 rounded" style={{ backgroundColor: volumeConfig.downColor }} title="Down Color"></div>
      </div>
      {volumeConfig.showMA && (
        <div className="mt-1">MA: {volumeConfig.maPeriod} period</div>
      )}
    </div>
  );
}