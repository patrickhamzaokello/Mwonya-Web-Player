// Types for the music player application

import { Track } from "./actions"


  
  export interface PlaylistInfo {
    id: string
    name: string
    owner: string
    cover: string
    description: string
    category: string
    status: string
    total: number
  }
  
  export interface PlaylistWithTracks {
    Tracks: Track[]
  }
  
  export interface PlaylistData {
    page: number
    Playlists: (PlaylistInfo | PlaylistWithTracks)[]
    total_pages: number
    total_results: number
  }
  
  // Player state types
  export interface PlayerState {
    isPlaying: boolean
    currentTrackIndex: number
    progress: number
    duration: number
    currentTime: number
    volume: number
    isMuted: boolean
  }
  
  // Audio controls types
  export interface AudioControls {
    play: () => void
    pause: () => void
    togglePlay: () => void
    next: () => void
    previous: () => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    seek: (time: number) => void
  }
  