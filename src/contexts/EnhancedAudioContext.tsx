"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Hls from "hls.js";
import {
  Track,
  AudioState,
  PlaybackAnalytics,
  UserInteraction,
  AudioActions,
} from "@/types/audio";

interface AudioContextType extends AudioState, AudioActions {}

const AudioContext = createContext<AudioContextType | null>(null);

// Reducer setup
const initialState: AudioState = {
  isPlaying: false,
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: "off",
  currentTime: 0,
  duration: 0,
  isLoading: false,
  error: null,
};

function audioReducer(state: AudioState, action: any): AudioState {
  switch (action.type) {
    case "SET_PLAYING": return { ...state, isPlaying: action.payload };
    case "SET_CURRENT_TRACK": return { ...state, currentTrack: action.payload };
    case "SET_QUEUE":
      return {
        ...state,
        queue: action.payload.tracks,
        currentIndex: action.payload.index,
        currentTrack: action.payload.tracks[action.payload.index] || null,
      };
    case "SET_CURRENT_INDEX":
      return {
        ...state,
        currentIndex: action.payload,
        currentTrack: state.queue[action.payload] || null,
      };
    case "SET_VOLUME": return { ...state, volume: action.payload };
    case "SET_MUTED": return { ...state, isMuted: action.payload };
    case "SET_SHUFFLE": return { ...state, isShuffled: action.payload };
    case "SET_REPEAT": return { ...state, repeatMode: action.payload };
    case "SET_TIME":
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: action.payload.duration,
      };
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "ADD_TO_QUEUE": return { ...state, queue: [...state.queue, action.payload] };
    case "REMOVE_FROM_QUEUE": {
      const newQueue = state.queue.filter((_, idx) => idx !== action.payload);
      const newIndex = action.payload < state.currentIndex ? state.currentIndex - 1 : state.currentIndex;
      const safeIndex = Math.max(0, Math.min(newIndex, newQueue.length - 1));
      return {
        ...state,
        queue: newQueue,
        currentIndex: safeIndex,
        currentTrack: newQueue[safeIndex] || null,
      };
    }
    case "CLEAR_QUEUE": return { ...state, queue: [], currentIndex: 0, currentTrack: null };
    case "UPDATE_TRACK": {
      const updatedQueue = state.queue.map(track => 
        track.id === action.payload.id ? action.payload : track
      );
      return {
        ...state,
        queue: updatedQueue,
        currentTrack: state.currentTrack?.id === action.payload.id ? action.payload : state.currentTrack,
      };
    }
    default: return state;
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state }, [state]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playbackStartTime = useRef<Date | null>(null);
  const playbackAnalytics = useRef<PlaybackAnalytics[]>([]);
  const userInteractions = useRef<UserInteraction[]>([]);
  const hasReportedPlay = useRef(false);
  const seekCount = useRef(0);

  const recordPlaybackEnd = useCallback((completed = false) => {
    const currentTrack = stateRef.current.currentTrack;
    if (!playbackStartTime.current || !currentTrack) return;

    const endTime = new Date();
    const duration = (endTime.getTime() - playbackStartTime.current.getTime()) / 1000;

    const analytics: PlaybackAnalytics = {
      trackId: currentTrack.id,
      startTime: playbackStartTime.current,
      endTime,
      duration,
      completed: duration >= 30 || completed,
      skipped: !completed && duration < 30,
      seekCount: seekCount.current,
      source: "playlist",
    };
    playbackAnalytics.current.push(analytics);
    console.log("Analytics recorded:", analytics);
  }, []);

  const recordPlay = useCallback((track: Track) => {
    console.log("Play recorded:", track.title);
  }, []);

  const handleNext = useCallback(() => {
    const currentState = stateRef.current;
    if (currentState.queue.length === 0) return;

    let nextIndex = currentState.currentIndex + 1;
    if (currentState.repeatMode === "one") nextIndex = currentState.currentIndex;
    else if (currentState.isShuffled) nextIndex = Math.floor(Math.random() * currentState.queue.length);
    else if (nextIndex >= currentState.queue.length) {
      if (currentState.repeatMode === "all") nextIndex = 0;
      else return;
    }

    dispatch({ type: "SET_CURRENT_INDEX", payload: nextIndex });
    play(currentState.queue[nextIndex]);
  }, []);

  const loadHlsStream = useCallback((url: string) => {
    if (!audioRef.current) return;
    
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    // Check if it's an HLS stream
    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls({ 
          enableWorker: true, 
          lowLatencyMode: true,
          debug: false,
        });
        
        hlsRef.current.loadSource(url);
        hlsRef.current.attachMedia(audioRef.current);
        
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          dispatch({ type: "SET_LOADING", payload: false });
        });
        
        hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          dispatch({ type: "SET_ERROR", payload: `HLS Error: ${data.details}` });
          dispatch({ type: "SET_LOADING", payload: false });
        });
      } else {
        dispatch({ type: "SET_ERROR", payload: "HLS not supported" });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      // Regular audio file
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }
  }, []);

  const play = useCallback(async (track?: Track) => {
    if (!audioRef.current) return;
    
    try {
      const currentTrack = stateRef.current.currentTrack;
      
      if (track && track.id !== currentTrack?.id) {
        // Playing a new track
        dispatch({ type: "SET_CURRENT_TRACK", payload: track });
        dispatch({ type: "SET_LOADING", payload: true });
        
        // Record end of previous track
        if (currentTrack) {
          recordPlaybackEnd(false);
        }
        
        loadHlsStream(track.url);
        
        // Wait for the audio to be ready
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            resolve(undefined);
          };
          
          const onError = () => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            reject(new Error('Audio load error'));
          };
          
          audioRef.current?.addEventListener('canplay', onCanPlay);
          audioRef.current?.addEventListener('error', onError);
        });
        
        dispatch({ type: "SET_LOADING", payload: false });
      }
      
      // Play the audio
      await audioRef.current.play();
      dispatch({ type: "SET_PLAYING", payload: true });
      
    } catch (error) {
      console.error("Play error:", error);
      dispatch({ type: "SET_ERROR", payload: `Playback error: ${error}` });
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_PLAYING", payload: false });
    }
  }, [loadHlsStream, recordPlaybackEnd]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      dispatch({ type: "SET_PLAYING", payload: false });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (stateRef.current.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      seekCount.current += 1;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      dispatch({ type: "SET_VOLUME", payload: volume });
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const muted = !stateRef.current.isMuted;
      audioRef.current.muted = muted;
      dispatch({ type: "SET_MUTED", payload: muted });
    }
  }, []);

  const previous = useCallback(() => {
    const state = stateRef.current;
    if (state.queue.length === 0 || state.currentIndex <= 0) return;
    
    const prevIndex = state.currentIndex - 1;
    dispatch({ type: "SET_CURRENT_INDEX", payload: prevIndex });
    play(state.queue[prevIndex]);
  }, [play]);

  const setQueue = useCallback((tracks: Track[], index = 0) => {
    dispatch({ type: "SET_QUEUE", payload: { tracks, index } });
    if (tracks.length > 0) {
      play(tracks[index]);
    }
  }, [play]);

  const addToQueue = useCallback((track: Track) => {
    dispatch({ type: "ADD_TO_QUEUE", payload: track });
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    dispatch({ type: "REMOVE_FROM_QUEUE", payload: index });
  }, []);

  const clearQueue = useCallback(() => {
    dispatch({ type: "CLEAR_QUEUE" });
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: "SET_SHUFFLE", payload: !stateRef.current.isShuffled });
  }, []);

  const setRepeatMode = useCallback((mode: "off" | "all" | "one") => {
    dispatch({ type: "SET_REPEAT", payload: mode });
  }, []);

  const trackLike = useCallback((track: Track) => {
    const updatedTrack = { ...track, isLiked: true };
    dispatch({ type: "UPDATE_TRACK", payload: updatedTrack });
    userInteractions.current.push({ 
      trackId: track.id, 
      action: "like", 
      timestamp: new Date() 
    });
  }, []);

  const trackUnlike = useCallback((track: Track) => {
    const updatedTrack = { ...track, isLiked: false };
    dispatch({ type: "UPDATE_TRACK", payload: updatedTrack });
    userInteractions.current.push({ 
      trackId: track.id, 
      action: "unlike", 
      timestamp: new Date() 
    });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onLoadStart = () => {
      dispatch({ type: "SET_LOADING", payload: true });
    };

    const onCanPlay = () => {
      dispatch({ type: "SET_LOADING", payload: false });
    };

    const onEnded = () => {
      dispatch({ type: "SET_PLAYING", payload: false });
      if (stateRef.current.currentTrack) {
        recordPlaybackEnd(true);
      }
      handleNext();
    };

    const onPlay = () => {
      dispatch({ type: "SET_PLAYING", payload: true });
      playbackStartTime.current = new Date();
      hasReportedPlay.current = false;
      seekCount.current = 0;
    };

    const onPause = () => {
      dispatch({ type: "SET_PLAYING", payload: false });
    };

    const onTimeUpdate = () => {
      if (!audioRef.current) return;
      
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      if (!isNaN(currentTime) && !isNaN(duration)) {
        dispatch({
          type: "SET_TIME",
          payload: { currentTime, duration },
        });
        
        if (
          !hasReportedPlay.current &&
          currentTime >= 30 &&
          stateRef.current.currentTrack
        ) {
          hasReportedPlay.current = true;
          recordPlay(stateRef.current.currentTrack);
        }
      }
    };

    const onError = () => {
      dispatch({ type: "SET_ERROR", payload: "Audio playback error" });
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_PLAYING", payload: false });
    };

    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("error", onError);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [recordPlaybackEnd, handleNext, recordPlay]);

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
    trackPlay: (track, src, srcId) => {
      userInteractions.current.push({ 
        trackId: track.id, 
        action: "play", 
        timestamp: new Date(), 
        context: `${src}:${srcId}` 
      });
    },
    trackSkip: (track) => { 
      recordPlaybackEnd(); 
      console.log("Skipped", track.title); 
    },
    trackComplete: (track) => console.log("Completed", track.title),
    trackLike,
    trackUnlike,
    trackReport: (track, reason) => {
      userInteractions.current.push({ 
        trackId: track.id, 
        action: "report", 
        timestamp: new Date(), 
        context: reason 
      });
    },
  };

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
}