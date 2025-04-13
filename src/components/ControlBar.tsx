'use client';

import { useAudio } from "@/contexts/AudioContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

const ControlBar = () => {
  const {
    isPlaying,
    currentTrack,
    togglePlay,
    currentTime,
    duration,
    playPreviousTrack,
    playNextTrack,
    setVolume,
    setCurrentTime,
    volume,
    nextTrack,
    previousTrack,
    isBuffering
  } = useAudio();

  const user  = {
    name: "Pkasemer",
    image: "https://assets.mwonya.com/images/daylistcover.png"
  }
  
  // Added states for new functionality
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: { currentTarget: any; clientX: number; }) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * Number(duration);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: { target: { value: string; }; }) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
    // Implement shuffle functionality in AudioContext
  };

  const toggleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3);
    // Implement repeat functionality in AudioContext
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between sticky bottom-0 z-10 w-full h-[70px] shadow-lg">
      {/* Track Info */}
      <div className="flex items-center space-x-4 w-1/4">
        {currentTrack ? (
          <>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
              {currentTrack.artworkPath && (
                <Image
                  src={currentTrack.artworkPath}
                  alt={currentTrack.title}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button
              className="text-slate-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:scale-110 transition-all duration-200"
              title="Like"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">No track selected</div>
        )}
      </div>

      {/* Main Playback Controls */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl">
        <div className="flex items-center gap-4 mb-2">
          {/* Shuffle Button */}
          <button
            onClick={toggleShuffle}
            className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition p-1
              ${isShuffleOn ? 'text-blue-500 dark:text-blue-400' : ''}`}
            title="Shuffle"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.586 17l-2.293 2.293a1 1 0 001.414 1.414l3.998-3.998a.995.995 0 00.004-1.418l-4.002-4.002a1 1 0 00-1.414 1.414L18.586 15H15a6 6 0 01-5.367-3.32l-3.94-7.88a4 4 0 00-3.571-2.223H2a1 1 0 000 2h.122a2 2 0 011.786 1.112l3.94 7.88A8 8 0 0015 17h3.586zM2 12a1 1 0 011-1h.122a2 2 0 011.786 1.112l.764 1.528a1 1 0 101.788-.894l-.764-1.528A4 4 0 003.122 9H2a1 1 0 000 2zm15-5h-2.586l2.293-2.293a1 1 0 00-1.414-1.414l-3.998 3.998a.995.995 0 00-.004 1.418l4.002 4.002a1 1 0 101.414-1.414L14.414 9H17a2 2 0 011.886 1.344l.75 1.972a1 1 0 001.88-.716l-.75-1.972A4 4 0 0017 7z" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition 
              ${!previousTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Previous"
            onClick={playPreviousTrack}
            disabled={!previousTrack}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full p-2.5 transition-colors"
            title={isPlaying ? "Pause" : "Play"}
            disabled={isBuffering}
          >
            {isBuffering ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button
            className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition
              ${!nextTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={playNextTrack}
            title="Next"
            disabled={!nextTrack}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>

          {/* Repeat Button */}
          <button
            onClick={toggleRepeat}
            className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition p-1
              ${repeatMode > 0 ? 'text-blue-500 dark:text-blue-400' : ''}`}
            title={repeatMode === 0 ? "Repeat Off" : repeatMode === 1 ? "Repeat All" : "Repeat One"}
          >
            {repeatMode === 2 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 17H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2zm2-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <text x="12" y="15" fontSize="8" textAnchor="middle" fill="currentColor">1</text>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center w-full px-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 w-10">{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 mx-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 dark:bg-blue-600 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition rounded-full"
              style={{ width: `${Number(duration) > 0 ? (currentTime / Number(duration)) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-right">{formatTime(Number(duration))}</span>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center gap-4 w-1/4 justify-end">
        {/* Lyrics Button */}
        <button
          onClick={toggleLyrics}
          className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition p-1
            ${showLyrics ? 'text-blue-500 dark:text-blue-400' : ''}`}
          title="Lyrics"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm10-9h-8v2h8v-2zm0 4h-8v2h8v-2zm-4-8V4l5 5h-5z" />
          </svg>
        </button>

        {/* Queue Button */}
        <button
          onClick={toggleQueue}
          className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition p-1
            ${showQueue ? 'text-blue-500 dark:text-blue-400' : ''}`}
          title="Queue"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 10h12v2H4v-2zm0-4h12v2H4V6zm0 8h8v2H4v-2zm10 0h4v-2h-4v-2h4V8h-4V6h4V2h-4v4H8v2h6v2zm4 6h-4v-2h4v2z" />
          </svg>
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 group relative">
          <button
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1 group-hover:text-slate-700 dark:group-hover:text-white"
            title="Volume"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
            </svg>
          </button>
          <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-lg z-10">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 appearance-none bg-slate-300 dark:bg-slate-600 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 dark:[&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:cursor-pointer transform -rotate-90"
            />
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-700 dark:text-white">{user.name[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlBar;