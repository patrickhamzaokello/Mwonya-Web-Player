"use client"

import Image from "next/image"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"

export default function ArtistTopSongs() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const artistsWithSongs = [
    {
      id: 1,
      name: "Luna Eclipse",
      artwork: "/placeholder.svg?height=300&width=300",
      topSongs: [
        {
          id: 1,
          title: "Midnight Dreams",
          duration: "3:42",
          plays: "12.5M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          title: "Starlit Nights",
          duration: "4:15",
          plays: "8.9M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 3,
          title: "Cosmic Dance",
          duration: "3:28",
          plays: "6.2M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    {
      id: 2,
      name: "Neon Pulse",
      artwork: "/placeholder.svg?height=300&width=300",
      topSongs: [
        {
          id: 4,
          title: "Electric Nights",
          duration: "3:55",
          plays: "15.2M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 5,
          title: "Synth Wave",
          duration: "4:02",
          plays: "11.8M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 6,
          title: "Digital Love",
          duration: "3:33",
          plays: "9.4M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    {
      id: 3,
      name: "Coastal Vibes",
      artwork: "/placeholder.svg?height=300&width=300",
      topSongs: [
        {
          id: 7,
          title: "Ocean Waves",
          duration: "4:20",
          plays: "7.8M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 8,
          title: "Summer Breeze",
          duration: "3:45",
          plays: "5.9M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 9,
          title: "Sunset Glow",
          duration: "4:10",
          plays: "4.3M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    {
      id: 4,
      name: "City Sounds",
      artwork: "/placeholder.svg?height=300&width=300",
      topSongs: [
        {
          id: 10,
          title: "Urban Symphony",
          duration: "3:58",
          plays: "18.7M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 11,
          title: "Street Lights",
          duration: "4:25",
          plays: "13.2M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 12,
          title: "Metro Beats",
          duration: "3:15",
          plays: "10.6M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    {
      id: 5,
      name: "Sunset Collective",
      artwork: "/placeholder.svg?height=300&width=300",
      topSongs: [
        {
          id: 13,
          title: "Golden Hour",
          duration: "5:12",
          plays: "9.1M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 14,
          title: "Warm Embrace",
          duration: "4:33",
          plays: "6.8M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 15,
          title: "Evening Glow",
          duration: "3:47",
          plays: "5.2M",
          artwork: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
  ]

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 5)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const itemWidth = 350 + 24 // item width + gap
      const itemsToScroll = Math.floor(containerWidth / itemWidth)
      const scrollDistance = itemsToScroll * itemWidth

      container.scrollBy({
        left: -scrollDistance,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const itemWidth = 350 + 24 // item width + gap
      const itemsToScroll = Math.floor(containerWidth / itemWidth)
      const scrollDistance = itemsToScroll * itemWidth

      container.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      checkScrollButtons()

      const handleScroll = () => checkScrollButtons()
      const handleResize = () => {
        setTimeout(checkScrollButtons, 100)
      }

      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleResize)

      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Artist Top Hits</h2>
          <p className="text-muted-foreground">Explore the most popular tracks from trending artists</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-10 w-10 rounded-full bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-10 w-10 rounded-full bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {artistsWithSongs.map((artist) => (
            <div key={artist.id} className="flex-shrink-0 w-[320px] md:w-[350px] bg-card rounded-lg p-6 border">
              {/* Artist Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative overflow-hidden rounded-full bg-muted">
                  <Image
                    src={artist.artwork || "/placeholder.svg"}
                    alt={`${artist.name} profile picture`}
                    width={80}
                    height={80}
                    className="aspect-square object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{artist.name}</h3>
                  <p className="text-sm text-muted-foreground">Top 3 Songs</p>
                </div>
              </div>

              {/* Top Songs List */}
              <div className="space-y-3">
                {artist.topSongs.map((song, index) => (
                  <div
                    key={song.id}
                    className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-6 h-6 text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </div>

                    <div className="relative overflow-hidden rounded bg-muted">
                      <Image
                        src={song.artwork || "/placeholder.svg"}
                        alt={`${song.title} artwork`}
                        width={40}
                        height={40}
                        className="aspect-square object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground">{song.plays} plays</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{song.duration}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
