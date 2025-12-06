'use client';

import { useRouter } from 'next/navigation';
import { PlayersList } from '../../../components/players/players-list';

export default function PlayersPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Players</h1>
        <p className="text-muted-foreground">
          Browse all players in the game
        </p>
      </div>
      <PlayersList onPlayerClick={(playerId) => router.push(`/players/${playerId}`)} />
    </div>
  );
}
