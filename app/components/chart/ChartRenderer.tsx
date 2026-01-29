'use client';
import { useGlobalContext } from '@/context/GlobalContext';
import ChartStatus from './ChartStatus';
import DrawingTools from './DrawingTools';
import ChartIndicators from './ChartIndicators';
import ChartEffects from './ChartEffects';
import { AuthState } from './ChartAuth';
import { LifecycleState } from './ChartLifecycle';

interface ChartRendererProps {
  lifecycleState: LifecycleState;
  currentSymbol: string;
  token: string | null;
  authState: AuthState;
}

export default function ChartRenderer({
  lifecycleState,
  currentSymbol,
  token,
  authState
}: ChartRendererProps) {
  const {
    chartContainerRef,
    chartRef,
    currentDataRef,
    isLoading,
    error,
    lastUpdateTime,
    isChartReady,
    activeDrawingTool,
    handleDrawingToolSelect,
    chartVersion
  } = lifecycleState;

  const { config } = useGlobalContext();

  // Don't show ChartStatus when token is invalid
  const shouldShowChartStatus = () => {
    if (authState.isLoadingAuth || authState.authError || (token && authState.hasValidToken === false)) {
      return false;
    }
    return true;
  };

  // Render authentication error message
  const renderAuthError = () => {
    let errorMessage = authState.authError || 'Authentication failed';
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Invalid or expired authentication token.';
    } else if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">🔒</div>
          <h2 className="text-white text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-300 mb-4">{errorMessage}</p>
          <div className="text-gray-400 text-sm mt-4">
            <p>Please provide a valid authentication token to view the chart.</p>
            <p className="mt-2">Current symbol: <span className="text-blue-400">{currentSymbol}</span></p>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state for authentication
  const renderAuthLoading = () => {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
        <div className="text-white text-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Verifying authentication...</p>
        </div>
      </div>
    );
  };

  // Render the chart
  const renderChart = () => {
    return (
      <div className="w-full h-full relative">
        <div 
          key={`chart-${currentSymbol}-${chartVersion}`}
          ref={chartContainerRef} 
          className="w-full h-full bg-gray-900 rounded-lg absolute inset-0"
        />
        <DrawingTools 
          onToolSelect={handleDrawingToolSelect}
          activeTool={activeDrawingTool}
        />
        <ChartIndicators
          chartRef={chartRef}
          currentDataRef={currentDataRef}
          isChartReady={isChartReady}
          config={config}
        />
        <ChartEffects
          chartRef={chartRef}
          currentDataRef={currentDataRef}
          isChartReady={isChartReady}
          config={config}
        />
      </div>
    );
  };

  // Main render logic
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Show ChartStatus only when authentication is valid */}
      {shouldShowChartStatus() && (
        <ChartStatus 
          isLoading={isLoading}
          error={error}
          lastUpdateTime={lastUpdateTime}
        />
      )}
      
      {/* Conditional rendering based on authentication status */}
      {authState.isLoadingAuth && renderAuthLoading()}
      {!authState.isLoadingAuth && token && authState.hasValidToken === false && renderAuthError()}
      {!authState.isLoadingAuth && (!token || authState.hasValidToken === true) && (
        <div className="flex-1 relative min-h-0">
          {renderChart()}
        </div>
      )}
    </div>
  );
}