"use client"

import { Suspense } from "react"
import { fetchHomeData } from "@/lib/actions"
import { HeroSection } from "@/components/hero-section"
import { NewReleases } from "@/components/new-releases"
import { DiscoverSlider } from "@/components/discover-slider"
import { FeaturedArtists } from "@/components/featured-artists"
import { FeaturedGenres } from "@/components/featured-genres"
import { RecentlyPlayed } from "@/components/recently-played"
import { TrendingTracks } from "@/components/trending-tracks"
import { ExclusiveReleases } from "@/components/exclusive-releases"
import { RecommendedTracks } from "@/components/recommended-tracks"
import { FeaturedPlaylists } from "@/components/featured-playlists"
import { ArtistRecommendations } from "@/components/artist-recommendations"
import { FeaturedAlbums } from "@/components/featured-albums"
import { FeaturedMixtapes } from "@/components/featured-mixtapes"
import { MobileNavigation } from "@/components/mobile-navigation"
import { MiniPlayer } from "@/components/mini-player"
import { HomeSkeleton } from "@/components/home-skeleton"
import { ErrorDisplay } from "@/components/error-display"
import React from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
      <MiniPlayer />
      <MobileNavigation />
    </main>
  )
}

function HomeContent() {
  const userID = "user123"
  const { data, error } = useHomeData(userID)

  if (error) {
    return <ErrorDisplay error={error.message || "An unknown error occurred"} />
  }

  if (!data) {
    return <HomeSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {data.featured.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={index} data={section} />
          case "newRelease":
            return <NewReleases key={index} data={section} />
          case "slider":
            return <DiscoverSlider key={index} data={section} />
          case "artist":
            return <FeaturedArtists key={index} data={section} />
          case "genre":
            return <FeaturedGenres key={index} data={section} />
          case "recently":
            return <RecentlyPlayed key={index} data={section} />
          case "trend":
            if (section.heading === "Trending Now") {
              return <TrendingTracks key={index} data={section} />
            } else if (section.heading === "You Might Like") {
              return <RecommendedTracks key={index} data={section} />
            }
            return null
          case "albums":
            if (section.heading === "Exclusive Release") {
              return <ExclusiveReleases key={index} data={section} />
            } else if (section.heading === "Featured Albums") {
              return <FeaturedAlbums key={index} data={section} />
            }
            return null
          case "playlist":
            return <FeaturedPlaylists key={index} data={section} />
          case "artist_more_like":
            return <ArtistRecommendations key={index} data={section} />
          case "djs":
            return <FeaturedMixtapes key={index} data={section} />
          default:
            return null
        }
      })}
    </div>
  )
}

function useHomeData(userID: string) {
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    fetchHomeData(userID)
      .then(setData)
      .catch(setError)
  }, [userID])

  return { data, error }
}
