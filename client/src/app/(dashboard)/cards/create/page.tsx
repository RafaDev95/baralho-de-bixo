'use client';

import { useRouter } from 'next/navigation';
import { CardForm } from '../../../../components/cards/card-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';

export default function CreateCardPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Card</CardTitle>
          <CardDescription>
            Add a new card to the game collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardForm
            onSuccess={() => {
              router.push('/cards');
            }}
            onCancel={() => {
              router.push('/cards');
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

