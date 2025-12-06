'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../contexts/auth-context';
import { useWebSocket } from '../hooks/websocket/use-websocket';

function WebSocketConnector() {
  const { connect } = useWebSocket();

  useEffect(() => {
    connect().catch(console.error);
  }, [connect]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketConnector />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
