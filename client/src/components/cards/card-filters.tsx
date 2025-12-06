'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import type { CardType, CardRarity } from '../../types/cards';

interface CardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: CardType | 'all';
  onTypeChange: (type: CardType | 'all') => void;
  rarityFilter: CardRarity | 'all';
  onRarityChange: (rarity: CardRarity | 'all') => void;
  onClearFilters: () => void;
}

export function CardFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  rarityFilter,
  onRarityChange,
  onClearFilters,
}: CardFiltersProps) {
  const hasActiveFilters =
    searchQuery !== '' ||
    typeFilter !== 'all' ||
    rarityFilter !== 'all';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder="Search cards by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="creature">Creature</SelectItem>
          <SelectItem value="spell">Spell</SelectItem>
          <SelectItem value="artifact">Artifact</SelectItem>
          <SelectItem value="enchantment">Enchantment</SelectItem>
        </SelectContent>
      </Select>
      <Select value={rarityFilter} onValueChange={onRarityChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by rarity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Rarities</SelectItem>
          <SelectItem value="common">Common</SelectItem>
          <SelectItem value="uncommon">Uncommon</SelectItem>
          <SelectItem value="rare">Rare</SelectItem>
          <SelectItem value="mythic">Mythic</SelectItem>
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="icon"
          onClick={onClearFilters}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

