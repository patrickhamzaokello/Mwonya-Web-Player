"use client"

import { fetchArtistData } from "@/actions/artist-data"
import { ArtistIntro } from "@/lib/artist_page_types"
import { useState, useEffect } from "react"

interface UseArtistDataReturn {
  artistData: ArtistIntro | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useArtistData(artistId: string, userId: string): UseArtistDataReturn {
  const [artistData, setArtistData] = useState<ArtistIntro | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchArtistData(artistId, userId)

      // Extract artist intro data from the response
      const introSection = response.Artist.find((section) => section.Type === "intro")
      const artistIntro = introSection?.ArtistIntro?.[0] || null

      setArtistData(artistIntro)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (artistId) {
      fetchData()
    }
  }, [artistId])

  return {
    artistData,
    isLoading,
    error,
    refetch: fetchData,
  }
}
