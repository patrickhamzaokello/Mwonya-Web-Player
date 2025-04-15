import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface FeaturedMixtapesProps {
  data: {
    heading: string
    FeaturedDjMixes: Array<{
      id: string
      title: string
      description: string
      artworkPath: string
      artist: string
      exclusive: boolean
      artistImage: string
      genre: string
      tag: string
    }>
  }
}

export function FeaturedMixtapes({ data }: FeaturedMixtapesProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.heading}</h2>
        <Link href="/mixtapes" className="text-sm font-medium text-muted-foreground hover:underline">
          View all
        </Link>
      </div>
      <ScrollArea className="pb-4">
        <div className="flex gap-4">
          {data.FeaturedDjMixes.map((mixtape) => (
            <div key={mixtape.id} className="min-w-[200px] max-w-[200px]">
              <div className="group relative mb-3 aspect-square overflow-hidden rounded-md">
                <Image
                  src={mixtape.artworkPath || "/placeholder.svg"}
                  alt={mixtape.title}
                  width={200}
                  height={200}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
                    <Play className="h-5 w-5 fill-current" />
                  </Button>
                </div>
                {mixtape.exclusive && (
                  <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    Exclusive
                  </div>
                )}
              </div>
              <Link href={`/mixtape/${mixtape.id}`} className="mb-1 line-clamp-1 font-semibold hover:underline">
                {mixtape.title}
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={mixtape.artistImage || "/placeholder.svg"} alt={mixtape.artist} />
                  <AvatarFallback>{mixtape.artist.charAt(0)}</AvatarFallback>
                </Avatar>
                <Link href={`/artist/${mixtape.id}`} className="text-sm text-muted-foreground hover:underline">
                  {mixtape.artist}
                </Link>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{mixtape.description}</div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
