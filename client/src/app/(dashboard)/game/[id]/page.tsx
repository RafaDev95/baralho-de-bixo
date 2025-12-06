'use client';

import { useParams, useRouter } from 'next/navigation';
import { GameBoard } from '../../../../components/game/game-board';
import { useGameEnd } from '../../../../hooks/game-sessions/use-game-end';
import { Button } from '../../../../components/ui/button';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number.parseInt(params.id as string, 10);
  const endGameMutation = useGameEnd(gameId);

  const handleConcede = () => {
    if (confirm('Are you sure you want to concede?')) {
      endGameMutation.mutate(
        {},
        {
          onSuccess: () => {
            router.push('/dashboard');
          },
        }
      );
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="mb-4 flex justify-end">
          <Button variant="destructive" onClick={handleConcede}>
            Concede
          </Button>
        </div>
        <GameBoard gameId={gameId} />
      </div>
    </div>
  );
}
