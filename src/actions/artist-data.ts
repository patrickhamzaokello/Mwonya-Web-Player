"use server"

import { ArtistApiResponse } from "@/lib/artist_page_types"


export async function fetchArtistData(artistId: string, userId: string): Promise<ArtistApiResponse> {
  try {
    const response = await fetch(`https://test.mwonya.com/ios/Requests/endpoints//artist.php?artistID=${artistId}&user_ID=${userId}&page=1`)
    if (!response.ok) {
      throw new Error('Failed to fetch artist data')
    }
    return response.json()

  } catch (error) {
    console.error("Error fetching artist data:", error)
    throw new Error("Failed to fetch artist data")
  }
}
