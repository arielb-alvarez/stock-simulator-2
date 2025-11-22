'use client';
import { ChartContainerRef } from './types/chart';
import DrawingTools from './DrawingTools';

interface ChartProps {
  chartContainerRef: ChartContainerRef;
  isLoading: boolean;
  error: string | null;
  lastUpdateTime: number;
  activeDrawingTool: string;
  onDrawingToolSelect: (tool: string) => void;
  onForceRefresh: () => void;
}

export default function Chart({
  chartContainerRef,
  isLoading,
  error,
  lastUpdateTime,
  activeDrawingTool,
  onDrawingToolSelect,
  onForceRefresh
}: ChartProps) {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Drawing Tools */}
      {/* <DrawingTools 
        onToolSelect={onDrawingToolSelect}
        activeTool={activeDrawingTool}
      /> */}
      
      {/* Loading and Error States */}
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
      
      {/* Main Chart container */}
      <div 
        ref={chartContainerRef} 
        className="w-full h-full bg-gray-900 rounded-lg"
      />
      
      {/* Last update time */}
      {lastUpdateTime > 0 && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}