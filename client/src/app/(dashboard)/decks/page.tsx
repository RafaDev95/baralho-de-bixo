'use client';

import { useState } from 'react';
import { DecksList } from '../../../components/decks/decks-list';
import { DeckDetail } from '../../../components/decks/deck-detail';
import { DeckBuilder } from '../../../components/decks/deck-builder';

export default function DecksPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return (
      <div className="container mx-auto p-6">
        <button
          onClick={() => setShowBuilder(false)}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to decks
        </button>
        <DeckBuilder onClose={() => setShowBuilder(false)} />
      </div>
    );
  }

  if (selectedDeckId) {
    return (
      <div className="container mx-auto p-6">
        <button
          onClick={() => setSelectedDeckId(null)}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to decks
        </button>
        <DeckDetail deckId={selectedDeckId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Decks</h1>
      <DecksList
        onDeckClick={setSelectedDeckId}
        onCreateDeck={() => setShowBuilder(true)}
      />
    </div>
  );
}
