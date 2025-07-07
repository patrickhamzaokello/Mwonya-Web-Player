'use client';

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Hls from 'hls.js';
import { Track, AudioState, PlaybackAnalytics, UserInteraction, AudioActions } from '@/types/audio';

interface AudioContextType extends AudioState, AudioActions {
  crossfadeDuration: number;
  setCrossfadeDuration: (duration: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

// Extended audio reducer for crossfading
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
  | { type: 'SET_CROSSFADING'; payload: boolean };

const initialState: AudioState & { crossfadeDuration: number; isCrossfading: boolean } = {
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
  crossfadeDuration: 8, // 8 seconds crossfade
  isCrossfading: false,
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
      return { 
        ...state, 
        queue: newQueue, 
        currentIndex: Math.max(0, Math.min(newIndex, newQueue.length - 1)),
        currentTrack: newQueue[Math.max(0, Math.min(newIndex, newQueue.length - 1))] || null
      };
    case 'CLEAR_QUEUE':
      return { ...state, queue: [], currentIndex: 0, currentTrack: null };
    case 'SET_CROSSFADE_DURATION':
      return { ...state, crossfadeDuration: action.payload };
    case 'SET_CROSSFADING':
      return { ...state, isCrossfading: action.payload };
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
  const playbackAnalytics = useRef<PlaybackAnalytics[]>([]);
  const userInteractions = useRef<UserInteraction[]>([]);
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

  // Initialize dual audio elements and HLS instances
  useEffect(() => {
    const primaryAudio = new Audio();
    const secondaryAudio = new Audio();
    
    primaryAudioRef.current = primaryAudio;
    secondaryAudioRef.current = secondaryAudio;
    
    // Initialize HLS instances
    const primaryHls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
    });
    const secondaryHls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
    });
    
    primaryHlsRef.current = primaryHls;
    secondaryHlsRef.current = secondaryHls;
    
    // Set initial volumes
    primaryAudio.volume = state.volume;
    secondaryAudio.volume = 0; // Secondary starts muted
    
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
          dispatch({ type: 'SET_LOADING', payload: false });
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
          recordPlaybackEnd();
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
          if (timeRemaining <= state.crossfadeDuration && !isPreloadingNextTrack.current) {
            preloadNextTrack();
          }
          
