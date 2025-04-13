"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, MoreHorizontal, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchPlaylistData } from "@/lib/actions"
import { formatTime } from "@/lib/utils"
import { useAudio } from "@/contexts/AudioContext"
import { PlaylistInfo, Track } from "@/lib/types"



export default function PlaylistPage() {
  const { playTrack, isPlaying, currentTrack, setPlaylist } = useAudio()
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlist, setPlaylistState] = useState<Track[]>([])
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>({

    id: "Hip-Hop in Spatial Audio",
    name: "Hip-Hop in Spatial Audio",
    owner: "Mwonya Media",
    cover:  "/images/playlist-cover.jpg",
    description: "Mwonya Media",
    category: "Apple Music Hip-Hop/Rap",
    status: "1",
    total: 1
  })

  useEffect(() => {
    const loadPlaylistData = async () => {
      try {
        const playlistData = await fetchPlaylistData('mwP_mobile6b2496c8fe_daylist')
        const tracks = playlistData?.Playlists?.[1]?.Tracks?.filter((track: Track) => track.id !== null) || []
        const info = playlistData?.Playlists?.[0] || playlistInfo
        
        setPlaylistState(tracks)
        setPlaylistInfo(info)
        
        if (tracks.length > 0) {
          setPlaylist(tracks)
        }
      } catch (error) {
        console.error('Error loading playlist:', error)
      }
    }

    loadPlaylistData()
  }, [setPlaylist])

  const playAll = (shuffle:boolean) => {
    if (playlist.length > 0) {
      let tracksToPlay = [...playlist];
      
      // if shuffle is true, randomize the playlist
      if(shuffle){
        for (let i = tracksToPlay.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tracksToPlay[i], tracksToPlay[j]] = [tracksToPlay[j], tracksToPlay[i]];
        }
      }
      
      setCurrentTrackIndex(0)
      setPlaylist(tracksToPlay)
      playTrack(tracksToPlay[0])
    }
  }

  const handleTrackClick = (index: number) => {
    if (playlist[index]) {
      setCurrentTrackIndex(index)
      setPlaylist(playlist)
      playTrack(playlist[index])
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1">
        {/* Header section */}
        <div className="flex p-6 gap-6">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 relative rounded-md overflow-hidden bg-blue-600">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-800 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white px-4 text-center">{playlistInfo.name}</h2>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-white text-sm opacity-70">Apple Music</span>
              </div>
              {playlistInfo.cover && (
                <Image
                  src={playlistInfo.cover}
                  alt={playlistInfo.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">{playlistInfo.name}</h1>
              <p className="text-red-500 mb-4">{playlistInfo.category}</p>
              <p className="text-gray-400 mb-6 pr-20 line-clamp-3">
                {playlistInfo.description}
              </p>
            
            <div className="flex gap-3">
            <button className="bg-red-600 text-white rounded-full px-6 py-2 font-semibold flex items-center justify-center gap-1 hover:bg-red-700 transition-colors" onClick={() => playAll(false)}>
                <Play size={18} fill="white" className="ml-1" />
                <span>Play all</span>
              </button>
              <button className="bg-primary text-white rounded-full px-6 py-2 font-semibold flex items-center justify-center gap-1 hover:bg-red-700 transition-colors" onClick={() => playAll(true)}>
                <Play size={18} fill="white" className="ml-1" />
                <span>Shuffle all</span>
              </button>
            </div>
            </div>
            <div className="flex items-center">
              <MoreHorizontal size={24} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Tracks section */}
        <div className="mt-6">
          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-2 border-b border-gray-800 text-gray-500 text-sm">
            <div className="col-span-6">Song</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-2">Album</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
          
          {/* Track list */}
          {playlist.map((track: Track, index: number) => (
            <div 
              key={track.id}
              className={`grid grid-cols-12 px-6 py-3 items-center hover:bg-gray-900 cursor-pointer group ${
                currentTrack?.id === track.id ? "bg-gray-800" : ""
              }`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="col-span-6 flex items-center gap-4">
                <div className="w-10 h-10 relative flex-shrink-0 bg-gray-800 rounded">
                  {track.artworkPath ? (
                    <Image
                      src={track.artworkPath}
                      alt={track.id}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <Music size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${currentTrack?.id === track.id ? "text-red-500" : ""}`}>
                    {track.title}
                  </span>
                  {track.explicit && (
                    <div className="bg-gray-600 text-xs text-gray-300 px-1 rounded">E</div>
                  )}
                </div>
              </div>
              <div className="col-span-3 text-gray-400">{track.artist}</div>
              <div className="col-span-2 text-gray-400 truncate" key={track.album}>
                {track.album}
              </div>
              <div className="col-span-1 text-right text-gray-400 flex items-center justify-end gap-2">
                <MoreHorizontal size={16} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                <span>{formatTime(Number(track.duration))}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}