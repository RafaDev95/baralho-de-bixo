'use client';

import { useEffect, useState, useCallback } from 'react';
import { websocketService } from '../../services/websocket.service';
import type { WebSocketEvent, WebSocketEventType } from '../../types/websocket';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void)[] = [];

    const connect = async () => {
      try {
        await websocketService.connect();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Connection failed'));
        setIsConnected(false);
      }
    };

    connect();

    // Listen for connection state changes
    const handleConnected = () => setIsConnected(true);
    const handleError = (event: WebSocketEvent) => {
      if (event.type === 'error') {
        setError(new Error(event.data.message as string));
      }
    };

    unsubscribe.push(websocketService.on('connected', handleConnected));
    unsubscribe.push(websocketService.on('error', handleError));

    return () => {
      unsubscribe.forEach((fn) => fn());
    };
  }, []);

  return {
    isConnected,
    error,
    connect: () => websocketService.connect(),
    disconnect: () => websocketService.disconnect(),
  };
}
