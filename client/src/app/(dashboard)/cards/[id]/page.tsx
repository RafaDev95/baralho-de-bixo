'use client';

import { useParams, useRouter } from 'next/navigation';
import { CardDetail } from '../../../../components/cards/card-detail';
import { Button } from '../../../../components/ui/button';

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = Number.parseInt(params.id as string, 10);

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/cards')}
        className="mb-4"
      >
        ← Back to cards
      </Button>
      <CardDetail cardId={cardId} />
    </div>
  );
}

