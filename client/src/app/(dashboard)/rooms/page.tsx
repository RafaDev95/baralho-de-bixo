'use client';

import { useState } from 'react';
import { RoomsList } from '@/components/game-rooms/rooms-list';
import { CreateRoomForm } from '@/components/game-rooms/create-room-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RoomsPage() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('waiting');

  if (showCreateForm) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => setShowCreateForm(false)}
          className="mb-4"
        >
          ← Back to rooms
        </Button>
        <CreateRoomForm onClose={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Game Rooms</h1>
          <p className="text-muted-foreground">
            Join or create a room to start playing
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </div>

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RoomsList
        onRoomClick={(roomId) => router.push(`/rooms/${roomId}`)}
        onCreateRoom={() => setShowCreateForm(true)}
        statusFilter={statusFilter === 'all' ? undefined : statusFilter}
      />
    </div>
  );
}
