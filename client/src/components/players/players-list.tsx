'use client';

import { useState } from 'react';
import { usePlayersList } from '../../hooks/players/use-players-list';
import { PlayerCard } from './player-card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PlayersListProps {
  onPlayerClick?: (playerId: number) => void;
}

export function PlayersList({ onPlayerClick }: PlayersListProps) {
  const { data: players, isLoading, error, refetch } = usePlayersList();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = players?.filter(
    (player) =>
      searchQuery === '' ||
      player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load players</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No players found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {filteredPlayers && filteredPlayers.length > 0 ? (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => onPlayerClick?.(player.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">
            No players match your search
          </p>
        </div>
      )}
    </div>
  );
}
