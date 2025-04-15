"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Track } from "@/lib/types"
import { useAudio } from "@/contexts/AudioContext"

interface NewReleasesProps {
  data: {
    heading: string
    HomeRelease: Array<{
      id: string
      heading: string
      title: string
      artworkPath: string
      tag: string
      exclusive: boolean
      artistId: string
      artist: string
      artistArtwork: string
      Tracks: Array<{
        id: number
        title: string
        artist: string
        artistID: string
        album: string
        artworkPath: string
        genre: string
        genreID: number
        duration: string
        path: string
        totalplays: number
        albumID: string
      }>
    }>
  }
}

export function NewReleases({ data }: NewReleasesProps) {
  const { playTrack, setPlaylist } = useAudio()
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlist, setPlaylistState] = useState<Track[]>([])

  const handlePlayRelease = (tracks: Track[], startIndex: number) => {
    // Transform tracks to ensure all necessary fields are included
    const transformedTracks = tracks.map(track => ({
      ...track,
      id: track.id.toString(), // Ensure ID is a string
      genreID: track.genreID.toString(), // Ensure genreID is a string
      explicit: false, // Add explicit field if needed
    }))

    setPlaylist(transformedTracks) // Set the playlist in the audio context
    setPlaylistState(transformedTracks) // Update local playlist state
    setCurrentTrackIndex(startIndex) // Set the current track index
    playTrack(transformedTracks[startIndex]) // Play the selected track
  }

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{data.heading}</h2>
        <Link href="/new-releases" className="text-sm font-medium text-muted-foreground hover:underline">
          View all
        </Link>
      </div>

      <ScrollArea className="w-full">
        <div className="flex">
          {data.HomeRelease.map((release) => (
            <Card key={release.id} className="min-w-[280px] max-w-[280px] border-none bg-muted/40 shadow-none">
              <CardContent className="p-3">
                <div className="group relative mb-2 aspect-square overflow-hidden rounded-md">
                  <Image
                    src={release.artworkPath || "/placeholder.svg"}
                    alt={release.title}
                    width={280}
                    height={280}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 rounded-full"
                      onClick={() => handlePlayRelease(release.Tracks.map(track => ({ 
                        ...track, 
                        id: track.id.toString(), 
                        genreID: track.genreID.toString(), 
                        explicit: false 
                      })), 0)} // Play the first track of the release
                    >
                      <Play className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  {release.exclusive && (
                    <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      Exclusive
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="text-xs font-medium text-muted-foreground">{release.heading}</div>
                </div>
                <Link href={`/album/${release.id}`} className="line-clamp-1 font-semibold hover:underline text-sm">
                  {release.title}
                </Link>
                <div className="flex items-center gap-1 mt-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={release.artistArtwork || "/placeholder.svg"} alt={release.artist} />
                    <AvatarFallback>{release.artist.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link href={`/artist/${release.artistId}`} className="text-xs text-muted-foreground hover:underline">
                    {release.artist}
                  </Link>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{release.tag}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}