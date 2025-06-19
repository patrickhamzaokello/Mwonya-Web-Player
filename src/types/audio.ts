export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  duration: number; // in seconds
  url: string;
  artwork?: string;
  genre?: string;
  isExplicit?: boolean;
  isLiked?: boolean;
  isLocal?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork?: string;
  tracks: Track[];
  isPublic?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artwork?: string;
  releaseDate?: Date;
  tracks: Track[];
  genre?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  monthlyListeners?: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export interface PlaybackAnalytics {
  trackId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // how long the track was played
  completed: boolean; // played for more than 30 seconds
  skipped: boolean;
  seekCount: number;
  source: 'playlist' | 'album' | 'search' | 'radio' | 'library';
  sourceId?: string;
}

export interface UserInteraction {
  trackId: string;
  userId?: string;
  action: 'like' | 'unlike' | 'report' | 'add_to_playlist' | 'remove_from_playlist';
  timestamp: Date;
  context?: string;
}

export type AudioActions = {
  // Playback controls
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  
  // Volume controls
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Queue management
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  
  // Playback modes
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  
  // Analytics
  trackPlay: (track: Track, source: string, sourceId?: string) => void;
  trackSkip: (track: Track) => void;
  trackComplete: (track: Track) => void;
  trackLike: (track: Track) => void;
  trackUnlike: (track: Track) => void;
  trackReport: (track: Track, reason: string) => void;
};