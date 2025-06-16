'use client';

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeUpdateTimer = useRef<number>(0);
  const isSeekingRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    
    const audio = audioRef.current;

    // Event listeners
    const handleLoadStart = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsBuffering(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (playlist && currentTrack) {
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        if (currentIndex < playlist.length - 1) {
          const next = playlist[currentIndex + 1];
          playTrack(next);
        }
      }
    };
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsBuffering(false);
    };
    const handleTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlayThrough = () => setIsBuffering(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    // Set initial volume
    audio.volume = volume;

    // Cleanup
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      
      audio.pause();
      audio.src = '';
      
      if (timeUpdateTimer.current) {
        window.clearInterval(timeUpdateTimer.current);
      }
    };
  }, []);

  // Helper function to determine if URL is HLS stream
  const isHLSStream = (url: string): boolean => {
    return url.includes('.m3u8') || url.includes('hls') || url.includes('playlist');
  };

  const playTrack = async (track: Track) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    // Reset current state
    setIsBuffering(true);
    setCurrentTime(0);
    setDuration(0);

    try {
      // Stop current playback
      audio.pause();
      audio.currentTime = 0;

      // Check if we need HLS.js for this stream
      if (isHLSStream(track.path)) {
        // Try to load HLS.js dynamically if needed
        if (typeof window !== 'undefined' && !audio.canPlayType('application/vnd.apple.mpegurl')) {
          try {
            // Dynamic import of HLS.js
            const { default: Hls } = await import('hls.js');
            
            if (Hls.isSupported()) {
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
              });
              
              hls.loadSource(track.path);
              hls.attachMedia(audio);
              
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest parsed, ready to play');
              });
              
              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
                if (data.fatal) {
                  setIsBuffering(false);
                }
              });
              
              // Store HLS instance for cleanup
              (audio as any).hlsInstance = hls;
            } else {
              console.warn('HLS.js not supported, falling back to native');
              audio.src = track.path;
            }
          } catch (error) {
            console.warn('HLS.js not available, using native HLS support:', error);
            audio.src = track.path;
          }
        } else {
          // Native HLS support (Safari, iOS)
          audio.src = track.path;
        }
      } else {
        // Regular audio file
        audio.src = track.path;
      }

      // Wait for the audio to be ready
      await audio.load();
      
      // Start playback
      await audio.play();
      
      setCurrentTrack(track);
      
      // Update next and previous tracks based on playlist
      if (playlist) {
        const currentIndex = playlist.findIndex(t => t.id === track.id);
        if (currentIndex > -1) {
          setPreviousTrack(currentIndex > 0 ? playlist[currentIndex - 1] : null);
          setNextTrack(currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null);
        }
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setIsBuffering(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      isSeekingRef.current = true;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      
      // Reset seeking flag after a short delay
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 100);
    }
  };

  const setPlaylist = (newPlaylist: Track[] | null) => {
    setPlaylistState(newPlaylist);
    if (newPlaylist && newPlaylist.length > 0 && currentTrack) {
      const currentIndex = newPlaylist.findIndex(track => track.id === currentTrack.id);
      
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
    }
  };

  const playPreviousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      const previous = playlist[currentIndex - 1];
      playTrack(previous);
    }
  };

  // Cleanup HLS instance when track changes
  useEffect(() => {
    return () => {
      if (audioRef.current && (audioRef.current as any).hlsInstance) {
        (audioRef.current as any).hlsInstance.destroy();
        delete (audioRef.current as any).hlsInstance;
      }
    };
  }, [currentTrack]);

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