'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Cards,
  Layers,
  Users,
  Gamepad2,
  Menu,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cards', label: 'Cards', icon: Cards },
  { href: '/decks', label: 'Decks', icon: Layers },
  { href: '/rooms', label: 'Game Rooms', icon: Gamepad2 },
  { href: '/players', label: 'Players', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden border-r border-mystic-gray bg-mystic-dark/50 md:flex md:w-64 md:flex-col">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-mystic-gray px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-ancient-gold font-cinzel text-xl">
                AETHERIA
              </span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-mystic-gray transition-all hover:text-ancient-gold',
                      isActive &&
                        'bg-stone-carving text-ancient-gold border-l-2 border-ancient-gold shadow-sm'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-mystic-dark border-mystic-gray">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b border-mystic-gray px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <span className="text-ancient-gold font-cinzel text-xl">
                  AETHERIA
                </span>
              </Link>
            </div>
            <nav className="grid items-start px-2 text-sm font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-mystic-gray transition-all hover:text-ancient-gold',
                      isActive &&
                        'bg-stone-carving text-ancient-gold border-l-2 border-ancient-gold shadow-sm'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

