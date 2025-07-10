"use server"

import type { Track, Playlist } from "@/lib/home_feed_types"

export async function fetchPlaylistTracks(playlistID: string): Promise<Track[] | null> {
  try {
    const apiUrl = `https://test.mwonya.com/ios/Requests/endpoints/selectedPlaylistTracks.php?playlistID=${playlistID}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MwonyaApp/1.0",
      },
      // Add cache control for better performance
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`)
      return null
    }

    const data: Track[] = await response.json()

    // Validate the response structure
    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure")
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching home feed:", error)
    return null
  }
}





