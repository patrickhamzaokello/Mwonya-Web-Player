"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"

export default function FeaturedArtists() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const artists = [
    {
      id: 1,
      name: "Luna Eclipse",
      genre: "Electronic",
      followers: "2.1M",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Neon Pulse",
      genre: "Synthwave",
      followers: "1.8M",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Coastal Vibes",
      genre: "Indie Pop",
      followers: "950K",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "City Sounds",
      genre: "Hip Hop",
      followers: "3.2M",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 5,
      name: "Sunset Collective",
      genre: "Ambient",
      followers: "720K",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 6,
      name: "Cyber Hearts",
      genre: "Future Bass",
      followers: "1.4M",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 7,
      name: "Alpine Echo",
      genre: "Folk Rock",
      followers: "680K",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 8,
      name: "Cosmic Melody",
      genre: "Space Rock",
      followers: "890K",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 9,
      name: "Soul Station",
      genre: "R&B",
      followers: "2.5M",
      artwork: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 10,
      name: "Retro Wave",
      genre: "Synthpop",
      followers: "1.2M",
      artwork: "/placeholder.svg?height=300&width=300",
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
      const itemWidth = 250 + 24 // item width + gap
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
      const itemWidth = 250 + 24 // item width + gap
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Featured Artists</h2>
          <p className="text-muted-foreground">Discover talented artists across different genres</p>
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
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group cursor-pointer transition-transform duration-300 flex-shrink-0 w-[200px] md:w-[250px]"
            >
              <div className="relative overflow-hidden rounded-full bg-muted">
                <Image
                  src={artist.artwork || "/placeholder.svg"}
                  alt={`${artist.name} profile picture`}
                  width={300}
                  height={300}
                  className="aspect-square object-cover transition-all duration-300 group-hover:brightness-90"
                />
              </div>

              {/* Artist info */}
              <div className="mt-4 text-center space-y-1">
                <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors duration-200">
                  {artist.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{artist.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
