'use client';

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Hls from 'hls.js';

// Define types
export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  url: string;
  duration?: number;
  isLiked?: boolean;
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
  isCrossfading: boolean;
  nextTrack: Track | null;
}

export interface AudioActions {
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  trackPlay: (track: Track, source: string, sourceId?: string) => void;
  trackSkip: (track: Track) => void;
  trackComplete: (track: Track) => void;
  trackLike: (track: Track) => void;
  trackUnlike: (track: Track) => void;
  trackReport: (track: Track, reason: string) => void;
}

interface AudioContextType extends AudioState, AudioActions {
  crossfadeDuration: number;
  setCrossfadeDuration: (duration: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

type AudioActionType =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TRACK'; payload: Track | null }
  | { type: 'SET_QUEUE'; payload: { tracks: Track[]; index: number } }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_SHUFFLE'; payload: boolean }
  | { type: 'SET_REPEAT'; payload: 'off' | 'all' | 'one' }
  | { type: 'SET_TIME'; payload: { currentTime: number; duration: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_QUEUE'; payload: Track }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_CROSSFADE_DURATION'; payload: number }
  | { type: 'SET_CROSSFADING'; payload: boolean }
  | { type: 'SET_NEXT_TRACK'; payload: Track | null }
  | { type: 'UPDATE_TRACK_LIKE'; payload: { id: string; isLiked: boolean } };

const initialState: AudioState & { crossfadeDuration: number } = {
  isPlaying: false,
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'off',
  currentTime: 0,
  duration: 0,
  isLoading: false,
  error: null,
  isCrossfading: false,
  nextTrack: null,
  crossfadeDuration: 8,
};

function audioReducer(state: typeof initialState, action: AudioActionType): typeof initialState {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_QUEUE':
      return { 
        ...state, 
        queue: action.payload.tracks, 
        currentIndex: action.payload.index,
        currentTrack: action.payload.tracks[action.payload.index] || null
      };
    case 'SET_CURRENT_INDEX':
      return { 
        ...state, 
        currentIndex: action.payload,
        currentTrack: state.queue[action.payload] || null
      };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    case 'SET_SHUFFLE':
      return { ...state, isShuffled: action.payload };
    case 'SET_REPEAT':
      return { ...state, repeatMode: action.payload };
    case 'SET_TIME':
      return { ...state, currentTime: action.payload.currentTime, duration: action.payload.duration };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'REMOVE_FROM_QUEUE':
      const newQueue = state.queue.filter((_, index) => index !== action.payload);
      const newIndex = action.payload < state.currentIndex ? state.currentIndex - 1 : state.currentIndex;
      const adjustedIndex = Math.max(0, Math.min(newIndex, newQueue.length - 1));
      return { 
        ...state, 
        queue: newQueue, 
        currentIndex: adjustedIndex,
        currentTrack: newQueue[adjustedIndex] || null
      };
    case 'CLEAR_QUEUE':
      return { ...state, queue: [], currentIndex: 0, currentTrack: null };
    case 'SET_CROSSFADE_DURATION':
      return { ...state, crossfadeDuration: action.payload };
    case 'SET_CROSSFADING':
      return { ...state, isCrossfading: action.payload };
    case 'SET_NEXT_TRACK':
      return { ...state, nextTrack: action.payload };
    case 'UPDATE_TRACK_LIKE':
      return {
        ...state,
        currentTrack: state.currentTrack?.id === action.payload.id 
          ? { ...state.currentTrack, isLiked: action.payload.isLiked }
          : state.currentTrack,
        queue: state.queue.map(track => 
          track.id === action.payload.id 
            ? { ...track, isLiked: action.payload.isLiked }
            : track
        )
      };
    default:
      return state;
  }
}

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  
  // Dual audio setup for crossfading
  const primaryAudioRef = useRef<HTMLAudioElement | null>(null);
  const secondaryAudioRef = useRef<HTMLAudioElement | null>(null);
  const primaryHlsRef = useRef<Hls | null>(null);
  const secondaryHlsRef = useRef<Hls | null>(null);
  
  // Keep track of which audio element is currently active
  const activeAudioRef = useRef<'primary' | 'secondary'>('primary');
  
  // Crossfading refs
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const crossfadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPreloadingNextTrack = useRef<boolean>(false);
  
  // Analytics refs
  const playbackStartTime = useRef<Date | null>(null);
  const hasReportedPlay = useRef<boolean>(false);
  const seekCount = useRef<number>(0);

  // Get current active audio element and HLS instance
  const getCurrentAudio = useCallback(() => {
    return activeAudioRef.current === 'primary' 
      ? { audio: primaryAudioRef.current, hls: primaryHlsRef.current }
      : { audio: secondaryAudioRef.current, hls: secondaryHlsRef.current };
  }, []);

  const getInactiveAudio = useCallback(() => {
    return activeAudioRef.current === 'primary' 
      ? { audio: secondaryAudioRef.current, hls: secondaryHlsRef.current }
      : { audio: primaryAudioRef.current, hls: primaryHlsRef.current };
  }, []);

  // Get next track based on current playback mode
  const getNextTrack = useCallback((): Track | null => {
    if (state.queue.length === 0) return null;
    
    let nextIndex: number;
    
    if (state.repeatMode === 'one') {
      return state.currentTrack;
    } else if (state.isShuffled) {
      // For shuffle, avoid repeating the current track
      const availableIndices = state.queue
        .map((_, index) => index)
        .filter(index => index !== state.currentIndex);
      if (availableIndices.length === 0) return state.currentTrack;
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return null;
        }
      }
    }
    
    return state.queue[nextIndex];
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled, state.currentTrack]);

  // Enhanced crossfading function
  const performCrossfade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement) => {
    if (crossfadeIntervalRef.current) {
      clearInterval(crossfadeIntervalRef.current);
    }

    dispatch({ type: 'SET_CROSSFADING', payload: true });

    const steps = 20;
    const stepDuration = (state.crossfadeDuration * 1000) / steps;
    let currentStep = 0;

    const initialFromVolume = fromAudio.volume;
    const targetToVolume = state.volume;

    crossfadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Fade out current audio
      fromAudio.volume = initialFromVolume * (1 - progress);
      
      // Fade in next audio
      toAudio.volume = targetToVolume * progress;

      if (currentStep >= steps) {
        // Crossfade complete
        clearInterval(crossfadeIntervalRef.current!);
        
        // Pause the old audio
        fromAudio.pause();
        fromAudio.currentTime = 0;
        fromAudio.volume = targetToVolume;
        
        // Switch active audio reference
        activeAudioRef.current = activeAudioRef.current === 'primary' ? 'secondary' : 'primary';
        
        dispatch({ type: 'SET_CROSSFADING', payload: false });
        isPreloadingNextTrack.current = false;
        
        console.log('Crossfade completed');
      }
    }, stepDuration);
  }, [state.crossfadeDuration, state.volume]);

  // Enhanced preload next track function
  const preloadNextTrack = useCallback(() => {
    if (isPreloadingNextTrack.current || state.queue.length === 0) return;
    
    const nextTrack = getNextTrack();
    if (!nextTrack) return;
    
    isPreloadingNextTrack.current = true;
    dispatch({ type: 'SET_NEXT_TRACK', payload: nextTrack });
    
    const { audio: inactiveAudio, hls: inactiveHls } = getInactiveAudio();
    if (!inactiveAudio) return;

    console.log('Preloading next track:', nextTrack.title);

    // Load the next track into the inactive audio element
    if (inactiveHls && Hls.isSupported()) {
      inactiveHls.loadSource(nextTrack.url);
      
      const handleManifestParsed = () => {
        console.log('Next track preloaded and ready');
        inactiveHls.off(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
      };
      
      inactiveHls.on(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
    } else if (inactiveAudio.canPlayType('application/vnd.apple.mpegurl')) {
      inactiveAudio.src = nextTrack.url;
      inactiveAudio.load();
    } else {
      inactiveAudio.src = nextTrack.url;
      inactiveAudio.load();
    }
  }, [getNextTrack, getInactiveAudio, state.queue.length]);

  // Initialize dual audio elements and HLS instances
  useEffect(() => {
    const primaryAudio = new Audio();
    const secondaryAudio = new Audio();
    
    primaryAudioRef.current = primaryAudio;
    secondaryAudioRef.current = secondaryAudio;
    
    // Initialize HLS instances only if supported
    let primaryHls: Hls | null = null;
    let secondaryHls: Hls | null = null;
    
    if (Hls.isSupported()) {
      primaryHls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      secondaryHls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      
      primaryHlsRef.current = primaryHls;
      secondaryHlsRef.current = secondaryHls;
      
      // Attach HLS to audio elements
      primaryHls.attachMedia(primaryAudio);
      secondaryHls.attachMedia(secondaryAudio);
    }
    
    // Set initial volumes
    primaryAudio.volume = state.volume;
    secondaryAudio.volume = 0;
    
    // Event handlers factory
    const createEventHandlers = (audio: HTMLAudioElement, isPrimary: boolean) => {
      const handleLoadStart = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_LOADING', payload: true });
        }
      };
      
      const handleCanPlay = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      };
      
      const handleLoadedMetadata = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_TIME', payload: { currentTime: 0, duration: audio.duration } });
        }
      };
      
      const handlePlay = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_PLAYING', payload: true });
          playbackStartTime.current = new Date();
          hasReportedPlay.current = false;
          seekCount.current = 0;
        }
      };
      
      const handlePause = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_PLAYING', payload: false });
        }
      };
      
      const handleTimeUpdate = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ 
            type: 'SET_TIME', 
            payload: { currentTime: audio.currentTime, duration: audio.duration } 
          });
          
          // Start crossfade when approaching end of track
          const timeRemaining = audio.duration - audio.currentTime;
          if (timeRemaining <= state.crossfadeDuration && !isPreloadingNextTrack.current && !state.isCrossfading) {
            preloadNextTrack();
            
            // Start crossfade if next track is ready
            const { audio: inactiveAudio } = getInactiveAudio();
            if (inactiveAudio && inactiveAudio.readyState >= 2) {
              // Set the inactive audio to start position and play
              inactiveAudio.currentTime = 0;
              inactiveAudio.volume = 0;
              inactiveAudio.play().then(() => {
                performCrossfade(audio, inactiveAudio);
                
                // Update current track after crossfade starts
                const nextTrack = getNextTrack();
                if (nextTrack) {
                  const nextIndex = state.queue.findIndex(t => t.id === nextTrack.id);
                  if (nextIndex !== -1) {
                    dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
                  }
                }
              }).catch(e => {
                console.error('Failed to start crossfade:', e);
              });
            }
          }
          
          // Report play after 30 seconds
          if (!hasReportedPlay.current && audio.currentTime >= 30) {
            hasReportedPlay.current = true;
          }
        }
      };
      
      const handleEnded = () => {
        if (isPrimary === (activeAudioRef.current === 'primary') && !state.isCrossfading) {
          dispatch({ type: 'SET_PLAYING', payload: false });
          handleNext();
        }
      };
      
      const handleError = (e: Event) => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio' });
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      };

      return {
        handleLoadStart,
        handleCanPlay,
        handleLoadedMetadata,
        handlePlay,
        handlePause,
        handleTimeUpdate,
        handleEnded,
        handleError
      };
    };

    // Attach event listeners
    const primaryHandlers = createEventHandlers(primaryAudio, true);
    const secondaryHandlers = createEventHandlers(secondaryAudio, false);

    Object.entries(primaryHandlers).forEach(([event, handler]) => {
      const eventName = event.replace('handle', '').toLowerCase();
      primaryAudio.addEventListener(eventName, handler);
    });

    Object.entries(secondaryHandlers).forEach(([event, handler]) => {
      const eventName = event.replace('handle', '').toLowerCase();
      secondaryAudio.addEventListener(eventName, handler);
    });

    return () => {
      // Cleanup
      Object.entries(primaryHandlers).forEach(([event, handler]) => {
        const eventName = event.replace('handle', '').toLowerCase();
        primaryAudio.removeEventListener(eventName, handler);
      });

      Object.entries(secondaryHandlers).forEach(([event, handler]) => {
        const eventName = event.replace('handle', '').toLowerCase();
        secondaryAudio.removeEventListener(eventName, handler);
      });
      
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
      }
      
      if (primaryHls) {
        primaryHls.destroy();
      }
      if (secondaryHls) {
        secondaryHls.destroy();
      }
    };
  }, [state.crossfadeDuration, state.isCrossfading, preloadNextTrack, performCrossfade, getInactiveAudio, getNextTrack, state.queue]);

  // Load HLS stream
  const loadHlsStream = useCallback((url: string, autoPlay = true) => {
    const { audio, hls } = getCurrentAudio();
    if (!audio) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    if (hls && Hls.isSupported()) {
      hls.loadSource(url);
      
      const handleManifestParsed = () => {
        if (autoPlay) {
          audio.play().catch(e => {
            console.error('Autoplay failed:', e);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
          });
        }
        hls.off(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
      };
      
      hls.on(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = url;
      const handleLoadedMetadata = () => {
        if (autoPlay) {
          audio.play().catch(e => {
            console.error('Autoplay failed:', e);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
          });
        }
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    } else {
      audio.src = url;
      if (autoPlay) {
        audio.play().catch(e => {
          console.error('Autoplay failed:', e);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
        });
      }
    }
  }, [getCurrentAudio]);

  // Playback controls
  const play = useCallback(async (track?: Track) => {
    const { audio } = getCurrentAudio();
    if (!audio) return;
    
    try {
      if (track && track.id !== state.currentTrack?.id) {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
        const trackIndex = state.queue.findIndex(t => t.id === track.id);
        if (trackIndex !== -1) {
          dispatch({ type: 'SET_CURRENT_INDEX', payload: trackIndex });
        }
        loadHlsStream(track.url, true);
      } else if (audio.paused) {
        await audio.play();
      }
    } catch (error) {
      console.error('Play error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
    }
  }, [state.currentTrack, state.queue, loadHlsStream, getCurrentAudio]);

  const pause = useCallback(() => {
    const { audio } = getCurrentAudio();
    if (audio) {
      audio.pause();
    }
  }, [getCurrentAudio]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const handleNext = useCallback(() => {
    if (state.queue.length === 0) return;
    
    const nextTrack = getNextTrack();
    if (!nextTrack) return;
    
    const nextIndex = state.queue.findIndex(track => track.id === nextTrack.id);
    if (nextIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: nextTrack });
      loadHlsStream(nextTrack.url, true);
      
      // Reset preloading flag
      isPreloadingNextTrack.current = false;
    }
  }, [state.queue, getNextTrack, loadHlsStream]);

  const previous = useCallback(() => {
    if (state.queue.length === 0) return;
    
    let prevIndex: number;
    
    if (state.repeatMode === 'one') {
      prevIndex = state.currentIndex;
    } else if (state.isShuffled) {
      prevIndex = Math.floor(Math.random() * state.queue.length);
    } else {
      prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        if (state.repeatMode === 'all') {
          prevIndex = state.queue.length - 1;
        } else {
          prevIndex = 0;
        }
      }
    }
    
    const prevTrack = state.queue[prevIndex];
    if (prevTrack) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: prevIndex });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: prevTrack });
      loadHlsStream(prevTrack.url, true);
    }
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled, loadHlsStream]);

  const seek = useCallback((time: number) => {
    const { audio } = getCurrentAudio();
    if (audio) {
      audio.currentTime = time;
      seekCount.current += 1;
    }
  }, [getCurrentAudio]);

  const setVolume = useCallback((volume: number) => {
    const { audio } = getCurrentAudio();
    if (audio) {
      audio.volume = volume;
      dispatch({ type: 'SET_VOLUME', payload: volume });
    }
  }, [getCurrentAudio]);

  const toggleMute = useCallback(() => {
    const { audio } = getCurrentAudio();
    if (audio) {
      const newMuted = !state.isMuted;
      audio.muted = newMuted;
      dispatch({ type: 'SET_MUTED', payload: newMuted });
    }
  }, [state.isMuted, getCurrentAudio]);

  // Queue management
  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    dispatch({ type: 'SET_QUEUE', payload: { tracks, index: startIndex } });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: index });
  }, []);

  const clearQueue = useCallback(() => {
    dispatch({ type: 'CLEAR_QUEUE' });
  }, []);

  // Playback modes
  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'SET_SHUFFLE', payload: !state.isShuffled });
  }, [state.isShuffled]);

  const setRepeatMode = useCallback((mode: 'off' | 'all' | 'one') => {
    dispatch({ type: 'SET_REPEAT', payload: mode });
  }, []);

  // Crossfade settings
  const setCrossfadeDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_CROSSFADE_DURATION', payload: Math.max(0, Math.min(duration, 30)) });
  }, []);

  // Analytics and interaction tracking
  const trackPlay = useCallback((track: Track, source: string, sourceId?: string) => {
    console.log('Track play:', track.title, 'Source:', source);
  }, []);

  const trackSkip = useCallback((track: Track) => {
    console.log('Track skipped:', track.title);
  }, []);

  const trackComplete = useCallback((track: Track) => {
    console.log('Track completed:', track.title);
  }, []);

  const trackLike = useCallback((track: Track) => {
    dispatch({ type: 'UPDATE_TRACK_LIKE', payload: { id: track.id, isLiked: true } });
    console.log('Track liked:', track.title);
  }, []);

  const trackUnlike = useCallback((track: Track) => {
    dispatch({ type: 'UPDATE_TRACK_LIKE', payload: { id: track.id, isLiked: false } });
    console.log('Track unliked:', track.title);
  }, []);

  const trackReport = useCallback((track: Track, reason: string) => {
    console.log('Track reported:', track.title, 'Reason:', reason);
  }, []);

  const contextValue: AudioContextType = {
    ...state,
    play,
    pause,
    togglePlay,
    next: handleNext,
    previous,
    seek,
    setVolume,
    toggleMute,
    setQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    toggleShuffle,
    setRepeatMode,
    trackPlay,
    trackSkip,
    trackComplete,
    trackLike,
    trackUnlike,
    trackReport,
    crossfadeDuration: state.crossfadeDuration,
    setCrossfadeDuration,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}