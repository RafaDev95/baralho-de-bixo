'use client';

import { useDeckById } from '../../hooks/decks/use-deck-by-id';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardItem } from '../cards/card-item';

interface DeckDetailProps {
  deckId: number;
}

export function DeckDetail({ deckId }: DeckDetailProps) {
  const { data: deck, isLoading, error } = useDeckById(deckId, true);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (error || !deck) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load deck details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{deck.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Cards:</strong> {deck.card_count}
            </p>
            <p>
              <strong>Type:</strong> {deck.type === 0 ? 'Starter' : 'Custom'}
            </p>
            {deck.is_active && (
              <p className="text-green-600 dark:text-green-400">Active Deck</p>
            )}
          </div>
        </CardContent>
      </Card>

      {deck.cards && deck.cards.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Cards in Deck</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deck.cards.map((deckCard) =>
              deckCard.card ? (
                <CardItem key={deckCard.cardId} card={deckCard.card} />
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
