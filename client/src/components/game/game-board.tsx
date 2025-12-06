'use client';

import { useGameState } from '../../hooks/game-sessions/use-game-state';
import { useGameAction } from '../../hooks/game-sessions/use-game-action';
import { useAuth } from '../../contexts/auth-context';
import { useRoomWebSocket } from '../../hooks/websocket/use-room-websocket';
import { useQueryClient } from '@tanstack/react-query';
import { GET_GAME_STATE_QUERY } from '../../queryKeys/game-sessions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Heart, Zap, Cards, Library } from 'lucide-react';
import { Separator } from '../ui/separator';
import type { WebSocketEvent } from '../../types/websocket';

interface GameBoardProps {
  gameId: number;
}

export function GameBoard({ gameId }: GameBoardProps) {
  const { player } = useAuth();
  const queryClient = useQueryClient();
  const { data: gameState, isLoading } = useGameState(gameId);
  const actionMutation = useGameAction(gameId);

  // Set up WebSocket listener for game events
  useRoomWebSocket({
    roomId: gameState?.gameId || 0, // Use gameId as roomId for now
    onGameEvent: (event: WebSocketEvent) => {
      // Invalidate game state when game events are received
      queryClient.invalidateQueries({
        queryKey: GET_GAME_STATE_QUERY(gameId),
      });
    },
  });

  if (isLoading || !gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">Loading game...</div>
          <div className="text-sm text-muted-foreground">Preparing battlefield</div>
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(
    (p) => p.player_id === player?.id
  );
  const opponent = gameState.players.find((p) => p.player_id !== player?.id);
  const isMyTurn = gameState.currentPlayerIndex === currentPlayer?.player_index;

  const handleEndTurn = () => {
    actionMutation.mutate({ type: 'end_turn' });
  };

  const handlePlayCard = (cardId: number) => {
    actionMutation.mutate({
      type: 'play_card',
      data: { cardId },
    });
  };

  const handleAttack = (attackerId: number, targetId?: number) => {
    actionMutation.mutate({
      type: 'attack',
      data: { attackerId, targetId },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Game #{gameId}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">Turn {gameState.currentTurn}</Badge>
            <Badge variant="secondary">{gameState.phase}</Badge>
            <Badge variant="secondary">{gameState.step}</Badge>
            {isMyTurn && (
              <Badge className="bg-primary text-primary-foreground">
                Your Turn
              </Badge>
            )}
          </div>
        </div>
        {isMyTurn && (
          <Button
            onClick={handleEndTurn}
            disabled={actionMutation.isPending}
            size="lg"
          >
            {actionMutation.isPending ? 'Processing...' : 'End Turn'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opponent Area */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{opponent ? `Player ${opponent.player_id}` : 'Opponent'}</span>
              {!isMyTurn && <Badge variant="destructive">Their Turn</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Life</span>
                <span className="ml-auto text-lg font-bold">
                  {opponent?.life_total || 20}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive transition-all"
                  style={{
                    width: `${((opponent?.life_total || 20) / 20) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Energy</span>
                <span className="ml-auto text-lg font-bold">
                  {opponent?.energy || 0}/{opponent?.max_energy || 0}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${
                      ((opponent?.energy || 0) / (opponent?.max_energy || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Cards className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Hand</p>
                  <p className="text-sm font-semibold">
                    {opponent?.hand_size || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Library className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Deck</p>
                  <p className="text-sm font-semibold">
                    {opponent?.deck_size || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Player Area */}
        <Card className={`border-2 ${isMyTurn ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {currentPlayer
                  ? `You (Player ${currentPlayer.player_id})`
                  : 'You'}
              </span>
              {isMyTurn && (
                <Badge className="bg-primary text-primary-foreground">
                  Your Turn
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Life</span>
                <span className="ml-auto text-lg font-bold">
                  {currentPlayer?.life_total || 20}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive transition-all"
                  style={{
                    width: `${((currentPlayer?.life_total || 20) / 20) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Energy</span>
                <span className="ml-auto text-lg font-bold">
                  {currentPlayer?.energy || 0}/{currentPlayer?.max_energy || 0}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${
                      ((currentPlayer?.energy || 0) /
                        (currentPlayer?.max_energy || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Cards className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Hand</p>
                  <p className="text-sm font-semibold">
                    {currentPlayer?.hand_size || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Library className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Deck</p>
                  <p className="text-sm font-semibold">
                    {currentPlayer?.deck_size || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battlefield */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Battlefield</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState.cards.filter((c) => c.location === 'battlefield')
            .length === 0 ? (
            <p className="text-muted-foreground">No cards on battlefield</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {gameState.cards
                .filter((c) => c.location === 'battlefield')
                .map((card) => (
                  <Card
                    key={card.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      isMyTurn && card.controller_id === player?.id
                        ? 'border-primary'
                        : ''
                    }`}
                    onClick={() => {
                      if (isMyTurn && card.controller_id === player?.id) {
                        handleAttack(card.id);
                      }
                    }}
                  >
                    <CardContent className="p-3">
                      <p className="font-semibold text-sm mb-2">
                        Card {card.card_id}
                      </p>
                      {card.power !== null && card.toughness !== null && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-bold text-destructive">
                            {card.power}
                          </span>
                          <span>/</span>
                          <span className="font-bold text-primary">
                            {card.toughness}
                          </span>
                        </div>
                      )}
                      {card.damage > 0 && (
                        <Badge variant="destructive" className="mt-2 text-xs">
                          -{card.damage}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hand */}
      {currentPlayer && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Hand</CardTitle>
          </CardHeader>
          <CardContent>
            {gameState.cards.filter(
              (c) =>
                c.location === 'hand' &&
                c.controller_id === currentPlayer.player_id
            ).length === 0 ? (
              <p className="text-muted-foreground">No cards in hand</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {gameState.cards
                  .filter(
                    (c) =>
                      c.location === 'hand' &&
                      c.controller_id === currentPlayer.player_id
                  )
                  .map((card) => (
                    <Card
                      key={card.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                        isMyTurn ? 'border-primary hover:border-primary' : 'opacity-50'
                      }`}
                      onClick={() => {
                        if (isMyTurn) {
                          handlePlayCard(card.card_id);
                        }
                      }}
                    >
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm mb-2">
                          Card {card.card_id}
                        </p>
                        {card.power !== null && card.toughness !== null && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-bold text-destructive">
                              {card.power}
                            </span>
                            <span>/</span>
                            <span className="font-bold text-primary">
                              {card.toughness}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
