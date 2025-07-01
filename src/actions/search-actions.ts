"use server"

interface SearchResult {
  id: string
  artist: string
  artistID: string
  title: string
  path: string
  plays: number | string
  weekplays: number | string
  artworkPath: string
  album_name: string
  genre_name: string
  genre_id: string
  track_duration: string
  track_albumID: string
  type: "song" | "album" | "artist"
  lyrics: string | null
  verified: boolean
  relevance_score: number
}

interface SearchResponse {
  version: number
  searchTerm: string
  algorithm: string
  search_results: SearchResult[]
  suggested_words: string
  total_pages: number
  total_results: number
  page: number
}

export async function searchMusic(query: string, page = 1): Promise<SearchResponse | null> {
  if (!query.trim()) {
    return null
  }

  try {
    const encodedQuery = encodeURIComponent(query)
    const url = `https://test.mwonya.com/ios/Requests/endpoints/search.php?page=${page}&key_query=${encodedQuery}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache control for better performance
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null
    }

    const data: SearchResponse = await response.json()
    return data
  } catch (error) {
    console.error("Search API Error:", error)
    return null
  }
}
