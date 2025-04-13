'use client';

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { Howl } from 'howler';

interface Track {
  id: string;
  title: string;
  artist: string;
  path: string;
  album?: string;
  duration: string;
  artworkPath?: string;
}

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  duration: string;
  nextTrack: Track | null;
  previousTrack: Track | null;
  currentTime: number;
  playlist: Track[] | null;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  seek: (time: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setPlaylist: (playlist: Track[] | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [previousTrack, setPreviousTrack] = useState<Track | null>(null);
  const [nextTrack, setNextTrack] = useState<Track | null>(null);
  const [playlist, setPlaylistState] = useState<Track[] | null>(null);
  const [volume, setVolumeState] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const soundRef = useRef<Howl | null>(null);
  const seekTimer = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (seekTimer.current) {
        window.clearInterval(seekTimer.current);
      }
    };
  }, []);

  const playTrack = (track: Track) => {
    // If there's an existing sound, unload it
    if (soundRef.current) {
      soundRef.current.unload();
      if (seekTimer.current) {
        window.clearInterval(seekTimer.current);
      }
    }

    // Create new Howl instance
    const sound = new Howl({
      src: [track.path],
      html5: true, // Enable streaming
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        // Start tracking current time
        seekTimer.current = window.setInterval(() => {
          if (soundRef.current) {
            const seek = soundRef.current.seek() as number;
            setCurrentTime(seek || 0);
          }
        }, 1000);
      },
      onpause: () => {
        setIsPlaying(false);
        if (seekTimer.current) {
          window.clearInterval(seekTimer.current);
        }
      },
      onend: () => {
        setIsPlaying(false);
        if (seekTimer.current) {
          window.clearInterval(seekTimer.current);
        }
        // Play next track if available
        if (nextTrack) {
          playTrack(nextTrack);
        }
      },
      onload: () => {
        const duration = sound.duration();
        setDuration(Number(duration || track.duration));
      },
      onstop: () => {
        setIsPlaying(false);
        if (seekTimer.current) {
          window.clearInterval(seekTimer.current);
        }
      },
    });

    soundRef.current = sound;
    setCurrentTrack(track);
    
    // Update next and previous tracks based on playlist
    if (playlist) {
      const currentIndex = playlist.findIndex(t => t.id === track.id);
      if (currentIndex > -1) {
        setPreviousTrack(currentIndex > 0 ? playlist[currentIndex - 1] : null);
        setNextTrack(currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null);
      }
    }
    
    sound.play();
  };

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const seek = (time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const setPlaylist = (newPlaylist: Track[] | null) => {
    setPlaylistState(newPlaylist);
    if (newPlaylist && newPlaylist.length > 0) {
      const currentIndex = currentTrack ? newPlaylist.findIndex(track => track.id === currentTrack.id) : -1;
      
      if (currentIndex > -1) {
        setPreviousTrack(currentIndex > 0 ? newPlaylist[currentIndex - 1] : null);
        setNextTrack(currentIndex < newPlaylist.length - 1 ? newPlaylist[currentIndex + 1] : null);
      }
    }
  };

  const playNextTrack = () => {
    if (nextTrack) {
      playTrack(nextTrack);
      if (playlist) {
        const currentIndex = playlist.findIndex(track => track.id === nextTrack.id);
        setPreviousTrack(currentTrack);
        setNextTrack(currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null);
      }
    }
  };

  const playPreviousTrack = () => {
    if (previousTrack) {
      playTrack(previousTrack);
      if (playlist) {
        const currentIndex = playlist.findIndex(track => track.id === previousTrack.id);
        setNextTrack(currentTrack);
        setPreviousTrack(currentIndex > 0 ? playlist[currentIndex - 1] : null);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        nextTrack,
        previousTrack,
        volume,
        duration: duration.toString(),
        currentTime,
        playlist,
        playTrack,
        togglePlay,
        setVolume,
        setCurrentTime,
        seek,
        playNextTrack,
        playPreviousTrack,
        setPlaylist,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 