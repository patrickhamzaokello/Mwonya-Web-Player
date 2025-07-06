"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Share2, Plus, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MusicSlide {
  id: number
  type: "album" | "artist" | "playlist" | "podcast"
  title: string
  subtitle: string
  description: string
  image: string
  artist?: string
  genre: string
  duration?: string
  tracks?: number
  plays?: string
  gradient: string
}

const musicSlides: MusicSlide[] = [
  {
    id: 1,
    type: "album",
    title: "Midnight Echoes",
    subtitle: "New Album Release",
    description:
      "Experience the latest masterpiece from indie sensation Luna Rivers. A journey through ambient soundscapes and ethereal melodies.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Luna Rivers",
    genre: "Indie Electronic",
    duration: "42 min",
    tracks: 12,
    plays: "2.3M",
    gradient: "from-purple-900 via-blue-900 to-indigo-900",
  },
  {
    id: 2,
    type: "artist",
    title: "Artist Spotlight",
    subtitle: "Rising Star",
    description:
      "Discover the breakthrough artist taking the world by storm. Neo Soul meets modern R&B in this incredible collection.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Maya Chen",
    genre: "Neo Soul",
    plays: "15.7M",
    gradient: "from-rose-900 via-pink-900 to-purple-900",
  },
  {
    id: 3,
    type: "playlist",
    title: "Chill Vibes Only",
    subtitle: "Curated Playlist",
    description:
      "The perfect soundtrack for your relaxing moments. Hand-picked tracks to help you unwind and find your zen.",
    image: "/placeholder.svg?height=400&width=400",
    genre: "Chill/Ambient",
    duration: "3h 24min",
    tracks: 47,
    plays: "890K",
    gradient: "from-emerald-900 via-teal-900 to-cyan-900",
  },
  {
    id: 4,
    type: "podcast",
    title: "Music Makers",
    subtitle: "Featured Podcast",
    description:
      "Go behind the scenes with today's hottest producers and artists. Learn the stories behind your favorite tracks.",
    image: "/placeholder.svg?height=400&width=400",
    genre: "Music Interview",
    duration: "45 min",
    plays: "1.2M",
    gradient: "from-orange-900 via-red-900 to-pink-900",
  },
]

export function MusicHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % musicSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + musicSlides.length) % musicSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % musicSlides.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const currentSlideData = musicSlides[currentSlide]

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl bg-black">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-90 transition-all duration-1000`}
      />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-32 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-2000" />
      </div>

      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {musicSlides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full flex items-center relative">
            <div className="container mx-auto px-8 lg:px-12 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="space-y-8 text-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wide">
                        {slide.subtitle}
                      </span>
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs">{slide.genre}</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight">{slide.title}</h1>
                    {slide.artist && <p className="text-xl text-white/80 font-medium">by {slide.artist}</p>}
                  </div>

                  <p className="text-lg text-white/70 leading-relaxed max-w-lg">{slide.description}</p>

                  {/* Stats */}
                  <div className="flex gap-6 text-sm text-white/60">
                    {slide.tracks && <span>{slide.tracks} tracks</span>}
                    {slide.duration && <span>{slide.duration}</span>}
                    {slide.plays && <span>{slide.plays} plays</span>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 rounded-full"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Play Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 rounded-full bg-transparent"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current text-red-500" : ""}`} />
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Album Art / Image */}
                <div className="relative flex justify-center">
                  <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

                    {/* Main Image */}
                    <Card className="relative overflow-hidden shadow-2xl rounded-2xl border-0">
                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        className="w-80 h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="icon"
                          className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-black"
                        >
                          <Play className="h-8 w-8 ml-1" />
                        </Button>
                      </div>
                    </Card>

                    {/* Floating Music Note */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                      <Volume2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-12 h-12"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-12 h-12"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Play/Pause Control */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full"
        onClick={togglePlayPause}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {musicSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-8 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Waveform Visualization */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div className="flex items-end h-full space-x-1 px-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="bg-green-500 rounded-t animate-pulse"
              style={{
                height: `${Math.random() * 100}%`,
                width: "2px",
                animationDelay: `${i * 50}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
