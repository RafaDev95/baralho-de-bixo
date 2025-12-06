'use client';

import { Card as UICard, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Card } from '../../types/cards';

interface CardItemProps {
  card: Card;
  onClick?: () => void;
}

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  mythic: 'bg-purple-500',
};

const typeColors = {
  creature: 'bg-red-500',
  spell: 'bg-blue-500',
  artifact: 'bg-yellow-500',
  enchantment: 'bg-green-500',
};

export function CardItem({ card, onClick }: CardItemProps) {
  return (
    <UICard
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg hover:scale-105',
        'border-2 hover:border-primary'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{card.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold text-primary shrink-0">
            <Zap className="h-4 w-4" />
            {card.energy_cost}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={cn('text-xs', typeColors[card.type])}
          >
            {card.type}
          </Badge>
          <Badge
            variant="secondary"
            className={cn('text-xs', rarityColors[card.rarity])}
          >
            {card.rarity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {card.description}
        </p>
        {card.power !== null && card.toughness !== null && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="text-sm">
              <span className="font-semibold text-destructive">{card.power}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="font-semibold text-primary">{card.toughness}</span>
            </div>
          </div>
        )}
      </CardContent>
    </UICard>
  );
}
