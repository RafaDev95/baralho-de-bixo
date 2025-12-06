'use client';

import { useState } from 'react';
import { useCardsList } from '../../hooks/cards/use-cards-list';
import { useDeckCreate } from '../../hooks/decks/use-deck-create';
import { useAuth } from '../../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CardItem } from '../cards/card-item';
import { useRouter } from 'next/navigation';

interface DeckBuilderProps {
  onClose: () => void;
}

export function DeckBuilder({ onClose }: DeckBuilderProps) {
  const router = useRouter();
  const { player } = useAuth();
  const { data: cards } = useCardsList();
  const createMutation = useDeckCreate();
  const [deckName, setDeckName] = useState('');
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCardToggle = (cardId: number) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleCreate = () => {
    if (!deckName.trim()) {
      setError('Deck name is required');
      return;
    }

    if (selectedCardIds.length < 15) {
      setError('Deck must contain at least 15 cards');
      return;
    }

    setError(null);
    createMutation.mutate(
      {
        name: deckName,
        player_id: player?.id || null,
        type: 1, // Custom deck
        cardIds: selectedCardIds,
      },
      {
        onSuccess: () => {
          router.push('/decks');
        },
        onError: (error: Error) => {
          setError(error.message || 'Failed to create deck');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Deck</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deckName">Deck Name</Label>
            <Input
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter deck name"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedCardIds.length} / 15 minimum
            </p>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Deck'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {cards && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Select Cards</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
              <div key={card.id} className="relative">
                <div
                  className={`cursor-pointer transition-opacity ${
                    selectedCardIds.includes(card.id)
                      ? 'opacity-100'
                      : 'opacity-60'
                  }`}
                  onClick={() => handleCardToggle(card.id)}
                >
                  <CardItem card={card} />
                </div>
                {selectedCardIds.includes(card.id) && (
                  <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-xs text-primary-foreground">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
