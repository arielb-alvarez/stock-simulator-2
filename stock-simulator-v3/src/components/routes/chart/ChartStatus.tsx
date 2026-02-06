// components/chart/ChartStatus.tsx
interface ChartStatusProps {
  isLoading: boolean;
  error: string | null;
  lastUpdateTime: number;
}

export default function ChartStatus({ isLoading, error, lastUpdateTime }: ChartStatusProps) {
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10">
          <div className="text-white text-lg">Loading chart data...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-10">
          {error}
        </div>
      )}
      
      {/* Last update time */}
      {lastUpdateTime > 0 && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
        </div>
      )}
    </>
  );
}