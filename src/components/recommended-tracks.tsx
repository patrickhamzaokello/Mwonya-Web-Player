import Image from "next/image"
import Link from "next/link"
import { formatDuration } from "@/lib/utils"
import { Play, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RecommendedTracksProps {
  data: {
    heading: string
    Tracks: Array<{
      id: string
      title: string
      artist: string
      artistID: string
      album: string
      artworkPath: string
      genre: string
      genreID: string
      duration: string
      path: string
      totalplays: number
      albumID: string
    }>
  }
}

export function RecommendedTracks({ data }: RecommendedTracksProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.heading}</h2>
        <Link href="/recommendations" className="text-sm font-medium text-muted-foreground hover:underline">
          View all
        </Link>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recommended for you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {data.Tracks.map((track) => (
              <div key={track.id} className="group flex items-center gap-3 rounded-md p-2 hover:bg-muted">
                <div className="flex w-8 items-center justify-center">
                  <Play className="hidden h-4 w-4 fill-current group-hover:block" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 group-hover:hidden">
                    <Play className="h-4 w-4" />
                    <span className="sr-only">Play</span>
                  </Button>
                </div>
                <div className="relative h-10 w-10 overflow-hidden rounded">
                  <Image
                    src={track.artworkPath || "/placeholder.svg"}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="line-clamp-1 font-medium">{track.title}</div>
                  <Link
                    href={`/artist/${track.artistID}`}
                    className="line-clamp-1 text-sm text-muted-foreground hover:underline"
                  >
                    {track.artist}
                  </Link>
                </div>
                <div className="hidden text-sm text-muted-foreground md:block">
                  {formatDuration(Number.parseFloat(track.duration))}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                    <DropdownMenuItem>Add to queue</DropdownMenuItem>
                    <DropdownMenuItem>Go to artist</DropdownMenuItem>
                    <DropdownMenuItem>Go to album</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
