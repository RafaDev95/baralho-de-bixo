'use client';

import { useAuth } from '../../../contexts/auth-context';
import { useDecksList } from '../../../hooks/decks/use-decks-list';
import { useGameRoomsList } from '../../../hooks/game-rooms/use-game-rooms-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  Gamepad2,
  Layers,
  CreditCard,
  Users,
  Trophy,
  Coins,
  Zap,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { player, isLoading: authLoading } = useAuth();
  const { data: decks, isLoading: decksLoading } = useDecksList();
  const { data: rooms, isLoading: roomsLoading } = useGameRoomsList({
    status: 'waiting',
    includePlayers: false,
  });

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!player) {
    return null;
  }

  const initials = player.username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const deckCount = decks?.length || 0;
  const waitingRooms = rooms?.length || 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {player.username}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your game activity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Stats Cards */}
        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Rank</CardTitle>
            <Trophy className="h-4 w-4 text-ancient-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ancient-gold">#{player.rank}</div>
            <p className="text-xs text-mystic-gray">
              Your current ranking
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Balance</CardTitle>
            <Coins className="h-4 w-4 text-ancient-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ancient-gold">{player.balance}</div>
            <p className="text-xs text-mystic-gray">Available coins</p>
          </CardContent>
        </Card>

        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Decks</CardTitle>
            <Layers className="h-4 w-4 text-mystic-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {decksLoading ? <Skeleton className="h-8 w-8" /> : deckCount}
            </div>
            <p className="text-xs text-mystic-gray">Total decks created</p>
          </CardContent>
        </Card>

        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Available Rooms
            </CardTitle>
            <Gamepad2 className="h-4 w-4 text-emerald-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {roomsLoading ? <Skeleton className="h-8 w-8" /> : waitingRooms}
            </div>
            <p className="text-xs text-mystic-gray">
              Rooms waiting for players
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Player Profile Card */}
        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader>
            <CardTitle className="text-white">Player Profile</CardTitle>
            <CardDescription className="text-mystic-gray">Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{player.username}</h3>
                <p className="text-sm text-muted-foreground">{player.email}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="text-sm font-medium">
                  {player.balance} coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rank</span>
                <Badge variant="secondary">#{player.rank}</Badge>
              </div>
            </div>
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                View Full Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-mystic-gray">Get started quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/rooms">
              <Button className="w-full" variant="default">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Find Game Room
              </Button>
            </Link>
            <Link href="/decks">
              <Button className="w-full" variant="outline">
                <Layers className="mr-2 h-4 w-4" />
                Manage Decks
              </Button>
            </Link>
            <Link href="/cards">
              <Button className="w-full" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Browse Cards
              </Button>
            </Link>
            <Link href="/players">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Players
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="bg-stone-carving border-mystic-gray">
          <CardHeader>
            <CardTitle className="text-white">Getting Started</CardTitle>
            <CardDescription className="text-mystic-gray">Next steps for new players</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deckCount === 0 ? (
              <div className="p-3 bg-mystic-dark/50 rounded-lg border border-mystic-gray">
                <p className="text-sm font-medium mb-1 text-white">
                  Create Your First Deck
                </p>
                <p className="text-xs text-mystic-gray mb-2">
                  Build a deck to start playing
                </p>
                <Link href="/decks">
                  <Button size="sm" variant="outline" className="w-full border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-mystic-dark">
                    Create Deck
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-3 bg-mystic-dark/50 rounded-lg border border-emerald-glow">
                <p className="text-sm font-medium mb-1 text-white">Ready to Play!</p>
                <p className="text-xs text-mystic-gray mb-2">
                  You have {deckCount} deck{deckCount !== 1 ? 's' : ''} ready
                </p>
                <Link href="/rooms">
                  <Button size="sm" className="w-full bg-emerald-glow text-mystic-dark hover:bg-emerald-glow/90">
                    Find a Game
                  </Button>
                </Link>
              </div>
            )}
            <Separator className="bg-mystic-gray" />
            <div className="p-3 bg-mystic-dark/50 rounded-lg border border-mystic-gray">
              <p className="text-sm font-medium mb-1 text-white">Explore Cards</p>
              <p className="text-xs text-mystic-gray mb-2">
                Discover new cards and strategies
              </p>
              <Link href="/cards">
                <Button size="sm" variant="outline" className="w-full border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-mystic-dark">
                  Browse Collection
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
