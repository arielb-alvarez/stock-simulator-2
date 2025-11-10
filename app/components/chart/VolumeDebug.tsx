// components/chart/VolumeDebug.tsx (optional)
'use client';
import { useGlobalContext } from '@/context/GlobalContext';

export function VolumeDebug() {
  const { config } = useGlobalContext();
  const volumeConfig = config.indicators.volume[0];

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
      <div>Volume Config:</div>
      <div>Show: {volumeConfig.show ? 'Yes' : 'No'}</div>
      <div>Up Color: <span style={{ color: volumeConfig.upColor }}>■</span> {volumeConfig.upColor}</div>
      <div>Down Color: <span style={{ color: volumeConfig.downColor }}>■</span> {volumeConfig.downColor}</div>
      <div>MA: {volumeConfig.showMA ? `Yes (${volumeConfig.maPeriod})` : 'No'}</div>
    </div>
  );
}