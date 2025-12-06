'use client';

import { useGameRoomsList } from '../../hooks/game-rooms/use-game-rooms-list';
import { RoomItem } from './room-item';
import { Button } from '../ui/button';

interface RoomsListProps {
  onRoomClick?: (roomId: number) => void;
  onCreateRoom?: () => void;
  statusFilter?: string;
}

export function RoomsList({
  onRoomClick,
  onCreateRoom,
  statusFilter,
}: RoomsListProps) {
  const {
    data: rooms,
    isLoading,
    error,
    refetch,
  } = useGameRoomsList({
    status: statusFilter,
    includePlayers: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive">Failed to load rooms</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-muted-foreground">No rooms found</p>
        {onCreateRoom && <Button onClick={onCreateRoom}>Create Room</Button>}
      </div>
    );
  }

  const waitingRooms = rooms.filter((r) => r.status === 'waiting');

  return (
    <div className="space-y-4">
      {onCreateRoom && (
        <div className="flex justify-end">
          <Button onClick={onCreateRoom}>Create New Room</Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            onView={() => onRoomClick?.(room.id)}
            onJoin={
              room.status === 'waiting' && waitingRooms.includes(room)
                ? () => onRoomClick?.(room.id)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
