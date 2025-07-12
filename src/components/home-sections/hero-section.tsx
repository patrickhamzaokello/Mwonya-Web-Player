"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Share2,
  Plus,
  Volume2,
  CheckCircle,
  Clock,
  Music,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import type { NewRelease } from "@/lib/home_feed_types"
import { useAudio } from "@/contexts/EnhancedAudioContext"
import { customUrlImageLoader } from "@/lib/utils"

interface MusicHeroSliderProps {
  releases: NewRelease[]
}

export function MusicHeroSlider({ releases }: MusicHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const { setQueue, play, currentTrack, isPlaying } = useAudio()

  const heroReleases = releases || []

  useEffect(() => {
    if (!isAutoPlaying || heroReleases.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroReleases.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, heroReleases.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroReleases.length) % heroReleases.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroReleases.length)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const handlePlayRelease = (release: NewRelease) => {
    const tracks = release.Tracks || []
    if (tracks && tracks.length > 0) {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        url: track.path,
        id: String(track.id),
        artwork: release.artworkPath,
        duration: Number(track.duration),
        genre: track.genre ?? undefined,
      }))
      setQueue(updatedTracks, 0)
      play(updatedTracks[0])
    }
  }

  const getBackgroundGradient = (index: number) => {
    const gradients = [
      "from-violet-600 via-purple-600 to-blue-600",
      "from-pink-500 via-rose-500 to-orange-500",
      "from-emerald-500 via-teal-500 to-cyan-500",
      "from-indigo-600 via-blue-600 to-purple-600",
      "from-orange-500 via-red-500 to-pink-500",
      "from-teal-600 via-green-600 to-emerald-600",
      "from-red-600 via-pink-600 to-rose-600",
      "from-blue-600 via-indigo-600 to-violet-600",
    ]
    return gradients[index % gradients.length]
  }

  if (!releases || heroReleases.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
            <Music className="w-6 h-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-gray-700 text-lg md:text-xl font-semibold">No releases available</h3>
            <p className="text-gray-500 text-sm">Check back later for new music</p>
          </div>
        </div>
      </div>
    )
  }

  const currentRelease = heroReleases[currentSlide]

  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroReleases.map((release, index) => (
          <div
            key={release.id}
            className={`min-w-full h-full bg-gradient-to-br ${getBackgroundGradient(index)} relative`}
          >
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full py-6 md:py-8">
                {/* Content Section */}
                <div className="space-y-6 md:space-y-8 text-white order-2 lg:order-1">
                  {/* Header Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {release.exclusive ? "🔥 Exclusive" : "✨ New Release"}
                      </span>
                    </div>
                    {release.tag && (
                      <div className="inline-flex items-center px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-medium">{release.tag}</span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Title and Artist Section */}
                  <div className="space-y-4">
                    {/* Artist Info - Moved above title for better hierarchy */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-white/40 shadow-lg">
                          <Image
                            src={release.artistArtwork || "/placeholder.svg"}
                            alt={release.artist}
                            width={48}
                            height={48}
                            loader={customUrlImageLoader}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Verified badge positioned on avatar */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                          <CheckCircle className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wide">
                          Artist
                        </span>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                          {release.artist}
                        </h2>
                      </div>
                    </div>

                    {/* Main Title - Now with better spacing and hierarchy */}
                    <div className="space-y-2">
                      <span className="text-white/60 text-sm md:text-base font-medium uppercase tracking-wider">
                        Album
                      </span>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-white">
                        {release.title}
                      </h1>
                    </div>

                    {/* Stats with better visual separation */}
                    <div className="flex items-center gap-6 pt-2">
                      {release.Tracks && (
                        <div className="flex items-center gap-2 text-white/80">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <Music className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-white/60 uppercase tracking-wide">Tracks</span>
                            <span className="text-sm font-semibold">{release.Tracks.length}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-white/80">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-white/60 uppercase tracking-wide">Year</span>
                          <span className="text-sm font-semibold">2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      size="default"
                      className="bg-white text-black hover:bg-white/90 font-bold px-6 py-2.5 text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      onClick={() => handlePlayRelease(release)}
                      disabled={isPlaying && currentTrack?.id === String(release.id)}
                    >
                      <Play className="h-4 w-4 mr-2 fill-current" />
                      {isPlaying && currentTrack?.id === String(release.id) ? "Playing" : "Play Album"}
                    </Button>

                    <Button
                      variant="outline"
                      size="default"
                      className="border-2 border-white/40 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold px-4 py-2.5 rounded-full text-sm"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current text-red-400" : ""}`} />
                      {isLiked ? "Liked" : "Like"}
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 w-9 h-9 rounded-full backdrop-blur-sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 w-9 h-9 rounded-full backdrop-blur-sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Album Art Section */}
                <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="relative group">
                    {/* Main Album Art */}
                    <div className="relative">
                      <Card className="relative overflow-hidden shadow-2xl border-0 bg-black/10 backdrop-blur-sm p-1">
                        <div className="relative overflow-hidden rounded-lg">
                          <Image
                            src={release.artworkPath || "/placeholder.svg"}
                            alt={release.title}
                            width={300}
                            height={300}
                            loader={customUrlImageLoader}
                            className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover transition-all duration-500 group-hover:scale-110"
                          />

                          {/* Floating Play Button */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <Button
                              size="icon"
                              className="w-12 h-12 md:w-16 md:h-16 bg-white hover:bg-white/90 text-black rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200"
                              onClick={() => handlePlayRelease(release)}
                            >
                              <Play className="h-6 w-6 md:h-8 md:w-8 ml-1 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </Card>

                      {/* Floating Music Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <Volume2 className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 blur-3xl scale-110 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 w-8 h-8 rounded-full backdrop-blur-sm border border-white/20"
          onClick={toggleAutoPlay}
        >
          {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 w-8 h-8 rounded-full backdrop-blur-sm border border-white/20"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 w-8 h-8 rounded-full backdrop-blur-sm border border-white/20"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Modern Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        {heroReleases.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === currentSlide ? "bg-white w-6 shadow-lg" : "bg-white/40 hover:bg-white/60 w-1.5"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Enhanced Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
        <div
          className="h-full bg-white shadow-lg transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / heroReleases.length) * 100}%`,
            boxShadow: "0 0 10px rgba(255,255,255,0.5)",
          }}
        />
      </div>
    </div>
  )
}
