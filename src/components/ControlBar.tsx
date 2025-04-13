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

  const { user } = useAuth();

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

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between sticky bottom-0 z-10 w-full h-[56px] shadow-md">
      <div>
        <header className="flex h-14 shrink-0 items-center gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />


        </header>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-3 w-1/6 min-w-[140px]">
        <button
          className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition p-1 ${!previousTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Previous"
          onClick={playPreviousTrack}
          disabled={!previousTrack}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>
        <button
          onClick={togglePlay}
          className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full p-1.5 transition-colors"
          title={isPlaying ? "Pause" : "Play"}
          disabled={isBuffering}
        >
          {isBuffering ? (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-grey-100 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition p-1 ${!nextTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={playNextTrack}
          title="Next"
          disabled={!nextTrack}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>

      {/* Track Info */}
      <div className="flex-1 flex items-center justify-center max-w-2xl w-4/6 px-4">
        {currentTrack ? (
          <>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
              {currentTrack.artworkPath && (
                <Image
                  src={currentTrack.artworkPath}
                  alt={currentTrack.title}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-center overflow-hidden w-full px-4 relative">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {currentTrack.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {currentTrack.artist}
                </p>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {currentTrack.album}
                </p>
              </div>

              <div className="flex items-center w-full mt-0.5">
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
            <button
              className="text-slate-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:scale-110 p-1 ml-2 transition-all duration-200"
              title="Like"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400 py-4">No track selected</div>
        )}
      </div>

      {/* Additional Controls */}
      <div className="flex items-center gap-3 w-1/6 min-w-[120px] justify-end">
        <div className="flex items-center space-x-2 group relative">
          <button
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1 group-hover:text-slate-700 dark:group-hover:text-white"
            title="Volume"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
            </svg>
          </button>
          <div className="w-16 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full appearance-none bg-slate-300 dark:bg-slate-600 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 dark:[&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
        {user && (
          <div className="w-7 h-7 rounded-full overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={28}
                height={28}
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