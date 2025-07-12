"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Share2, Plus, Volume2, CheckCircle, Clock, Music } from "lucide-react"
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

  // Use all releases for the hero slider, or fallback to empty array
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
    // Fetch album tracks
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

  // Enhanced gradient backgrounds with better color combinations
  const getBackgroundGradient = (index: number) => {
    const gradients = [
      "from-violet-600 via-purple-600 to-blue-600",
      "from-pink-500 via-rose-500 to-orange-500", 
      "from-emerald-500 via-teal-500 to-cyan-500",
      "from-indigo-600 via-blue-600 to-purple-600",
      "from-orange-500 via-red-500 to-pink-500",
      "from-teal-600 via-green-600 to-emerald-600",
      "from-red-600 via-pink-600 to-rose-600",
      "from-blue-600 via-indigo-600 to-violet-600"
    ]
    return gradients[index % gradients.length]
  }

  if (!releases || heroReleases.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-gray-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-gray-700 text-xl md:text-2xl font-semibold">No releases available</h3>
            <p className="text-gray-500 text-sm">Check back later for new music</p>
          </div>
        </div>
      </div>
    )
  }

  const currentRelease = heroReleases[currentSlide]

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
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

            <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full py-12">
                
                {/* Content Section */}
                <div className="lg:col-span-7 space-y-8 text-white order-2 lg:order-1">
                  
                  {/* Header Tags */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {release.exclusive ? "🔥 Exclusive" : "✨ New Release"}
                      </span>
                    </div>
                    {release.tag && (
                      <div className="inline-flex items-center px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-medium">{release.tag}</span>
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="space-y-6">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.85] tracking-tight">
                      {release.title}
                    </h1>

                    {/* Artist */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-white/30">
                          <Image
                            src={release.artistArtwork || "/placeholder.svg"}
                            alt={release.artist}
                            width={40}
                            height={40}
                            loader={customUrlImageLoader}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/95">
                          {release.artist}
                        </h2>
                      </div>
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-white/80">
                      {release.Tracks && (
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          <span className="text-sm font-medium">{release.Tracks.length} tracks</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">2024</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 font-bold px-8 py-3 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      onClick={() => handlePlayRelease(release)}
                      disabled={isPlaying && currentTrack?.id === String(release.id)}
                    >
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      {isPlaying && currentTrack?.id === String(release.id) ? "Playing" : "Play Album"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white/40 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold px-6 py-3 rounded-full"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current text-red-400" : ""}`} />
                      {isLiked ? "Liked" : "Like"}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10 w-12 h-12 rounded-full backdrop-blur-sm"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10 w-12 h-12 rounded-full backdrop-blur-sm"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Album Art Section */}
                <div className="lg:col-span-5 relative flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="relative group">
                    
                    {/* Main Album Art */}
                    <div className="relative">
                      <Card className="relative overflow-hidden shadow-2xl border-0 bg-black/10 backdrop-blur-sm p-2">
                        <div className="relative overflow-hidden rounded-lg">
                          <Image
                            src={release.artworkPath || "/placeholder.svg"}
                            alt={release.title}
                            width={400}
                            height={400}
                            loader={customUrlImageLoader}
                            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover transition-all duration-500 group-hover:scale-110"
                          />
                          
                          {/* Floating Play Button */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <Button
                              size="icon"
                              className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-white/90 text-black rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200"
                              onClick={() => handlePlayRelease(release)}
                            >
                              <Play className="h-8 w-8 md:h-10 md:w-10 ml-1 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </Card>

                      {/* Floating Music Badge */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <Volume2 className="h-6 w-6 text-white" />
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
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 md:w-14 md:h-14 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 md:w-14 md:h-14 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
      </Button>

      {/* Auto-play Control */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 md:top-8 right-6 md:right-8 text-white hover:bg-white/20 w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-sm border border-white/20"
        onClick={toggleAutoPlay}
      >
        {isAutoPlaying ? <Pause className="h-5 w-5 md:h-6 md:w-6" /> : <Play className="h-5 w-5 md:h-6 md:w-6" />}
      </Button>

      {/* Modern Slide Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        {heroReleases.map((_, index) => (
          <button
            key={index}
            className={`h-2 transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? "bg-white w-8 shadow-lg" 
                : "bg-white/40 hover:bg-white/60 w-2"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Enhanced Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-white shadow-lg transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / heroReleases.length) * 100}%`,
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        />
      </div>
    </div>
  )
}