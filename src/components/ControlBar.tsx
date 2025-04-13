'use client';

import { useAudio } from "@/contexts/AudioContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState } from "react";

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
    previousTrack
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
    <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-4 flex items-center justify-between sticky top-0 z-10">
      {/* Playback Controls - Reduced width */}
      <div className="flex items-center gap-2 w-1/6 min-w-[120px]">
        <button
          className={`text-gray-300 hover:text-white transition p-1 ${!previousTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Previous"
          onClick={playPreviousTrack}
          disabled={!previousTrack}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>
        <button
          onClick={togglePlay}
          className="text-gray-300 hover:text-white transition p-1"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          className={`text-gray-300 hover:text-white transition p-1 ${!nextTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={playNextTrack}
          title="Next"
          disabled={!nextTrack}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>

      {/* Track Info - Expanded to take most space */}
      <div className="flex-1 flex items-center justify-center max-w-2xl w-4/6  bg-[#313131]">
        {currentTrack ? (
          <>
            <div className="w-15 h-15 bg-[#282828] overflow-hidden flex-shrink-0">
              {currentTrack.artworkPath && (
                <Image
                  src={currentTrack.artworkPath}
                  alt={currentTrack.title}
                  width={50}
                  height={50}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-center overflow-hidden w-full p-1 relative">
              <div className="flex items-center justify-center">
                <h3 className="text-xs font-medium text-white truncate">
                  {currentTrack.title}
                </h3>
                
              </div>

              <div className="flex flex-row gap 4 justify-center mb-1">
                <p className="flex text-xs text-gray-400 truncate ">
                  {currentTrack.artist}
                </p>

                <p className="flex text-xs text-gray-400 truncate">
                  <span className="text-xs text-gray-400">—</span>

                  {currentTrack.album}
                </p>
              </div>


              <div className="flex flex-col items-center absolute w-full bottom-0">
                <div className="w-full flex flex-row justify-between">
                  <span className="flex text-xs text-gray-400">{formatTime(currentTime)}</span>
                  <span className="flex text-xs text-gray-400">{formatTime(Number(duration))}</span>
                </div>
                <div
                  className="w-full h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-white hover:bg-gray-200 transition rounded-full"
                    style={{ width: `${Number(duration) > 0 ? (currentTime / Number(duration)) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <button
                  className="text-gray-400 hover:text-white p-1 flex-shrink-0"
                  title="Like"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
          </>
        ) : (
          <div className="text-xs text-gray-400">No track selected</div>
        )}
      </div>

      {/* Additional Controls - Reduced width */}
      <div className="flex items-center gap-2 w-1/6 min-w-[100px] justify-end">
        <button
          className="text-gray-400 hover:text-white p-1"
          title="Volume"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
          </svg>
        </button>
        <div className="relative w-16">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full appearance-none bg-gray-600 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        {user && (
          <div className="w-6 h-6 rounded-full overflow-hidden cursor-pointer">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user.name[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlBar;