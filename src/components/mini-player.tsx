import Image from "next/image"
import { Play, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function MiniPlayer() {
  // In a real app, this would be connected to a global audio player state
  const isPlaying = false
  const currentTrack = null

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-2 md:p-4">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Album cover"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="line-clamp-1 font-medium">Track Title</div>
            <div className="line-clamp-1 text-sm text-muted-foreground">Artist Name</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <SkipBack className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button size="icon" className="h-10 w-10 rounded-full">
            <Play className="h-5 w-5 fill-current" />
            <span className="sr-only">Play</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <SkipForward className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <div className="hidden flex-1 items-center gap-2 md:flex">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <Slider defaultValue={[70]} max={100} step={1} className="w-28" />
        </div>
      </div>
    </div>
  )
}
