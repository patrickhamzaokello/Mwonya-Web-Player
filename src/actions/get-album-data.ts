"use server"

export interface AlbumData {
  id: string
  title: string
  artistName: string
  genreName: string
  artworkPath: string
  description: string
  datecreated: string
  tracks: Track[]
  relatedAlbums: RelatedAlbum[]
}

export interface Track {
  id: string
  title: string
  artist: string
  duration: string
  path: string
  totalplays: number
}

export interface RelatedAlbum {
  id: string
  title: string
  artist: string
  artworkPath: string
  genre: string
  datecreated: string
}

export interface ApiResponse {
  page: number
  Album: Array<{
    id?: string
    title?: string
    artistName?: string
    artistID?: string
    genreID?: string
    genreName?: string
    tracks_count?: number
    exclusive?: boolean
    user_allowed?: boolean
    artist_profile?: string
    artworkPath?: string
    description?: string
    datecreated?: string
    totaltrackplays?: string
    tag?: string
    following?: boolean
    trackPath?: string[]
    Tracks?: Array<{
      id: string
      title: string
      artist: string
      artistID: string
      album: string
      artworkPath: string
      genre: string
      genreID: string
      duration: string
      lyrics: string | null
      path: string
      totalplays: number
      albumID: string
      description: string
      comments: string
      date_duration: string
    }>
    heading?: string
    Type?: string
    ArtistAlbum?: Array<{
      id: string
      title: string
      artist: string
      genre: string
      artworkPath: string
      tag: string
      exclusive: boolean
      description: string
      datecreated: string
      totalsongplays: string
    }>
  }>
}

function formatDuration(seconds: string): string {
  const totalSeconds = Number.parseInt(seconds)
  if (isNaN(totalSeconds)) return "0:00"
  
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export async function getAlbumData(albumId: string, page: number = 1): Promise<AlbumData | null> {
  // Validate required parameters
  if (!albumId || albumId.trim() === '') {
    console.error("Album ID is required")
    return null
  }

  const apiUrl = `https://test.mwonya.com/ios/Requests/endpoints/selectedAlbum.php?page=${page}&albumID=${encodeURIComponent(albumId)}`
  
  try {
    console.log(`Fetching album data from: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js App'
      },
      // Add timeout and other fetch options
      next: { 
        revalidate: 300 // Cache for 5 minutes
      }
    })

    // Check if response is ok
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`)
      
      // Handle specific HTTP errors
      switch (response.status) {
        case 404:
          console.error("Album not found")
          break
        case 500:
          console.error("Server error occurred")
          break
        case 429:
          console.error("Too many requests - rate limited")
          break
        default:
          console.error(`Unexpected error: ${response.status}`)
      }
      
      return null
    }

    // Check content type
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Invalid content type received:", contentType)
      return null
    }

    const data: ApiResponse = await response.json()
    
    // Validate response structure
    if (!data || !Array.isArray(data.Album) || data.Album.length === 0) {
      console.error("Invalid API response structure:", data)
      return null
    }

    // Extract album info (first item in Album array)
    const albumInfo = data.Album[0]
    if (!albumInfo) {
      console.error("No album information found in response")
      return null
    }

    // Extract tracks (look for the item with Tracks property)
    const tracksContainer = data.Album.find(item => item.Tracks && Array.isArray(item.Tracks))
    const tracksData = tracksContainer?.Tracks || []
    
    const tracks: Track[] = tracksData.map((track) => ({
      id: track.id || 'unknown',
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      duration: formatDuration(track.duration || '0'),
      path: track.path || '',
      totalplays: track.totalplays || 0,
    }))

    // Extract related albums (look for the item with ArtistAlbum property)
    const relatedContainer = data.Album.find(item => item.ArtistAlbum && Array.isArray(item.ArtistAlbum))
    const relatedAlbumsData = relatedContainer?.ArtistAlbum || []
    
    const relatedAlbums: RelatedAlbum[] = relatedAlbumsData
      .slice(0, 8) // Limit to 8 related albums
      .map((album) => ({
        id: album.id || 'unknown',
        title: album.title || 'Unknown Title',
        artist: album.artist || 'Unknown Artist',
        artworkPath: album.artworkPath || '/placeholder.svg',
        genre: album.genre || 'Unknown Genre',
        datecreated: album.datecreated || 'Unknown Date',
      }))

    // Build and return the final album data
    const albumData: AlbumData = {
      id: albumInfo.id || 'unknown-id',
      title: albumInfo.title || 'Unknown Title',
      artistName: albumInfo.artistName || 'Unknown Artist',
      genreName: albumInfo.genreName || 'Unknown Genre',
      artworkPath: albumInfo.artworkPath || '/placeholder.svg',
      description: albumInfo.description || 'No description available',
      datecreated: albumInfo.datecreated || 'Unknown Date',
      tracks,
      relatedAlbums,
    }

    console.log(`Successfully fetched album: ${albumData.title} by ${albumData.artistName}`)
    return albumData

  } catch (error) {
    // Handle different types of errors
    if (error instanceof TypeError) {
      console.error("Network error or invalid URL:", error.message)
    } else if (error instanceof SyntaxError) {
      console.error("Invalid JSON response:", error.message)
    } else {
      console.error("Unexpected error fetching album data:", error)
    }
    
    return null
  }
}

// Optional: Add a function to get multiple albums or handle pagination
export async function getAlbumDataWithRetry(
  albumId: string, 
  page: number = 1, 
  maxRetries: number = 3
): Promise<AlbumData | null> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} for album ID: ${albumId}`)
      
      const result = await getAlbumData(albumId, page)
      if (result) {
        return result
      }
      
      // If we get null but no error was thrown, wait before retry
      if (attempt < maxRetries) {
        console.log(`Retrying in ${attempt * 1000}ms...`)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000))
      }
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(`Attempt ${attempt} failed:`, lastError.message)
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  console.error(`All ${maxRetries} attempts failed for album ID: ${albumId}`)
  return null
}