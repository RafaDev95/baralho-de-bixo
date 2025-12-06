'use client';

import { useParams, useRouter } from 'next/navigation';
import { PlayerDetail } from '../../../../components/players/player-detail';
import { Button } from '../../../../components/ui/button';

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = Number.parseInt(params.id as string, 10);

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/players')}
        className="mb-4"
      >
        ← Back to players
      </Button>
      <PlayerDetail playerId={playerId} />
    </div>
  );
}

