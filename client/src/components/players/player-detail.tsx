'use client';

import { usePlayerById } from '../../hooks/players/use-player-by-id';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Trophy, Coins, Mail, User } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useDecksList } from '../../hooks/decks/use-decks-list';
import { DecksList } from '../decks/decks-list';

interface PlayerDetailProps {
  playerId: number;
}

export function PlayerDetail({ playerId }: PlayerDetailProps) {
  const { data: player, isLoading, error } = usePlayerById(playerId);
  const { data: decks } = useDecksList();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-20 w-full" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !player) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load player details</AlertDescription>
      </Alert>
    );
  }

  const initials = player.username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const playerDecks = decks?.filter((deck) => deck.player_id === player.id) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{player.username}</CardTitle>
              <CardDescription>Player ID: {player.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{player.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">
                    {player.username}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Balance</p>
                  <p className="text-sm text-muted-foreground">
                    {player.balance} coins
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rank</p>
                  <Badge variant="secondary" className="mt-1">
                    #{player.rank}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground">
            Member since:{' '}
            {new Date(player.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {playerDecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Decks</CardTitle>
            <CardDescription>
              Decks created by {player.username}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DecksList decks={playerDecks} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

