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
    if (hlsRef.current) {
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
    }
    hlsRef.current = new Hls({ enableWorker: true, lowLatencyMode: true });
    hlsRef.current.attachMedia(audioRef.current);
    hlsRef.current.loadSource(url);
  }, []);

  const play = useCallback(async (track?: Track) => {
    if (!audioRef.current) return;
    const currentTrack = stateRef.current.currentTrack;
    if (track && track.id !== currentTrack?.id) {
      dispatch({ type: "SET_CURRENT_TRACK", payload: track });
      loadHlsStream(track.url);
      await audioRef.current.play().catch(err => console.error("Play error", err));
    } else {
      await audioRef.current.play().catch(err => console.error("Play error", err));
    }
  }, [loadHlsStream]);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onEnded = () => {
      dispatch({ type: "SET_PLAYING", payload: false });
      if (stateRef.current.currentTrack) recordPlaybackEnd(true);
      handleNext();
    };

    const onPlay = () => {
      dispatch({ type: "SET_PLAYING", payload: true });
      playbackStartTime.current = new Date();
      hasReportedPlay.current = false;
      seekCount.current = 0;
    };

    const onTimeUpdate = () => {
      if (!audioRef.current) return;
      dispatch({
        type: "SET_TIME",
        payload: {
          currentTime: audioRef.current.currentTime,
          duration: audioRef.current.duration,
        },
      });
      if (
        !hasReportedPlay.current &&
        audioRef.current.currentTime >= 30 &&
        stateRef.current.currentTrack
      ) {
        hasReportedPlay.current = true;
        recordPlay(stateRef.current.currentTrack);
      }
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [recordPlaybackEnd, handleNext, recordPlay]);

  const contextValue: AudioContextType = {
    ...state,
    play,
    pause,
    togglePlay: () => (state.isPlaying ? pause() : play()),
    next: handleNext,
    previous: () => {
      const state = stateRef.current;
      if (state.queue.length === 0 || state.currentIndex <= 0) return;
      const prevIndex = state.currentIndex - 1;
      dispatch({ type: "SET_CURRENT_INDEX", payload: prevIndex });
      play(state.queue[prevIndex]);
    },
    seek: (time) => { if (audioRef.current) audioRef.current.currentTime = time },
    setVolume: (volume) => { if (audioRef.current) audioRef.current.volume = volume },
    toggleMute: () => {
      if (audioRef.current) {
        const muted = !state.isMuted;
        audioRef.current.muted = muted;
        dispatch({ type: "SET_MUTED", payload: muted });
      }
    },
    setQueue: (tracks, index = 0) => {
      dispatch({ type: "SET_QUEUE", payload: { tracks, index } });
      play(tracks[index]);
    },
    addToQueue: (track) => dispatch({ type: "ADD_TO_QUEUE", payload: track }),
    removeFromQueue: (index) => dispatch({ type: "REMOVE_FROM_QUEUE", payload: index }),
    clearQueue: () => dispatch({ type: "CLEAR_QUEUE" }),
    toggleShuffle: () => dispatch({ type: "SET_SHUFFLE", payload: !state.isShuffled }),
    setRepeatMode: (mode) => dispatch({ type: "SET_REPEAT", payload: mode }),
    trackPlay: (track, src, srcId) => userInteractions.current.push({ trackId: track.id, action: "like", timestamp: new Date(), context: `${src}:${srcId}` }),
    trackSkip: (track) => { recordPlaybackEnd(); console.log("Skipped", track.title); },
    trackComplete: (track) => console.log("Completed", track.title),
    trackLike: (track) => userInteractions.current.push({ trackId: track.id, action: "like", timestamp: new Date() }),
    trackUnlike: (track) => userInteractions.current.push({ trackId: track.id, action: "unlike", timestamp: new Date() }),
    trackReport: (track, reason) => userInteractions.current.push({ trackId: track.id, action: "report", timestamp: new Date(), context: reason }),
  };

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
}
