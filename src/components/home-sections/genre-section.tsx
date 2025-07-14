"use client"

import { ChevronLeft, ChevronRight, Music, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import type { Genre } from "@/lib/home_feed_types"

interface GenreSectionProps {
  genres: Genre[]
  heading: string
}

const genreStyles = [
  {
    bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: "text-emerald-300",
    hover: "hover:bg-gradient-to-br hover:from-emerald-500/30 hover:to-teal-500/30"
  },
  {
    bg: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
    icon: "text-blue-300",
    hover: "hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-indigo-500/30"
  },
  {
    bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
    icon: "text-purple-300",
    hover: "hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-pink-500/30"
  },
  {
    bg: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
    text: "text-orange-400",
    icon: "text-orange-300",
    hover: "hover:bg-gradient-to-br hover:from-orange-500/30 hover:to-red-500/30"
  },
  {
    bg: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    icon: "text-cyan-300",
    hover: "hover:bg-gradient-to-br hover:from-cyan-500/30 hover:to-blue-500/30"
  },
  {
    bg: "bg-gradient-to-br from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/30",
    text: "text-rose-400",
    icon: "text-rose-300",
    hover: "hover:bg-gradient-to-br hover:from-rose-500/30 hover:to-pink-500/30"
  },
  {
    bg: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    icon: "text-yellow-300",
    hover: "hover:bg-gradient-to-br hover:from-yellow-500/30 hover:to-orange-500/30"
  },
  {
    bg: "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    text: "text-violet-400",
    icon: "text-violet-300",
    hover: "hover:bg-gradient-to-br hover:from-violet-500/30 hover:to-purple-500/30"
  },
]

export function GenreSection({ genres, heading }: GenreSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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
      const itemWidth = 160 + 16
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
      const itemWidth = 160 + 16
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
      const handleResize = () => setTimeout(checkScrollButtons, 100)

      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleResize)

      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div className="w-full mb-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-8 w-8 rounded-full border-border hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-8 w-8 rounded-full border-border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {genres.map((genre, index) => {
          const style = genreStyles[index % genreStyles.length]
          
          return (
            <div
              key={genre.id}
              className={`
                flex-shrink-0 w-[160px] h-[120px] rounded-lg border backdrop-blur-sm
                ${style.bg} ${style.border} ${style.hover}
                p-4 cursor-pointer transition-all duration-300 
                hover:scale-105 hover:shadow-lg group
              `}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <Headphones className={`w-6 h-6 ${style.icon} group-hover:scale-110 transition-transform`} />
                  <div className={`w-2 h-2 rounded-full ${style.text.replace('text-', 'bg-')} opacity-60`} />
                </div>
                
                <div>
                  <h3 className={`${style.text} font-semibold text-base leading-tight`}>
                    {genre.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1 opacity-70">
                    Genre
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}