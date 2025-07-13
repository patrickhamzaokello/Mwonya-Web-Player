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
  Music,
  Clock,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
    }, 5000)
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

  if (!releases || heroReleases.length === 0) {
    return (
      <div className="bg-black h-96 flex items-center justify-center border-b border-gray-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
            <Music className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h3 className="text-white text-xl font-semibold">No releases available</h3>
            <p className="text-gray-400 text-sm mt-1">Check back later for new music</p>
          </div>
        </div>
      </div>
    )
  }

  const currentRelease = heroReleases[currentSlide]

  return (
    <div className="relative bg-black h-96 overflow-hidden border-b border-gray-800">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroReleases.map((release) => (
          <div key={release.id} className="min-w-full h-full">
            <div className="container mx-auto px-6 lg:px-12 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-center h-full py-8">
                
                {/* Content Section */}
                <div className="space-y-6 max-w-2xl">
                  {/* Category & Status */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                      New Release
                    </span>
                    {release.exclusive && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Exclusive
                      </div>
                    )}
                  </div>

                  {/* Main Title */}
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight">
                      {release.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                          <Image
                            src={release.artistArtwork || "/placeholder.svg"}
                            alt={release.artist}
                            width={40}
                            height={40}
                            loader={customUrlImageLoader}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xl text-gray-300 font-medium">{release.artist}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="flex items-center gap-6 text-gray-400 text-sm">
                    {release.Tracks && (
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        <span>{release.Tracks.length} tracks</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Album</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                      onClick={() => handlePlayRelease(release)}
                      disabled={isPlaying && currentTrack?.id === String(release.id)}
                    >
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      {isPlaying && currentTrack?.id === String(release.id) ? "Playing" : "Play Album"}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-gray-800 w-12 h-12 rounded-full transition-colors duration-200"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-gray-800 w-12 h-12 rounded-full transition-colors duration-200"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-gray-800 w-12 h-12 rounded-full transition-colors duration-200"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Album Art Section */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative group">
                    {/* Main Album Art */}
                    <div className="relative">
                      <div className="w-64 h-64 lg:w-72 lg:h-72 rounded-3xl overflow-hidden bg-gray-800 shadow-2xl">
                        <Image
                          src={release.artworkPath || "/placeholder.svg"}
                          alt={release.title}
                          width={288}
                          height={288}
                          loader={customUrlImageLoader}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            size="icon"
                            className="w-16 h-16 bg-white hover:bg-gray-100 text-black rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200"
                            onClick={() => handlePlayRelease(release)}
                          >
                            <Play className="h-7 w-7 ml-1 fill-current" />
                          </Button>
                        </div>
                      </div>

                      {/* Floating Genre Badge */}
                      <div className="absolute -top-3 -right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium border border-gray-700">
                        {release.tag || "Music"}
                      </div>
                    </div>

                    {/* Reflection Effect */}
                    <div className="absolute top-full left-0 w-full h-24 bg-gradient-to-b from-black/10 to-transparent rounded-3xl transform scale-y-[-1] opacity-20 blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 rounded-full border border-gray-700"
          onClick={toggleAutoPlay}
        >
          {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 rounded-full border border-gray-700"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 rounded-full border border-gray-700"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <span className="text-gray-500 text-sm mr-3">
          {currentSlide + 1} / {heroReleases.length}
        </span>
        {heroReleases.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? "bg-white w-8 shadow-lg" 
                : "bg-gray-600 hover:bg-gray-500 w-1.5"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full bg-white transition-all duration-700"
          style={{
            width: `${((currentSlide + 1) / heroReleases.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}