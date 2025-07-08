'use client';

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Hls from 'hls.js';
import { Track, AudioState, PlaybackAnalytics, UserInteraction, AudioActions } from '@/types/audio';

interface AudioContextType extends AudioState, AudioActions {}

const AudioContext = createContext<AudioContextType | null>(null);

// Audio reducer for state management
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
  | { type: 'CLEAR_QUEUE' };

const initialState: AudioState = {
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
};

function audioReducer(state: AudioState, action: AudioActionType): AudioState {
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
    default:
      return state;
  }
}

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playbackStartTime = useRef<Date | null>(null);
  const playbackAnalytics = useRef<PlaybackAnalytics[]>([]);
  const userInteractions = useRef<UserInteraction[]>([]);
  const hasReportedPlay = useRef<boolean>(false);
  const seekCount = useRef<number>(0);

  // Initialize audio element and HLS
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.crossOrigin = 'anonymous'; 
    // Check if HLS is supported
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
    });
    hlsRef.current = hls;

    const handleLoadStart = () => dispatch({ type: 'SET_LOADING', payload: true });
    const handleCanPlay = () => dispatch({ type: 'SET_LOADING', payload: false });
    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_TIME', payload: { currentTime: 0, duration: audio.duration } });
      dispatch({ type: 'SET_LOADING', payload: false });
    };
    
    const handlePlay = () => {
      dispatch({ type: 'SET_PLAYING', payload: true });
      playbackStartTime.current = new Date();
      hasReportedPlay.current = false;
      seekCount.current = 0;
    };
    
    const handlePause = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      recordPlaybackEnd();
    };
    
    const handleTimeUpdate = () => {
      dispatch({ 
        type: 'SET_TIME', 
        payload: { currentTime: audio.currentTime, duration: audio.duration } 
      });
      
      // Report play after 30 seconds
      if (!hasReportedPlay.current && audio.currentTime >= 30 && state.currentTrack) {
        hasReportedPlay.current = true;
        recordPlay(state.currentTrack);
      }
    };
    
    const handleEnded = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      if (state.currentTrack) {
        recordPlaybackEnd(true);
      }
      handleNext();
    };
    
    const handleError = (e: Event) => {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio' });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // HLS event listeners
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log('HLS media attached');
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('HLS manifest parsed');
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
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
    });

    // Attach HLS to audio element
    hls.attachMedia(audio);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

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

  // Load HLS stream
  const loadHlsStream = useCallback((url: string) => {
    if (!hlsRef.current || !audioRef.current) return;
  
    dispatch({ type: 'SET_LOADING', payload: true });
    
    if (Hls.isSupported()) {
      const hls = hlsRef.current;
      
      // Configure HLS.js with CORS settings
      hls.config.xhrSetup = function(xhr: XMLHttpRequest, url: string) {
        xhr.withCredentials = false; // Don't send cookies
        xhr.setRequestHeader('Accept', '*/*');
      };
  
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audioRef.current?.play().catch(e => {
          console.error('Playback error:', e);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
        });
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          console.error('Network error:', data);
          dispatch({ type: 'SET_ERROR', payload: 'Network error loading stream' });
        }
      });
      
    } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.src = url;
      audioRef.current.addEventListener('loadedmetadata', () => {
        audioRef.current?.play().catch(e => {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
        });
      });
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'HLS is not supported in this browser' });
    }
  }, []);

  // Playback controls
  const play = useCallback(async (track?: Track) => {
    if (!audioRef.current || !hlsRef.current) return;
    
    try {
      if (track && track.id !== state.currentTrack?.id) {
        loadHlsStream(track.url);
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
      } else if (audioRef.current.paused) {
        await audioRef.current.play();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play audio' });
    }
  }, [state.currentTrack, loadHlsStream]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
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
          return; // End of queue
        }
      }
    }
    
    dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
    play(state.queue[nextIndex]);
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled, play]);

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
    
    dispatch({ type: 'SET_CURRENT_INDEX', payload: prevIndex });
    play(state.queue[prevIndex]);
  }, [state.queue, state.currentIndex, state.repeatMode, state.isShuffled, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      seekCount.current += 1;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      dispatch({ type: 'SET_VOLUME', payload: volume });
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !state.isMuted;
      audioRef.current.muted = newMuted;
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