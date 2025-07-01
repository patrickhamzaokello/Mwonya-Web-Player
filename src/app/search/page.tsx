"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { Search, Play, Clock, Users, Music, Disc, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { searchMusic } from "@/actions/search-actions"

function formatDuration(duration: string) {
  if (!duration) return ""

  // If duration is in seconds (like "400")
  if (/^\d+$/.test(duration)) {
    const seconds = Number.parseInt(duration)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // If duration is already formatted (like "29:53")
  return duration
}

function formatPlays(plays: number | string) {
  if (!plays || plays === "") return "0"
  const num = typeof plays === "string" ? Number.parseInt(plays) : plays
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

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

function getTypeIcon(type: string) {
  switch (type) {
    case "song":
      return <Music className="w-4 h-4" />
    case "album":
      return <Disc className="w-4 h-4" />
    case "artist":
      return <User className="w-4 h-4" />
    default:
      return <Music className="w-4 h-4" />
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "song":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "album":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "artist":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

function UnifiedResult({ result, rank }: { result: SearchResult; rank: number }) {
  const router = useRouter()

  const handleClick = () => {
    if (result.type === "album") {
      router.push(`/library/albums/${result.id}`)
    }
  }

  const isClickable = result.type === "album"

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
        isClickable ? "hover:bg-muted/50 cursor-pointer" : "hover:bg-muted/30"
      } group`}
      onClick={handleClick}
    >
      {/* Rank Number */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-sm font-medium text-muted-foreground">{rank}</span>
      </div>

      {/* Artwork */}
      <div className="relative flex-shrink-0">
        <Image
          src={result.artworkPath || "/placeholder.svg?height=56&width=56"}
          alt={result.title || result.artist}
          width={56}
          height={56}
          className={`object-cover ${result.type === "artist" ? "rounded-full" : "rounded-md"}`}
        />
        {result.type === "song" && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute inset-0 m-auto w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              // Handle play functionality here
            }}
          >
            <Play className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium truncate">{result.title || result.artist}</h3>
          <Badge variant="secondary" className={`text-xs flex items-center gap-1 ${getTypeColor(result.type)}`}>
            {getTypeIcon(result.type)}
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground truncate">{result.type === "artist" ? "Artist" : result.artist}</p>

        {/* Additional info based on type */}
        {result.type === "song" && result.album_name && (
          <p className="text-xs text-muted-foreground truncate">{result.album_name}</p>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
        {/* Genre for songs and albums */}
        {result.genre_name && (result.type === "song" || result.type === "album") && (
          <Badge variant="outline" className="text-xs">
            {result.genre_name}
          </Badge>
        )}

        {/* Duration for songs */}
        {result.type === "song" && result.track_duration && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(result.track_duration)}
          </div>
        )}

        {/* Play count for songs */}
        {result.type === "song" && result.plays && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {formatPlays(result.plays)}
          </div>
        )}

        {/* Verified badge */}
        {result.verified && (
          <Badge variant="secondary" className="text-xs">
            Verified
          </Badge>
        )}

        {/* Relevance score (for debugging - can be removed) */}
        <div className="text-xs text-muted-foreground/50">{result.relevance_score.toFixed(1)}</div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchData, setSearchData] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!query.trim()) {
      setSearchData(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    startTransition(async () => {
      try {
        const data = await searchMusic(query)
        setSearchData(data)
        if (!data) {
          setError("Unable to fetch search results. Please try again later.")
        }
      } catch (err) {
        setError("An error occurred while searching. Please try again.")
        console.error("Search error:", err)
      } finally {
        setIsLoading(false)
      }
    })
  }, [query])

  // Sort results by relevance score (highest first)
  const sortedResults = searchData?.search_results
    ? [...searchData.search_results].sort((a, b) => b.relevance_score - a.relevance_score)
    : []

  const loading = isLoading || isPending

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Search Results</h1>
          {query && (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Showing results for: <span className="font-semibold text-foreground">"{query}"</span>
              </p>
              {searchData && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{searchData.total_results} total results</span>
                  <span>
                    Page {searchData.page} of {searchData.total_pages}
                  </span>
                  <span className="text-xs">Sorted by relevance</span>
                </div>
              )}
              {searchData?.suggested_words && <p className="text-sm text-blue-600">{searchData.suggested_words}</p>}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {query && searchData && !loading && !error ? (
          <div className="space-y-2">
            {sortedResults.length > 0 ? (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <h2 className="text-lg font-semibold">All Results ({sortedResults.length})</h2>
                  <div className="text-sm text-muted-foreground">Ranked by relevance</div>
                </div>

                {/* Results List */}
                {sortedResults.map((result, index) => (
                  <UnifiedResult key={result.id} result={result} rank={index + 1} />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try searching with different keywords or check your spelling</p>
              </div>
            )}
          </div>
        ) : query && !loading && !error && !searchData ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">Try searching with different keywords or check your spelling</p>
          </div>
        ) : !query && !loading ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Search for music</h3>
            <p className="text-muted-foreground">Enter a song, artist, or album in the search box above</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
