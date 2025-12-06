'use client';

import { useAuth } from '../../../contexts/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Skeleton } from '../../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertCircle, Bell, Shield, Palette, Globe } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';

export default function SettingsPage() {
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please sign in to access settings</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{player.username}</p>
                    <span className="text-xs text-muted-foreground">
                      (Cannot be changed)
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm">{player.email}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Player ID</label>
                  <p className="text-sm font-mono">{player.id}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-sm">
                    {new Date(player.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Notification settings are coming soon. For now, all game
                    events are displayed in real-time during gameplay.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Theme customization is coming soon. The application
                    currently uses the Aetheria theme with dark mode.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Profile Visibility
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Your profile is visible to all players. This allows others
                    to view your statistics and decks.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Game History</label>
                  <p className="text-sm text-muted-foreground">
                    Your game history and statistics are stored and visible in
                    your profile.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Management</label>
                  <p className="text-sm text-muted-foreground">
                    All your game data is securely stored. Account deletion is
                    not currently available but will be added in a future
                    update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
