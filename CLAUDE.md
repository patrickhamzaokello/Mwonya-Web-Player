# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev --turbopack` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a modern Next.js 15 music streaming web application inspired by Apple Music, featuring comprehensive audio controls, analytics tracking, and a complete authentication system.

### Key Architecture Components

**Enhanced State Management**
- `EnhancedAudioContext` - Advanced audio management with analytics tracking, HLS support, and complete playback controls
- `AuthContext` - Full authentication system with login/signup, session management, and user preferences
- Uses React's useReducer for complex state management

**Audio System Features**
- Supports regular audio files and HLS streaming (.m3u8)
- HLS.js integration for cross-browser compatibility
- Analytics tracking: plays (30+ seconds), skips, likes, reports
- Queue management with shuffle, repeat modes
- Volume controls, seeking, and buffering states

**Authentication System**
- Mock authentication with localStorage persistence
- Login/signup forms with validation
- User preferences and subscription management
- Protected routes and session handling

**Apple Music-Inspired UI**
- Modern sidebar navigation with collapsible sections
- Top bar with search and user menu
- Mini player with full controls at bottom
- Card-based layouts for tracks, albums, playlists
- Responsive design with hover states and transitions

**Demo API & Data**
- Complete mock API in `src/lib/api.ts`
- Sample data with realistic music content
- Search functionality across tracks, artists, albums, playlists
- Analytics endpoints for tracking user interactions

### File Structure

**Core Contexts**
- `src/contexts/EnhancedAudioContext.tsx` - Audio management
- `src/contexts/AuthContext.tsx` - Authentication

**UI Components**
- `src/components/layout/` - App shell, sidebar, top bar, mini player
- `src/components/auth/` - Login/signup forms
- `src/components/music/` - Track cards, album cards, playlist cards
- `src/components/ui/` - shadcn/ui components

**Types & API**
- `src/types/audio.ts` - Audio-related TypeScript interfaces
- `src/types/auth.ts` - Authentication types
- `src/lib/api.ts` - Mock API functions
- `src/lib/demo-data.ts` - Sample music data

**Pages**
- `/` - Home page with featured content
- `/login` - Authentication page
- `/signup` - User registration
- Client-side routing preserves audio playback

### Key Features

**Audio Analytics**
- Tracks plays after 30 seconds of listening
- Records skips, likes, unlikes, and reports
- Seek count tracking and buffering analytics
- Source tracking (playlist, album, search, etc.)

**Demo Credentials**
- Email: demo@example.com
- Password: password

**Navigation**
- Seamless client-side routing
- Audio continues playing during navigation
- Persistent mini player across all pages
- Mobile-responsive sidebar

The application provides a complete music streaming experience with professional-grade features including analytics, authentication, and modern UI patterns.