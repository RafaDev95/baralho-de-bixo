'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCardCreate } from '../../hooks/cards/use-card-create';
import { useCardUpdate } from '../../hooks/cards/use-card-update';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Card, CreateCardRequest, UpdateCardRequest } from '../../types/cards';

const cardFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['creature', 'spell', 'artifact', 'enchantment']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'mythic']),
  description: z.string().min(1, 'Description is required'),
  energy_cost: z.coerce.number().min(0).max(10),
  power: z.coerce.number().nullable().optional(),
  toughness: z.coerce.number().nullable().optional(),
  can_attack: z.boolean().nullable().optional(),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface CardFormProps {
  card?: Card;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CardForm({ card, onSuccess, onCancel }: CardFormProps) {
  const createMutation = useCardCreate();
  const updateMutation = useCardUpdate();
  const isEditing = !!card;

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: card
      ? {
          name: card.name,
          type: card.type,
          rarity: card.rarity,
          description: card.description,
          energy_cost: card.energy_cost,
          power: card.power ?? null,
          toughness: card.toughness ?? null,
          can_attack: card.can_attack ?? null,
        }
      : {
          name: '',
          type: 'creature',
          rarity: 'common',
          description: '',
          energy_cost: 0,
          power: null,
          toughness: null,
          can_attack: null,
        },
  });

  const onSubmit = (data: CardFormValues) => {
    const cardData: CreateCardRequest | UpdateCardRequest = {
      ...data,
      power: data.power ?? null,
      toughness: data.toughness ?? null,
      can_attack: data.can_attack ?? null,
    };

    if (isEditing && card) {
      updateMutation.mutate(
        { id: card.id, data: cardData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (error: Error) => {
            form.setError('root', {
              message: error.message || 'Failed to update card',
            });
          },
        }
      );
    } else {
      createMutation.mutate(cardData as CreateCardRequest, {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error: Error) => {
          form.setError('root', {
            message: error.message || 'Failed to create card',
          });
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isCreature = form.watch('type') === 'creature';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter card name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energy_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Cost to play this card (0-10)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="creature">Creature</SelectItem>
                    <SelectItem value="spell">Spell</SelectItem>
                    <SelectItem value="artifact">Artifact</SelectItem>
                    <SelectItem value="enchantment">Enchantment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rarity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rarity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="mythic">Mythic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isCreature && (
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toughness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toughness</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter card description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
                ? 'Update Card'
                : 'Create Card'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

