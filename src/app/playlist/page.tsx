"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, MoreHorizontal, Music, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchPlaylistData } from "@/lib/actions"
import { formatTime } from "@/lib/utils"
import { useAudio } from "@/contexts/AudioContext"
import { PlaylistInfo, Track } from "@/lib/types"

// Skeleton components for loading state
const CoverSkeleton = () => (
  <div className="w-64 h-64 rounded-md bg-gray-800 animate-pulse"></div>
)

const TextSkeleton = ({ width, height = "h-4", className = "" }: { width: string; height?: string; className?: string }) => (
  <div className={`${width} ${height} bg-gray-800 rounded animate-pulse ${className}`}></div>
)

const TrackSkeleton = () => (
  <div className="grid grid-cols-12 px-6 py-3 items-center">
    <div className="col-span-6 flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-800 rounded animate-pulse"></div>
      <TextSkeleton width="w-32" />
    </div>
    <div className="col-span-3">
      <TextSkeleton width="w-24" />
    </div>
    <div className="col-span-2">
      <TextSkeleton width="w-20" />
    </div>
    <div className="col-span-1 flex justify-end">
      <TextSkeleton width="w-12" />
    </div>
  </div>
)

export default function PlaylistPage() {
  const { playTrack, isPlaying, currentTrack, setPlaylist } = useAudio()
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlist, setPlaylistState] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>({
    id: "Hip-Hop in Spatial Audio",
    name: "Hip-Hop in Spatial Audio",
    owner: "Mwonya Media",
    cover: "/images/playlist-cover.jpg",
    description: "Mwonya Media",
    category: "Apple Music Hip-Hop/Rap",
    status: "1",
    total: 1
  })

  const playlist_id = 'mwP_mobile6b2496c8fe_daylist'

  useEffect(() => {
    const loadPlaylistData = async () => {
      setLoading(true)
      try {
        const playlistData = await fetchPlaylistData(playlist_id)
        
        if (!playlistData || !playlistData.Playlists) {
          throw new Error('Invalid playlist data received')
        }

        // Ensure we have both playlist info and tracks
        if (playlistData.Playlists.length < 2) {
          throw new Error('Incomplete playlist data')
        }

        const tracks = playlistData.Playlists[1]?.Tracks?.filter((track: Track) => track.id !== null) || []
        const info = playlistData.Playlists[0] || playlistInfo
        
        if (tracks.length === 0) {
          throw new Error('No tracks found in playlist')
        }

        setPlaylistState(tracks)
        setPlaylistInfo(info)
        setPlaylist(tracks)
      } catch (error) {
        console.error('Error loading playlist:', error)
        // Keep the loading state false to show error UI
      } finally {
        setLoading(false)
      }
    }

    loadPlaylistData()
  }, [playlist_id])

  const playAll = (shuffle: boolean) => {
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        {/* Header section */}
        <div className="flex flex-col md:flex-row p-4 md:p-6 gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            {loading ? (
              <CoverSkeleton />
            ) : (
              <div className="w-64 h-64 relative rounded-md overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary-foreground/50 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-primary-foreground px-4 text-center">{playlistInfo.name}</h2>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-primary-foreground text-sm opacity-70">Apple Music</span>
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
            )}
          </div>
          
          {/* Playlist Info */}
          <div className="flex flex-col justify-between flex-1 relative">
            <div className="bottom-0 absolute">
              {loading ? (
                <>
                  <TextSkeleton width="w-64" height="h-8" />
                  <div className="mt-2">
                    <TextSkeleton width="w-48" />
                  </div>
                  <div className="mt-4">
                    <TextSkeleton width="w-full max-w-md" />
                    <TextSkeleton width="w-3/4 max-w-sm" height="h-4" />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="w-24 h-10 bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="w-28 h-10 bg-gray-800 rounded-full animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{playlistInfo.name}</h1>
                  <p className="text-primary mb-4">{playlistInfo.category}</p>
                  <p className="text-muted-foreground mb-6 pr-4 md:pr-20 line-clamp-3">
                    {playlistInfo.description}
                  </p>
                
                  <div className="flex gap-3">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 flex items-center gap-1"
                      onClick={() => playAll(false)}
                    >
                      <Play size={18} fill="currentColor" />
                      <span>Play all</span>
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10 rounded-full px-6 py-2 flex items-center gap-1"
                      onClick={() => playAll(true)}
                    >
                      <Shuffle size={18} className="text-primary" />
                      <span>Shuffle</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
            
          </div>
        </div>
        
        {/* Tracks section */}
        <div className="mt-6">
          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-2 border-b border-border text-muted-foreground text-sm">
            <div className="col-span-6">Song</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-2">Album</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
          
          {/* Track list */}
          {loading ? (
            // Skeleton loaders for tracks
            Array(8).fill(0).map((_, index) => (
              <TrackSkeleton key={index} />
            ))
          ) : (
            playlist.map((track: Track, index: number) => (
              <div 
                key={track.id}
                className={`grid grid-cols-12 px-6 py-3 items-center hover:bg-accent/50 cursor-pointer group ${
                  currentTrack?.id === track.id ? "bg-accent" : ""
                }`}
                onClick={() => handleTrackClick(index)}
              >
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-10 h-10 relative flex-shrink-0 bg-accent-foreground/20 rounded">
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
                        <Music size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${currentTrack?.id === track.id ? "text-primary" : ""}`}>
                      {track.title}
                    </span>
                    {track.explicit && (
                      <div className="bg-accent-foreground/30 text-xs text-accent-foreground px-1 rounded">E</div>
                    )}
                  </div>
                </div>
                <div className="col-span-3 text-muted-foreground truncate">{track.artist}</div>
                <div className="col-span-2 text-muted-foreground truncate">
                  {track.album}
                </div>
                <div className="col-span-1 text-right text-muted-foreground flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 p-1 h-auto w-auto">
                    <MoreHorizontal size={16} />
                  </Button>
                  <span>{formatTime(Number(track.duration))}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}