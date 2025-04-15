import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface FeaturedGenresProps {
  data: {
    heading: string
    featuredGenres: Array<{
      id: number
      name: string
      tag: string
    }>
  }
}

export function FeaturedGenres({ data }: FeaturedGenresProps) {
  // Generate a color based on the genre name for visual variety
  const getGenreColor = (name: string) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-green-500",
      "from-amber-500 to-yellow-500",
      "from-orange-500 to-red-500",
      "from-fuchsia-500 to-pink-500",
      "from-sky-500 to-blue-500",
    ]

    // Use the sum of character codes to pick a color
    const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[sum % colors.length]
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.heading}</h2>
        <Link href="/genres" className="text-sm font-medium text-muted-foreground hover:underline">
          View all
        </Link>
      </div>
      <ScrollArea className="pb-4">
        <div className="flex gap-3">
          {data.featuredGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}`}
              className={`flex min-w-[120px] items-center justify-center rounded-full bg-gradient-to-r ${getGenreColor(
                genre.name,
              )} px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105`}
            >
              {genre.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
