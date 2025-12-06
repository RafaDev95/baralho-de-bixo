'use client';

import { useDecksList } from '../../hooks/decks/use-decks-list';
import { useDeckDelete } from '../../hooks/decks/use-deck-delete';
import { DeckItem } from './deck-item';
import { Button } from '../ui/button';

import type { Deck } from '../../types/decks';

interface DecksListProps {
  onDeckClick?: (deckId: number) => void;
  onCreateDeck?: () => void;
  decks?: Deck[];
}

export function DecksList({
  onDeckClick,
  onCreateDeck,
  decks: providedDecks,
}: DecksListProps) {
  const { data: fetchedDecks, isLoading, error, refetch } = useDecksList();
  const decks = providedDecks || fetchedDecks;
  const deleteMutation = useDeckDelete();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this deck?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive">Failed to load decks</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!decks || decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-muted-foreground">No decks found</p>
        {onCreateDeck && <Button onClick={onCreateDeck}>Create Deck</Button>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onCreateDeck && (
        <div className="flex justify-end">
          <Button onClick={onCreateDeck}>Create New Deck</Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            onClick={() => onDeckClick?.(deck.id)}
            onDelete={() => handleDelete(deck.id)}
          />
        ))}
      </div>
    </div>
  );
}