          // Report play after 30 seconds
          if (!hasReportedPlay.current && audio.currentTime >= 30 && state.currentTrack) {
            hasReportedPlay.current = true;
            recordPlay(state.currentTrack);
          }
        }
      };
      
      const handleEnded = () => {
        if (isPrimary === (activeAudioRef.current === 'primary')) {
          dispatch({ type: 'SET_PLAYING', payload: false });
          if (state.currentTrack) {
            recordPlaybackEnd(true);
          }
          // Don't call handleNext here - crossfade will handle it
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

    // Attach HLS to audio elements
    primaryHls.attachMedia(primaryAudio);
    secondaryHls.attachMedia(secondaryAudio);

    // HLS error handling
    const handleHlsError = (hls: Hls) => (event: any, data: any) => {
      console.error('HLS error:', data);
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load HLS stream' });
            break;
        }
      }
    };

    primaryHls.on(Hls.Events.ERROR, handleHlsError(primaryHls));
    secondaryHls.on(Hls.Events.ERROR, handleHlsError(secondaryHls));

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
      
      primaryHls.destroy();
      secondaryHls.destroy();
    };
  }, [state.crossfadeDuration]);

  // Preload next track for crossfading
  const preloadNextTrack = useCallback(() => {
    if (isPreloadingNextTrack.current || state.queue.length === 0) return;
    
    const nextTrack = getNextTrack();
    if (!nextTrack) return;
    
    isPreloadingNextTrack.current = true;
    const { audio, hls } = getInactiveAudio();
    
    if (audio && hls) {
      console.log('Preloading next track:', nextTrack.title);
      loadHlsStream(nextTrack.url, false, hls, audio);
    }
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled]);

  // Get next track based on current playback mode
  const getNextTrack = useCallback((): Track | null => {
    if (state.queue.length === 0) return null;
    
    let nextIndex: number;
    
    if (state.repeatMode === 'one') {
      nextIndex = state.currentIndex;
    } else if (state.isShuffled) {
      nextIndex = Math.floor(Math.random() * state.queue.length);
    } else {
      nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return null; // End of queue
        }
      }
    }
    
    return state.queue[nextIndex];
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled]);

  // Enhanced HLS loading with crossfade support
  const loadHlsStream = useCallback((url: string, autoPlay = true, hlsInstance?: Hls, audioInstance?: HTMLAudioElement) => {
    const hls = hlsInstance || getCurrentAudio().hls;
    const audio = audioInstance || getCurrentAudio().audio;
    
    if (!hls || !audio) return;

    if (!hlsInstance) {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
    }
    
    if (Hls.isSupported()) {
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
      // Fallback for Safari
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
      dispatch({ type: 'SET_ERROR', payload: 'HLS is not supported in this browser' });
    }
  }, []);

  // Crossfade function
  const performCrossfade = useCallback(() => {
    const currentAudio = getCurrentAudio().audio;
    const nextAudio = getInactiveAudio().audio;
    
    if (!currentAudio || !nextAudio) return;
    
    dispatch({ type: 'SET_CROSSFADING', payload: true });
    
    const startTime = Date.now();
    const crossfadeDuration = state.crossfadeDuration * 1000; // Convert to milliseconds
    const baseVolume = state.volume;
    
    // Start playing the next track
    nextAudio.play().catch(e => {
      console.error('Failed to start crossfade:', e);
    });
    
    // Crossfade animation
    const crossfadeStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / crossfadeDuration, 1);
      
      // Smooth crossfade curve (cosine interpolation)
      const fadeOutVolume = baseVolume * Math.cos(progress * Math.PI / 2);
      const fadeInVolume = baseVolume * Math.sin(progress * Math.PI / 2);
      
      currentAudio.volume = fadeOutVolume;
      nextAudio.volume = fadeInVolume;
      
      if (progress < 1) {
        requestAnimationFrame(crossfadeStep);
      } else {
        // Crossfade complete
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.volume = 0;
        nextAudio.volume = baseVolume;
        
        // Switch active audio
        activeAudioRef.current = activeAudioRef.current === 'primary' ? 'secondary' : 'primary';
        isPreloadingNextTrack.current = false;
        
        dispatch({ type: 'SET_CROSSFADING', payload: false });
        
        // Move to next track
        handleNext();
      }
    };
    
    requestAnimationFrame(crossfadeStep);
  }, [state.crossfadeDuration, state.volume]);

  // Analytics functions
  const recordPlaybackEnd = useCallback((completed = false) => {
    if (!playbackStartTime.current || !state.currentTrack) return;
    
    const endTime = new Date();
    const duration = (endTime.getTime() - playbackStartTime.current.getTime()) / 1000;
    
    const analytics: PlaybackAnalytics = {
      trackId: state.currentTrack.id,
      startTime: playbackStartTime.current,
      endTime,
      duration,
      completed: duration >= 30 || completed,
      skipped: !completed && duration < 30,
      seekCount: seekCount.current,
      source: 'playlist',
    };
    
    playbackAnalytics.current.push(analytics);
    console.log('Analytics recorded:', analytics);
  }, [state.currentTrack]);

  const recordPlay = useCallback((track: Track) => {
    console.log('Play recorded for track:', track.title);
  }, []);

  const recordInteraction = useCallback((track: Track, action: UserInteraction['action'], context?: string) => {
    const interaction: UserInteraction = {
      trackId: track.id,
      action,
      timestamp: new Date(),
      context,
    };
    
    userInteractions.current.push(interaction);
    console.log('User interaction recorded:', interaction);
  }, []);

  // Playback controls
  const play = useCallback(async (track?: Track) => {
    const { audio, hls } = getCurrentAudio();
    if (!audio || !hls) return;
    
    try {
      if (track && track.id !== state.currentTrack?.id) {
        // New track - load HLS stream
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
        loadHlsStream(track.url, true);
      } else if (audio.paused) {
        // Same track - just resume
        await audio.play();
      }
    } catch (error) {
      console.error('Play error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
    }
  }, [state.currentTrack, loadHlsStream]);

  const pause = useCallback(() => {
    const { audio } = getCurrentAudio();
    if (audio) {
      audio.pause();
    }
  }, []);

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
    dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
    dispatch({ type: 'SET_CURRENT_TRACK', payload: nextTrack });
    
    // If we're already crossfading, the next track is already loaded
    if (!state.isCrossfading) {
      loadHlsStream(nextTrack.url, true);
    }
  }, [state.queue, state.isCrossfading, getNextTrack, loadHlsStream]);

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
    dispatch({ type: 'SET_CURRENT_INDEX', payload: prevIndex });
    dispatch({ type: 'SET_CURRENT_TRACK', payload: prevTrack });
    loadHlsStream(prevTrack.url, true);
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled, loadHlsStream]);

  const seek = useCallback((time: number) => {
    const { audio } = getCurrentAudio();
    if (audio) {
      audio.currentTime = time;
      seekCount.current += 1;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const { audio } = getCurrentAudio();
    if (audio) {
      audio.volume = volume;
      dispatch({ type: 'SET_VOLUME', payload: volume });
    }
  }, []);

  const toggleMute = useCallback(() => {
    const { audio } = getCurrentAudio();
    if (audio) {
      const newMuted = !state.isMuted;
      audio.muted = newMuted;
      dispatch({ type: 'SET_MUTED', payload: newMuted });
    }
  }, [state.isMuted]);

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

  // Analytics actions
  const trackPlay = useCallback((track: Track, source: string, sourceId?: string) => {
    recordInteraction(track, 'like', `${source}:${sourceId}`);
  }, [recordInteraction]);

  const trackSkip = useCallback((track: Track) => {
    recordPlaybackEnd();
    console.log('Track skipped:', track.title);
  }, [recordPlaybackEnd]);

  const trackComplete = useCallback((track: Track) => {
    console.log('Track completed:', track.title);
  }, []);

  const trackLike = useCallback((track: Track) => {
    recordInteraction(track, 'like');
  }, [recordInteraction]);

  const trackUnlike = useCallback((track: Track) => {
    recordInteraction(track, 'unlike');
  }, [recordInteraction]);

  const trackReport = useCallback((track: Track, reason: string) => {
    recordInteraction(track, 'report', reason);
  }, [recordInteraction]);

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