'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardsGrid } from '../../../components/cards/cards-grid';
import { CardDetail } from '../../../components/cards/card-detail';
import { CardFilters } from '../../../components/cards/card-filters';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import type { CardType, CardRarity } from '../../../types/cards';

export default function CardsPage() {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<CardRarity | 'all'>('all');

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setRarityFilter('all');
  };

  if (selectedCardId) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedCardId(null)}
          className="mb-4"
        >
          ← Back to cards
        </Button>
        <CardDetail cardId={selectedCardId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cards</h1>
          <p className="text-muted-foreground">
            Browse and manage your card collection
          </p>
        </div>
        <Button onClick={() => router.push('/cards/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Card
        </Button>
      </div>

      <div className="mb-6">
        <CardFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          rarityFilter={rarityFilter}
          onRarityChange={setRarityFilter}
          onClearFilters={handleClearFilters}
        />
      </div>

      <CardsGrid
        onCardClick={setSelectedCardId}
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        rarityFilter={rarityFilter}
      />
    </div>
  );
}
