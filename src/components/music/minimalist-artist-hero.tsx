"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, UserPlus, UserCheck, RefreshCw, AlertCircle } from "lucide-react"
import { useArtistData } from "@/hooks/use-artist-feed"
import { ArtistHeroSkeleton } from "./artist-hero-skeleton"

interface MinimalistArtistHeroProps {
  artistId: string
   userId: string // Optional user ID for fetching user-specific data
}

export default function MinimalistArtistHero({ artistId, userId }: MinimalistArtistHeroProps) {
  const { artistData, isLoading, error, refetch } = useArtistData(artistId, userId)

  if (isLoading) {
    return <ArtistHeroSkeleton />
  }

  if (error) {
    return (
      <div className="relative w-full bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Failed to load artist data</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!artistData) {
    return (
      <div className="relative w-full bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Artist not found</h2>
            <p className="text-muted-foreground">The requested artist could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-background">
      {/* Background Image with Subtle Overlay */}
      <div className="absolute inset-0 h-80">
        <Image
          src={artistData.coverimage || "/placeholder.svg"}
          alt={`${artistData.name} cover`}
          fill
          className="object-cover opacity-10 dark:opacity-5"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          {/* Main Content Grid */}
          <div className="max-w-4xl mx-auto">
            {/* Top Section - Profile and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg ring-4 ring-background">
                  <Image
                    src={artistData.profilephoto || "/placeholder.svg"}
                    alt={artistData.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left">
                {/* Artist Type Badge */}
                <Badge variant="outline" className="mb-4 text-xs font-medium border-border text-muted-foreground">
                  ARTIST
                </Badge>

                {/* Artist Name with Verification */}
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
                    {artistData.name}
                  </h1>
                  {artistData.verified && (
                    <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-blue-500 fill-current flex-shrink-0" />
                  )}
                </div>

                {/* Monthly Listeners */}
                <p className="text-lg text-muted-foreground mb-6 font-normal">{artistData.monthly}</p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Play
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className={`px-8 py-3 rounded-full border-2 transition-all ${
                      artistData.following
                        ? "border-border text-muted-foreground hover:border-border/80"
                        : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {artistData.following ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border mb-12" />

            {/* Bottom Section - Description and Details */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Description */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed text-base">{artistData.intro}</p>
              </div>

              {/* Stats and Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 uppercase tracking-wide">Genre</h3>
                  <p className="text-muted-foreground">Afro Pop</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 uppercase tracking-wide">Label</h3>
                  <p className="text-muted-foreground">Independent</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 uppercase tracking-wide">Location</h3>
                  <p className="text-muted-foreground">Northern Uganda</p>
                </div>

                {!artistData.user_access_exclusive && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                      Exclusive Access
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">Join artist circle for exclusive content</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 rounded-full bg-transparent"
                    >
                      Join for ${(artistData.circle_cost / 100).toFixed(0)}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
