"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Share2 } from "lucide-react";
import { customUrlImageLoader } from "@/lib/utils";
import { fetchAlbumTracks } from "@/actions/album_tracks_data";
import { useRef, useState, useEffect } from "react";
import { useAudio } from "@/contexts/EnhancedAudioContext";
import Link from "next/link";
import { Album } from "@/types/audio";

interface DiscographyProps {
  albums: Album[];
}

export function Discography({ albums }: DiscographyProps) {
  const [loadingAlbum, setLoadingAlbum] = useState<string | null>(null);

  const { setQueue, play } = useAudio();

  const handlePlayAlbum = async (albumId: string) => {
    try {
      setLoadingAlbum(albumId);

      // Fetch album tracks using a server action instead of a hook
      const tracks = await fetchAlbumTracks(albumId);

      if (tracks && tracks.length > 0) {
        const updatedTracks = tracks.map((track) => ({
          ...track,
          url: track.path,
          artwork: track.artworkPath,
          id: String(track.id),
          duration: Number(track.duration),
          genre: track.genre ?? undefined,
        }));

        setQueue(updatedTracks, 0);
        play(updatedTracks[0]);
      }
    } catch (error) {
      console.error("Error playing album:", error);
    } finally {
      setLoadingAlbum(null);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          Discography
        </h2>

        <div className="flex flex-wrap gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group cursor-pointer transition-transform duration-300 flex-shrink-0 w-[200px] md:w-[250px]"
            >
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <Image
                  src={album.artwork || "/placeholder.svg"}
                  alt={`${album.title} by ${album.artist}`}
                  width={300}
                  height={300}
                  loader={customUrlImageLoader}
                  className="aspect-square object-cover transition-all duration-300 group-hover:brightness-75"
                />

                {/* Hover overlay with buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      className="bg-white/90 hover:bg-white text-black hover:text-black backdrop-blur-sm transition-all duration-200 rounded-full h-10 w-10"
                      onClick={() => handlePlayAlbum(album.id)}
                      disabled={loadingAlbum === album.id}
                    >
                      {loadingAlbum === album.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 rounded-full h-10 w-10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Album info */}
              <div className="mt-3 space-y-1">
                <Link href={`/library/albums/${album.id}`} className="group">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary hover:underline transition-colors duration-200">
                    {album.title}
                  </h3>
                </Link>
                <Link href={`/library/artists/${album.artist}`}>
                  <p className="text-sm text-muted-foreground truncate">
                    {album.artist}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
