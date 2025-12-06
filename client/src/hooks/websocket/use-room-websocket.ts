'use client';

import { useEffect, useCallback } from 'react';
import { websocketService } from '../../services/websocket.service';
import { useAuth } from '../../contexts/auth-context';
import type { WebSocketEvent, WebSocketEventType } from '../../types/websocket';

interface UseRoomWebSocketOptions {
  roomId: number;
  onPlayerJoined?: (event: WebSocketEvent) => void;
  onPlayerLeft?: (event: WebSocketEvent) => void;
  onReadyStatusChanged?: (event: WebSocketEvent) => void;
  onGameStarted?: (event: WebSocketEvent) => void;
  onChatMessage?: (event: WebSocketEvent) => void;
  onGameEvent?: (event: WebSocketEvent) => void;
}

export function useRoomWebSocket({
  roomId,
  onPlayerJoined,
  onPlayerLeft,
  onReadyStatusChanged,
  onGameStarted,
  onChatMessage,
  onGameEvent,
}: UseRoomWebSocketOptions) {
  const { player } = useAuth();

  useEffect(() => {
    if (!player || !websocketService.isConnected) {
      return;
    }

    // Join the room via WebSocket
    websocketService.joinRoom(roomId, player.id);

    const unsubscribers: (() => void)[] = [];

    if (onPlayerJoined) {
      unsubscribers.push(websocketService.on('player_joined', onPlayerJoined));
    }

    if (onPlayerLeft) {
      unsubscribers.push(websocketService.on('player_left', onPlayerLeft));
    }

    if (onReadyStatusChanged) {
      unsubscribers.push(
        websocketService.on('ready_status_changed', onReadyStatusChanged)
      );
    }

    if (onGameStarted) {
      unsubscribers.push(websocketService.on('game_started', onGameStarted));
    }

    if (onChatMessage) {
      unsubscribers.push(websocketService.on('chat_message', onChatMessage));
    }

    if (onGameEvent) {
      unsubscribers.push(websocketService.on('game_event', onGameEvent));
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      websocketService.leaveRoom();
    };
  }, [
    roomId,
    player,
    onPlayerJoined,
    onPlayerLeft,
    onReadyStatusChanged,
    onGameStarted,
    onChatMessage,
    onGameEvent,
  ]);

  const sendChatMessage = useCallback((message: string) => {
    websocketService.sendChatMessage(message);
  }, []);

  const updateReadyStatus = useCallback((isReady: boolean) => {
    websocketService.updateReadyStatus(isReady);
  }, []);

  return {
    sendChatMessage,
    updateReadyStatus,
  };
}
