"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { Search, Play, Clock, Users, Music, Disc, User, Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
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
      return "bg-blue-500 text-white"
    case "album":
      return "bg-purple-500 text-white"
    case "artist":
      return "bg-green-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

function TopResult({ result }: { result: SearchResult }) {
  const router = useRouter()

  const handleClick = () => {
    if (result.type === "album") {
      router.push(`/library/albums/${result.id}`)
    }
  }

  const isClickable = result.type === "album"

  return (
    <Card
      className={`p-6 ${isClickable ? "cursor-pointer hover:shadow-lg" : ""} transition-all duration-200`}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <h2 className="text-lg font-semibold">Top Result</h2>
        </div>

        <div className="flex items-center gap-6">
          {/* Large Artwork */}
          <div className="relative group">
            <Image
              src={result.artworkPath || "/placeholder.svg?height=120&width=120"}
              alt={result.title || result.artist}
              width={120}
              height={120}
              className={`object-cover shadow-lg ${result.type === "artist" ? "rounded-full" : "rounded-xl"}`}
            />
            {result.type === "song" && (
              <Button
                size="icon"
                className="absolute inset-0 m-auto w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-black"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle play functionality here
                }}
              >
                <Play className="w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${getTypeColor(result.type)} px-3 py-1`}>
                {getTypeIcon(result.type)}
                <span className="ml-1 font-medium">{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
              </Badge>
              {result.verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Verified
                </Badge>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-1 text-foreground">{result.title || result.artist}</h3>

            <p className="text-lg text-muted-foreground mb-3">{result.type === "artist" ? "Artist" : result.artist}</p>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {result.album_name && result.type === "song" && <span className="font-medium">{result.album_name}</span>}

              {result.genre_name && (
                <Badge variant="outline" className="text-xs">
                  {result.genre_name}
                </Badge>
              )}

              {result.type === "song" && result.track_duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(result.track_duration)}
                </div>
              )}

              {result.type === "song" && result.plays && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatPlays(result.plays)} plays
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SearchResultItem({ result, rank }: { result: SearchResult; rank: number }) {
  const router = useRouter()

  const handleClick = () => {
    if (result.type === "album") {
      router.push(`/library/albums/${result.id}`)
    }
  }

  const isClickable = result.type === "album"

  return (
    <Card
      className={`p-4 ${isClickable ? "cursor-pointer hover:shadow-md" : "hover:bg-muted/30"} transition-all duration-200`}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 text-center">
            <span className="text-lg font-semibold text-muted-foreground">{rank}</span>
          </div>

          {/* Artwork */}
          <div className="relative group flex-shrink-0">
            <Image
              src={result.artworkPath || "/placeholder.svg?height=80&width=80"}
              alt={result.title || result.artist}
              width={80}
              height={80}
              className={`object-cover shadow-md ${result.type === "artist" ? "rounded-full" : "rounded-lg"}`}
            />
            {result.type === "song" && (
              <Button
                size="icon"
                className="absolute inset-0 m-auto w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-black"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle play functionality here
                }}
              >
                <Play className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getTypeColor(result.type)} text-xs px-2 py-1`}>
                {getTypeIcon(result.type)}
                <span className="ml-1">{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
              </Badge>
              {result.verified && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  Verified
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold mb-1 truncate text-foreground">{result.title || result.artist}</h3>

            <p className="text-sm text-muted-foreground mb-2 truncate">
              {result.type === "artist" ? "Artist" : result.artist}
            </p>

            {result.type === "song" && result.album_name && (
              <p className="text-xs text-muted-foreground truncate mb-2">{result.album_name}</p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {result.genre_name && (
                <Badge variant="outline" className="text-xs">
                  {result.genre_name}
                </Badge>
              )}

              {result.type === "song" && result.track_duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(result.track_duration)}
                </div>
              )}

              {result.type === "song" && result.plays && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatPlays(result.plays)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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

  const topResult = sortedResults[0]
  const otherResults = sortedResults.slice(1)

  const loading = isLoading || isPending

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Search Results</h1>
          {query && (
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground">
                Results for <span className="font-semibold text-foreground">"{query}"</span>
              </p>
              {searchData && (
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="font-medium">{searchData.total_results} results found</span>
                  <span>
                    Page {searchData.page} of {searchData.total_pages}
                  </span>
                </div>
              )}
              {searchData?.suggested_words && (
                <p className="text-sm text-blue-600 font-medium">{searchData.suggested_words}</p>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mb-4" />
            <span className="text-lg text-muted-foreground">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert className="mb-8">
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {query && searchData && !loading && !error ? (
          <div className="space-y-8">
            {sortedResults.length > 0 ? (
              <>
                {/* Top Result */}
                {topResult && (
                  <div className="mb-8">
                    <TopResult result={topResult} />
                  </div>
                )}

                {/* Other Results */}
                {otherResults.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      All Results ({otherResults.length})
                    </h2>
                    <div className="space-y-3">
                      {otherResults.map((result, index) => (
                        <SearchResultItem key={result.id} result={result} rank={index + 2} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-3">No results found</h3>
                <p className="text-muted-foreground text-lg">
                  Try searching with different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        ) : query && !loading && !error && !searchData ? (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-3">No results found</h3>
            <p className="text-muted-foreground text-lg">
              Try searching with different keywords or check your spelling
            </p>
          </div>
        ) : !query && !loading ? (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-3">Search for music</h3>
            <p className="text-muted-foreground text-lg">Enter a song, artist, or album in the search box above</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
