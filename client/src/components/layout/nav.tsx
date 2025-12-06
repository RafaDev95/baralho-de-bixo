'use client';

import { Sidebar } from './sidebar';
import { UserMenu } from './user-menu';
import { useAuth } from '../../contexts/auth-context';

export function Nav() {
  const { player } = useAuth();

  if (!player) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mystic-gray bg-mystic-dark bg-opacity-90 backdrop-blur-sm shadow-xl">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <Sidebar />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
