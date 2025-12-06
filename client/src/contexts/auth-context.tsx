'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { Player } from '../types/auth';

interface AuthContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load player from localStorage on mount
    const storedPlayer = localStorage.getItem('player');
    if (storedPlayer) {
      try {
        setPlayer(JSON.parse(storedPlayer));
      } catch {
        localStorage.removeItem('player');
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetPlayer = (newPlayer: Player | null) => {
    setPlayer(newPlayer);
    if (newPlayer) {
      localStorage.setItem('player', JSON.stringify(newPlayer));
    } else {
      localStorage.removeItem('player');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        player,
        setPlayer: handleSetPlayer,
        isAuthenticated: !!player,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
