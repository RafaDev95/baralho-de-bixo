'use client';

import { useMemo } from 'react';
import { useCardsList } from '../../hooks/cards/use-cards-list';
import { CardItem } from './card-item';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import type { CardType, CardRarity } from '../../types/cards';

interface CardsGridProps {
  onCardClick?: (cardId: number) => void;
  searchQuery?: string;
  typeFilter?: CardType | 'all';
  rarityFilter?: CardRarity | 'all';
}

export function CardsGrid({
  onCardClick,
  searchQuery = '',
  typeFilter = 'all',
  rarityFilter = 'all',
}: CardsGridProps) {
  const { data: cards, isLoading, error, refetch } = useCardsList();

  const filteredCards = useMemo(() => {
    if (!cards) return [];

    return cards.filter((card) => {
      const matchesSearch =
        searchQuery === '' ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || card.type === typeFilter;
      const matchesRarity =
        rarityFilter === 'all' || card.rarity === rarityFilter;

      return matchesSearch && matchesType && matchesRarity;
    });
  }, [cards, searchQuery, typeFilter, rarityFilter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load cards</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No cards found</p>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          No cards match your filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredCards.length} of {cards.length} cards
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card.id)}
          />
        ))}
      </div>
    </>
  );
}
