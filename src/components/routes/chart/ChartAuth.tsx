'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { tradeService } from '@/services/tradeService';

export interface AuthState {
  isLoadingAuth: boolean;
  authError: string | null;
  hasValidToken: boolean | null;
  token: string | null;
}

interface ChartAuthProps {
  token: string | null;
  currentSymbol: string;
  children: (authState: AuthState) => ReactNode;
}

export default function ChartAuth({ 
  token, 
  currentSymbol, 
  children 
}: ChartAuthProps) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasValidToken, setHasValidToken] = useState<boolean | null>(null);

  const validateToken = useCallback(async () => {
    if (!token) {
      setHasValidToken(null);
      setAuthError(null);
      return;
    }

    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      await tradeService.getTradeHistory(
        token,
        currentSymbol,
        1,
        1
      );
      setHasValidToken(true);
    } catch (err) {
      console.error('Token validation error:', err);
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
      setHasValidToken(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }, [token, currentSymbol]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const authState: AuthState = {
    isLoadingAuth,
    authError,
    hasValidToken,
    token
  };

  return <>{children(authState)}</>;
}