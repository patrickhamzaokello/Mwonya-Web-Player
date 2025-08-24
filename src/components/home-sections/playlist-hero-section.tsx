"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Shuffle, Heart, Share2, Plus, Users, Clock, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlaylistSlide {
  id: number
  title: string
  curator: string
  curatorAvatar: string
  description: string
  coverImage: string
  trackCount: number
  duration: string
  followers: string
  lastUpdated: string
  tags: string[]
  mood: string
  gradient: string
  isFollowing: boolean
}

const playlistSlides: PlaylistSlide[] = [
  {
    id: 1,
    title: "Midnight Drive",
    curator: "Alex Rodriguez",
    curatorAvatar: "/placeholder.svg?height=40&width=40",
    description:
      "The perfect soundtrack for late-night drives through the city. Synthwave, retrowave, and ambient electronic beats to fuel your nocturnal adventures.",
    coverImage: "/placeholder.svg?height=300&width=500",
    trackCount: 45,
    duration: "2h 47min",
    followers: "127K",
    lastUpdated: "2 days ago",
    tags: ["Synthwave", "Electronic", "Chill", "Driving"],
    mood: "Nocturnal",
    gradient: "from-purple-900 via-indigo-900 to-blue-900",
    isFollowing: false,
  },
  {
    id: 2,
    title: "Coffee Shop Vibes",
    curator: "Emma Thompson",
    curatorAvatar: "/placeholder.svg?height=40&width=40",
    description:
      "Cozy acoustic melodies and indie folk tunes perfect for your morning coffee ritual. Handpicked tracks to start your day with warmth and inspiration.",
    coverImage: "/placeholder.svg?height=300&width=500",
    trackCount: 38,
    duration: "2h 15min",
    followers: "89K",
    lastUpdated: "1 week ago",
    tags: ["Acoustic", "Indie Folk", "Morning", "Cozy"],
    mood: "Relaxed",
    gradient: "from-amber-900 via-orange-900 to-red-900",
    isFollowing: true,
  },
  {
    id: 3,
    title: "Workout Beast Mode",
    curator: "FitBeats Official",
    curatorAvatar: "/placeholder.svg?height=40&width=40",
    description:
      "High-energy tracks to power through your toughest workouts. From hip-hop bangers to electronic drops that'll keep you moving and motivated.",
    coverImage: "/placeholder.svg?height=300&width=500",
    trackCount: 52,
    duration: "3h 12min",
    followers: "234K",
    lastUpdated: "3 days ago",
    tags: ["Hip-Hop", "Electronic", "High Energy", "Workout"],
    mood: "Energetic",
    gradient: "from-red-900 via-pink-900 to-purple-900",
    isFollowing: false,
  },
  {
    id: 4,
    title: "Sunday Morning Jazz",
    curator: "Jazz Collective",
    curatorAvatar: "/placeholder.svg?height=40&width=40",
    description:
      "Smooth jazz standards and contemporary pieces for a perfect lazy Sunday. Let these timeless melodies create the ideal atmosphere for relaxation.",
    coverImage: "/placeholder.svg?height=300&width=500",
    trackCount: 29,
    duration: "1h 58min",
    followers: "156K",
    lastUpdated: "5 days ago",
    tags: ["Jazz", "Classic", "Smooth", "Sunday"],
    mood: "Sophisticated",
    gradient: "from-emerald-900 via-teal-900 to-cyan-900",
    isFollowing: true,
  },
  {
    id: 5,
    title: "Indie Discoveries",
    curator: "Music Explorer",
    curatorAvatar: "/placeholder.svg?height=40&width=40",
    description:
      "Fresh indie tracks from emerging artists around the world. Discover your next favorite song before it hits the mainstream charts.",
    coverImage: "/placeholder.svg?height=300&width=500",
    trackCount: 67,
    duration: "4h 23min",
    followers: "78K",
    lastUpdated: "1 day ago",
    tags: ["Indie", "Alternative", "New Artists", "Discovery"],
    mood: "Adventurous",
    gradient: "from-violet-900 via-purple-900 to-fuchsia-900",
    isFollowing: false,
  },
]

export function PlaylistHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [followingStates, setFollowingStates] = useState<Record<number, boolean>>(
    playlistSlides.reduce((acc, slide) => ({ ...acc, [slide.id]: slide.isFollowing }), {}),
  )

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % playlistSlides.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + playlistSlides.length) % playlistSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % playlistSlides.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleFollow = (playlistId: number) => {
    setFollowingStates((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }))
  }

  const currentSlideData = playlistSlides[currentSlide]

  return (
    <div className="relative w-full h-[650px] overflow-hidden rounded-2xl bg-black">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-95 transition-all duration-1000`}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
      </div>

      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {playlistSlides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full flex items-center relative">
            <div className="container mx-auto px-8 lg:px-12 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                {/* Content - Takes up 3 columns */}
                <div className="lg:col-span-3 space-y-8 text-white">
                  <div className="space-y-6">
                    {/* Playlist Type & Mood */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        PLAYLIST
                      </Badge>
                      <Badge variant="outline" className="border-white/30 text-white/80">
                        {slide.mood}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight">{slide.title}</h1>

                    {/* Curator Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={slide.curatorAvatar || "/placeholder.svg"}
                        alt={slide.curator}
                        className="w-10 h-10 rounded-full border-2 border-white/30"
                      />
                      <div>
                        <p className="font-medium">Curated by {slide.curator}</p>
                        <p className="text-sm text-white/70">Updated {slide.lastUpdated}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-white/80 leading-relaxed max-w-2xl">{slide.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {slide.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/10 text-white/90 hover:bg-white/20 border-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-white/70">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      <span>{slide.trackCount} songs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{slide.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{slide.followers} followers</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 rounded-full"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-full bg-transparent"
                    >
                      <Shuffle className="h-5 w-5 mr-2" />
                      Shuffle
                    </Button>
                    <Button
                      variant="outline"
                      className={`border-white/30 hover:bg-white/10 rounded-full bg-transparent ${
                        followingStates[slide.id] ? "text-green-400 border-green-400" : "text-white"
                      }`}
                      onClick={() => toggleFollow(slide.id)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${followingStates[slide.id] ? "fill-current" : ""}`} />
                      {followingStates[slide.id] ? "Following" : "Follow"}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Playlist Cover - Takes up 2 columns */}
                <div className="lg:col-span-2 relative flex justify-center lg:justify-end">
                  <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-6 bg-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />

                    {/* Main Cover Image */}
                    <Card className="relative overflow-hidden shadow-2xl rounded-2xl border-0 bg-black/20 backdrop-blur-sm">
                      <div className="relative">
                        <img
                          src={slide.coverImage || "/placeholder.svg"}
                          alt={slide.title}
                          className="w-96 h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <Button
                            size="icon"
                            className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 text-black shadow-2xl"
                          >
                            <Play className="h-10 w-10 ml-1" />
                          </Button>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Track Count Badge */}
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                          {slide.trackCount} tracks
                        </div>
                      </div>
                    </Card>

                    {/* Floating Elements */}
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                      <Music className="h-8 w-8 text-white" />
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
        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-14 h-14"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-7 w-7" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-14 h-14"
        onClick={goToNext}
      >
        <ChevronRight className="h-7 w-7" />
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
        {playlistSlides.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-3 bg-white"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / playlistSlides.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
