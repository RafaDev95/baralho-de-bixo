'use client';

import { useGameRoomById } from '../../hooks/game-rooms/use-game-room-by-id';
import { useGameRoomReady } from '../../hooks/game-rooms/use-game-room-ready';
import { useGameRoomStart } from '../../hooks/game-rooms/use-game-room-start';
import { useGameRoomLeave } from '../../hooks/game-rooms/use-game-room-leave';
import { useAuth } from '../../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useRoomWebSocket } from '../../hooks/websocket/use-room-websocket';
import { useQueryClient } from '@tanstack/react-query';
import { GET_GAME_ROOM_QUERY } from '../../queryKeys/game-rooms';
import { RoomChat } from './room-chat';
import type { WebSocketEvent } from '../../types/websocket';

interface RoomLobbyProps {
  roomId: number;
}

export function RoomLobby({ roomId }: RoomLobbyProps) {
  const router = useRouter();
  const { player } = useAuth();
  const queryClient = useQueryClient();
  const { data: room, isLoading } = useGameRoomById(roomId, true);
  const readyMutation = useGameRoomReady();
  const startMutation = useGameRoomStart();
  const leaveMutation = useGameRoomLeave();

  // Set up WebSocket listeners for real-time updates
  useRoomWebSocket({
    roomId,
    onPlayerJoined: () => {
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(roomId, true),
      });
    },
    onPlayerLeft: () => {
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(roomId, true),
      });
    },
    onReadyStatusChanged: () => {
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(roomId, true),
      });
    },
    onGameStarted: (event: WebSocketEvent) => {
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(roomId, true),
      });
      router.push(`/game/${roomId}`);
    },
  });

  const handleReady = () => {
    if (!player) return;
    const currentStatus = room?.players?.find(
      (p) => p.player_id === player.id
    )?.is_ready;
    const newStatus = currentStatus === 'ready' ? 'not_ready' : 'ready';
    readyMutation.mutate({
      roomId,
      data: { isReady: newStatus },
    });
  };

  const handleStart = () => {
    startMutation.mutate(roomId, {
      onSuccess: () => {
        router.push(`/game/${roomId}`);
      },
    });
  };

  const handleLeave = () => {
    if (!player) return;
    leaveMutation.mutate(
      { roomId, playerId: player.id },
      {
        onSuccess: () => {
          router.push('/rooms');
        },
      }
    );
  };

  if (isLoading || !room) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const currentPlayer = room.players?.find((p) => p.player_id === player?.id);
  const allReady =
    room.players &&
    room.players.length >= 2 &&
    room.players.every((p) => p.is_ready === 'ready');
  const canStart =
    room.status === 'waiting' && allReady && player?.id === room.created_by;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{room.name}</CardTitle>
            <span className="rounded bg-secondary px-3 py-1 text-sm">
              {room.status.replace('_', ' ')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Players: {room.current_players} / {room.max_players}
            </p>
          </div>

          {room.players && room.players.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Players</h3>
              <div className="space-y-2">
                {room.players.map((roomPlayer) => (
                  <div
                    key={roomPlayer.id}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <p className="font-medium">
                        {roomPlayer.player?.username ||
                          `Player ${roomPlayer.player_id}`}
                      </p>
                      {roomPlayer.deck && (
                        <p className="text-sm text-muted-foreground">
                          Deck: {roomPlayer.deck.name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        roomPlayer.is_ready === 'ready'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {roomPlayer.is_ready}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {currentPlayer && room.status === 'waiting' && (
              <Button
                onClick={handleReady}
                disabled={readyMutation.isPending}
                variant={
                  currentPlayer.is_ready === 'ready' ? 'default' : 'outline'
                }
              >
                {currentPlayer.is_ready === 'ready' ? 'Not Ready' : 'Ready'}
              </Button>
            )}
            {canStart && (
              <Button onClick={handleStart} disabled={startMutation.isPending}>
                {startMutation.isPending ? 'Starting...' : 'Start Game'}
              </Button>
            )}
            <Button variant="destructive" onClick={handleLeave}>
              Leave Room
            </Button>
          </div>
        </CardContent>
      </Card>

      <RoomChat roomId={roomId} />
    </div>
  );
}
