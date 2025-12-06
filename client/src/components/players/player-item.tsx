import { Card as UICard, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Player } from '../../types/players';

interface PlayerItemProps {
  player: Player;
  onClick?: () => void;
}

export function PlayerItem({ player, onClick }: PlayerItemProps) {
  return (
    <UICard
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{player.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">{player.email}</p>
          <div className="flex gap-4">
            <div>
              <span className="font-semibold">Rank:</span> {player.rank}
            </div>
            <div>
              <span className="font-semibold">Balance:</span> {player.balance}
            </div>
          </div>
        </div>
      </CardContent>
    </UICard>
  );
}
