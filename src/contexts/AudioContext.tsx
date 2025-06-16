'use client';

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import { Track } from '@/lib/actions';



interface AudioContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  duration: string;
  nextTrack: Track | null;
  previousTrack: Track | null;
  currentTime: number;
  playlist: Track[] | null;
  isBuffering: boolean;
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
  const [isBuffering, setIsBuffering] = useState(false);

  const soundRef = useRef<Howl | null>(null);
  const seekTimer = useRef<number>(0);

  useEffect(() => {
    // Cleanup on unmount
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
    // Clean up previous sound
    if (soundRef.current) {
      soundRef.current.unload();
    }
    if (seekTimer.current) {
      window.clearInterval(seekTimer.current);
    }

    // Create new Howl instance
    soundRef.current = new Howl({
      src: [track.path],
      html5: true,
      volume: volume,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
        setIsBuffering(false);
      },
      onloaderror: (id, error) => {
        console.error('Error loading audio:', error);
        setIsBuffering(false);
      },
      onplay: () => {
        setIsPlaying(true);
        setIsBuffering(false);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
        if (playlist) {
          const currentIndex = playlist.findIndex(t => t.id === track.id);
          if (currentIndex < playlist.length - 1) {
            const next = playlist[currentIndex + 1];
            playTrack(next);
          }
        }
      },
    });

    // Start tracking current time
    seekTimer.current = window.setInterval(() => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek());
      }
    }, 1000);

    // Start playback
    soundRef.current.play();
    setCurrentTrack(track);
    
    // Update next and previous tracks based on playlist
    if (playlist) {
      const currentIndex = playlist.findIndex(t => t.id === track.id);
      if (currentIndex > -1) {
        setPreviousTrack(currentIndex > 0 ? playlist[currentIndex - 1] : null);
        setNextTrack(currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null);
      }
    }
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
    Howler.volume(newVolume);
  };

  const isSeekingRef = useRef(false);

  // Update your seek function:
  const seek = (time: number) => {
    if (soundRef.current) {
      isSeekingRef.current = true;
      soundRef.current.seek(time);
      setCurrentTime(time);
      
      // Small timeout to prevent interval from interfering
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 100);
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
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      const next = playlist[currentIndex + 1];
      playTrack(next);
      
      // Update next/previous track references
      setPreviousTrack(currentTrack);
      setNextTrack(currentIndex + 1 < playlist.length - 1 ? playlist[currentIndex + 2] : null);
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
        isBuffering,
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