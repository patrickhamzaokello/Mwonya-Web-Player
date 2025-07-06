"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Track } from "@/lib/home_feed_types"

interface WeeklyTopSectionProps {
  tracks: Track[]
  heading: string
  subheading: string
  weekArtist: string
  weekDate: string
  weekImage: string
}

export function WeeklyTopSection({
  tracks,
  heading,
  subheading,
  weekArtist,
  weekDate,
  weekImage,
}: WeeklyTopSectionProps) {
  return (
    <div className="w-full mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{heading}</h2>
        <p className="text-muted-foreground">{subheading}</p>
        <div className="flex items-center gap-4 mt-4">
          <Image
            src={weekImage || "/placeholder.svg"}
            alt={weekArtist}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{weekArtist}</p>
            <p className="text-sm text-muted-foreground">{weekDate}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="space-y-3">
          {tracks.slice(0, 10).map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-8 h-8 text-lg font-bold text-muted-foreground">
                {track.position || index + 1}
              </div>

              <div className="relative overflow-hidden rounded bg-muted">
                <Image
                  src={(track.artworkPath as string) || "/placeholder.svg"}
                  alt={track.title}
                  width={50}
                  height={50}
                  className="aspect-square object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{track.duration}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
