'use client';

import { usePlayerById } from '../../hooks/players/use-player-by-id';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PlayerProfileProps {
  playerId: number;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const { data: player, isLoading, error } = usePlayerById(playerId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !player) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load player profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{player.username}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Email</h3>
          <p className="text-muted-foreground">{player.email}</p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Statistics</h3>
          <div className="space-y-2">
            <p>
              <strong>Rank:</strong> {player.rank}
            </p>
            <p>
              <strong>Balance:</strong> {player.balance}
            </p>
            <p>
              <strong>Member since:</strong>{' '}
              {new Date(player.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
