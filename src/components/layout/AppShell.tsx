'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MiniPlayer } from './MiniPlayer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">
      {children}
    </div>;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mini Player */}
      <MiniPlayer />
    </div>
  );
}