'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Trophy, Coins } from 'lucide-react';
import type { Player } from '../../types/auth';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
}

export function PlayerCard({ player, onClick }: PlayerCardProps) {
  const initials = player.username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className={onClick ? 'cursor-pointer transition-all hover:shadow-lg hover:scale-105' : ''}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{player.username}</CardTitle>
            <p className="text-sm text-muted-foreground">{player.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{player.balance}</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            #{player.rank}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

