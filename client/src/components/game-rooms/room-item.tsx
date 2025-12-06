import { Card as UICard, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { GameRoom } from '../../types/game-rooms';

interface RoomItemProps {
  room: GameRoom;
  onJoin?: () => void;
  onView?: () => void;
}

export function RoomItem({ room, onJoin, onView }: RoomItemProps) {
  const statusColors = {
    waiting: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    finished: 'bg-green-500/10 text-green-600 dark:text-green-400',
    cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  return (
    <UICard className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{room.name}</CardTitle>
          <span
            className={`rounded px-2 py-1 text-xs ${statusColors[room.status]}`}
          >
            {room.status.replace('_', ' ')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Players: {room.current_players} / {room.max_players}
          </p>
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={onView}>
                View
              </Button>
            )}
            {onJoin && room.status === 'waiting' && (
              <Button size="sm" onClick={onJoin}>
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </UICard>
  );
}
