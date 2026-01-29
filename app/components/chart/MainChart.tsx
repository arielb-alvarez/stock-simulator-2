'use client';
import { useSearchParams } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import ChartAuth from './ChartAuth';
import ChartLifecycle from './ChartLifecycle';
import ChartRenderer from './ChartRenderer';

export default function MainChart() {
  const { config, updateConfig } = useGlobalContext();
  const searchParams = useSearchParams();

  // Read symbol and token from query parameters
  const symbolFromQuery = searchParams?.get('symbol') || 'BTCUSDT';
  const token = searchParams?.get('token') || null;
  const currentSymbol = symbolFromQuery.toUpperCase();

  return (
    <ChartAuth
      token={token}
      currentSymbol={currentSymbol}
    >
      {(authState) => (
        <ChartLifecycle
          currentSymbol={currentSymbol}
          token={token}
          config={config}
          updateConfig={updateConfig}
          authState={authState}
        >
          {(lifecycleState) => (
            <ChartRenderer
              lifecycleState={lifecycleState}
              currentSymbol={currentSymbol}
              token={token}
              authState={authState}
            />
          )}
        </ChartLifecycle>
      )}
    </ChartAuth>
  );
}