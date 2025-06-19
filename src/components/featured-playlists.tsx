import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { customLoader } from "@/lib/utils"

interface FeaturedPlaylistsProps {
  data: {
    heading: string
    featuredPlaylists: Array<{
      id: string
      name: string
      owner: string
      exclusive: boolean
      coverurl: string
    }>
  }
}

export function FeaturedPlaylists({ data }: FeaturedPlaylistsProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.heading}</h2>
        <Link href="/playlists" className="text-sm font-medium text-muted-foreground hover:underline">
          View all
        </Link>
      </div>
      <ScrollArea className="pb-4">
        <div className="flex gap-4">
          {data.featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="min-w-[180px] max-w-[180px]">
              <div className="group relative mb-3 aspect-square overflow-hidden rounded-md">
                <Image
                 loader={customLoader}
                  src={playlist.coverurl || "/placeholder.svg"}
                  alt={playlist.name}
                  width={180}
                  height={180}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
                    <Play className="h-5 w-5 fill-current" />
                  </Button>
                </div>
                {playlist.exclusive && (
                  <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    Exclusive
                  </div>
                )}
              </div>
              <Link href={`/playlist/${playlist.id}`} className="mb-1 line-clamp-1 font-semibold hover:underline">
                {playlist.name}
              </Link>
              <div className="text-sm text-muted-foreground">By {playlist.owner}</div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
