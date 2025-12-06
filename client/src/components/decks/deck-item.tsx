import { Card as UICard, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { Deck } from '../../types/decks';

interface DeckItemProps {
  deck: Deck;
  onClick?: () => void;
  onDelete?: () => void;
}

export function DeckItem({ deck, onClick, onDelete }: DeckItemProps) {
  return (
    <UICard className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{deck.name}</CardTitle>
          {deck.is_active && (
            <span className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-600 dark:text-green-400">
              Active
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {deck.card_count} cards
          </p>
          <p className="text-sm text-muted-foreground">
            Type: {deck.type === 0 ? 'Starter' : 'Custom'}
          </p>
          <div className="flex gap-2">
            {onClick && (
              <Button variant="outline" size="sm" onClick={onClick}>
                View
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </UICard>
  );
}
