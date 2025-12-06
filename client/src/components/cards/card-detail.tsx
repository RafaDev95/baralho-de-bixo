'use client';

import { useCardById } from '../../hooks/cards/use-card-by-id';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Zap, Shield, Sword } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';

interface CardDetailProps {
  cardId: number;
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

export function CardDetail({ cardId }: CardDetailProps) {
  const { data: card, isLoading, error } = useCardById(cardId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !card) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load card details</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{card.name}</CardTitle>
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
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-primary shrink-0">
              <Zap className="h-6 w-6" />
              {card.energy_cost}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm leading-relaxed">{card.description}</p>
            </div>

            {card.power !== null && card.toughness !== null && (
              <>
                <Separator />
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Sword className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-xs text-muted-foreground">Power</p>
                      <p className="text-2xl font-bold">{card.power}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Toughness</p>
                      <p className="text-2xl font-bold">{card.toughness}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
          <CardDescription>Additional information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="abilities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            <TabsContent value="abilities" className="mt-4">
              {card.abilities && Object.keys(card.abilities).length > 0 ? (
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(card.abilities, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No abilities defined
                </p>
              )}
            </TabsContent>
            <TabsContent value="effects" className="mt-4">
              {card.effect && Object.keys(card.effect).length > 0 ? (
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(card.effect, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No effects defined
                </p>
              )}
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Can Attack</span>
              <span className="font-medium">
                {card.can_attack ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {new Date(card.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
