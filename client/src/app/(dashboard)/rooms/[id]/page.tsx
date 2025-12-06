'use client';

import { useParams, useRouter } from 'next/navigation';
import { RoomLobby } from '../../../../components/game-rooms/room-lobby';
import { useGameRoomJoin } from '../../../../hooks/game-rooms/use-game-room-join';
import { useAuth } from '../../../../contexts/auth-context';
import { useGameRoomById } from '../../../../hooks/game-rooms/use-game-room-by-id';
import { useDecksList } from '../../../../hooks/decks/use-decks-list';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { player } = useAuth();
  const roomId = Number.parseInt(params.id as string, 10);
  const { data: room } = useGameRoomById(roomId, true);
  const { data: decks } = useDecksList();
  const joinMutation = useGameRoomJoin();
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const isInRoom = room?.players?.some((p) => p.player_id === player?.id);

  const handleJoin = () => {
    if (!player || !selectedDeckId) return;

    joinMutation.mutate(
      {
        roomId,
        data: {
          playerId: player.id,
          deckId: selectedDeckId,
        },
      },
      {
        onSuccess: () => {
          setShowJoinForm(false);
        },
      }
    );
  };

  if (!isInRoom && !showJoinForm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Join Room</CardTitle>
          </CardHeader>
          <CardContent>
            {decks && decks.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Deck</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedDeckId || ''}
                    onChange={(e) =>
                      setSelectedDeckId(Number.parseInt(e.target.value, 10))
                    }
                  >
                    <option value="">Choose a deck</option>
                    {decks.map((deck) => (
                      <option key={deck.id} value={deck.id}>
                        {deck.name} ({deck.card_count} cards)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleJoin}
                    disabled={!selectedDeckId || joinMutation.isPending}
                  >
                    {joinMutation.isPending ? 'Joining...' : 'Join Room'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/rooms')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You need to create a deck before joining a room.
                </p>
                <Button onClick={() => router.push('/decks')}>
                  Create Deck
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.push('/rooms')}
        className="mb-4 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to rooms
      </button>
      <RoomLobby roomId={roomId} />
    </div>
  );
}
