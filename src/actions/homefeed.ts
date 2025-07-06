"use server"

import type { HomeFeedResponse, NewRelease, Artist, Track, Playlist } from "@/lib/home_feed_types"

export async function fetchHomeFeed(userID: string, page = 1): Promise<HomeFeedResponse | null> {
  try {
    const apiUrl = `https://test.mwonya.com/ios/Requests/endpoints/allcombined.php?userID=${userID}&page=${page}`

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

    const data: HomeFeedResponse = await response.json()

    // Validate the response structure
    if (!data.featured || !Array.isArray(data.featured)) {
      console.error("Invalid API response structure")
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching home feed:", error)
    return null
  }
}

// Helper function to get specific section types
export async function getNewReleases(userID: string): Promise<NewRelease[]> {
  const homeFeed = await fetchHomeFeed(userID)
  if (!homeFeed) return []

  const newReleaseSection = homeFeed.featured.find((section) => section.type === "newRelease")
  return newReleaseSection?.HomeRelease || []
}

export async function getFeaturedArtists(userID: string): Promise<Artist[]> {
  const homeFeed = await fetchHomeFeed(userID)
  if (!homeFeed) return []

  const artistSection = homeFeed.featured.find((section) => section.type === "artist")
  return artistSection?.featuredArtists || []
}

export async function getWeeklyTop10(
  userID: string,
): Promise<{ tracks: Track[]; weekArtist: string; weekDate: string; weekImage: string } | null> {
  const homeFeed = await fetchHomeFeed(userID)
  if (!homeFeed) return null

  const weeklySection = homeFeed.featured.find((section) => section.type === "timely")
  if (!weeklySection) return null

  return {
    tracks: weeklySection.Tracks || [],
    weekArtist: weeklySection.weekartist || "",
    weekDate: weeklySection.weekdate || "",
    weekImage: weeklySection.weekimage || "",
  }
}

export async function getFeaturedPlaylists(userID: string): Promise<Playlist[]> {
  const homeFeed = await fetchHomeFeed(userID)
  if (!homeFeed) return []

  const playlistSection = homeFeed.featured.find((section) => section.type === "playlist")
  return playlistSection?.featuredPlaylists || []
}

export async function getTrendingTracks(userID: string): Promise<Track[]> {
  const homeFeed = await fetchHomeFeed(userID)
  if (!homeFeed) return []

  const trendingSection = homeFeed.featured.find((section) => section.type === "trend")
  return trendingSection?.Tracks || []
}

