'use client';

import { useAuth } from '../../../contexts/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Skeleton } from '../../../components/ui/skeleton';
import { User, Mail, Coins, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const { player, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = player.username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{player.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    Player ID: {player.id}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {player.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p className="text-sm text-muted-foreground">
                      {player.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Balance</p>
                    <p className="text-sm text-muted-foreground">
                      {player.balance} coins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Rank</p>
                    <Badge variant="secondary" className="mt-1">
                      #{player.rank}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Your game statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Member since
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(player.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="text-sm font-medium">
                    {player.balance} coins
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rank</span>
                  <Badge variant="outline">#{player.rank}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

