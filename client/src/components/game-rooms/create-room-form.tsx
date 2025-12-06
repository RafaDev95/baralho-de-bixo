'use client';

import { useState } from 'react';
import { useGameRoomCreate } from '../../hooks/game-rooms/use-game-room-create';
import { useAuth } from '../../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';

interface CreateRoomFormProps {
  onClose?: () => void;
}

export function CreateRoomForm({ onClose }: CreateRoomFormProps) {
  const router = useRouter();
  const { player } = useAuth();
  const createMutation = useGameRoomCreate();
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }

    if (!player) {
      setError('You must be logged in to create a room');
      return;
    }

    createMutation.mutate(
      {
        name: roomName,
        max_players: maxPlayers,
        created_by: player.id,
      },
      {
        onSuccess: (room) => {
          router.push(`/rooms/${room.id}`);
        },
        onError: (error: Error) => {
          setError(error.message || 'Failed to create room');
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Room</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Max Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              min="2"
              max="4"
              value={maxPlayers}
              onChange={(e) =>
                setMaxPlayers(Number.parseInt(e.target.value, 10))
              }
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Room'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
