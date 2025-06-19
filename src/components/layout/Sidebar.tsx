'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Search,
  Library,
  Radio,
  Heart,
  Download,
  Plus,
  Music,
  Disc,
  Mic,
  ListMusic,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Browse', href: '/browse', icon: Search },
  { name: 'Radio', href: '/radio', icon: Radio },
];

const library = [
  { name: 'Recently Added', href: '/library/recent', icon: Music },
  { name: 'Artists', href: '/library/artists', icon: Mic },
  { name: 'Albums', href: '/library/albums', icon: Disc },
  { name: 'Songs', href: '/library/songs', icon: ListMusic },
  { name: 'Downloaded', href: '/library/downloads', icon: Download },
];

const playlists = [
  { name: 'Liked Songs', href: '/library/liked', icon: Heart },
  { name: 'My Playlist #1', href: '/playlist/1' },
  { name: 'Workout Mix', href: '/playlist/2' },
  { name: 'Chill Vibes', href: '/playlist/3' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">Music</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 pb-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary text-secondary-foreground'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Separator className="my-6" />

          {/* Library */}
          <div>
            <h3 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Library
            </h3>
            <div className="space-y-1">
              {library.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-secondary text-secondary-foreground'
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Playlists */}
          <div>
            <div className="flex items-center justify-between mb-3 px-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Playlists
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {playlists.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-secondary text-secondary-foreground'
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}