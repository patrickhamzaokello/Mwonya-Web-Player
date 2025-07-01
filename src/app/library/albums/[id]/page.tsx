"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MoreHorizontal, Play, Share, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";
import { getAlbumData, getAlbumDataWithRetry, type AlbumData } from "@/actions/get-album-data";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// Utility function to validate URLs
const isValidUrl = (string: string): boolean => {
  if (!string || string.trim() === '' || string === '/placeholder.svg') {
    return false;
  }
  
  try {
    new URL(string);
    return true;
  } catch {
    // If it's a relative path starting with /, it's valid
    return string.startsWith('/');
  }
};

interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export default function Component() {
  const params = useParams();
  const router = useRouter();
  const albumId = params?.id;

  const [data, setData] = useState<AlbumData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    isRefreshing: false,
    error: null
  });

  const fetchAlbumData = useCallback(async (isRefresh = false) => {
    if (typeof albumId !== "string" || !albumId.trim()) {
      setLoadingState({
        isLoading: false,
        isRefreshing: false,
        error: "Invalid album ID"
      });
      return;
    }

    setLoadingState(prev => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      error: null
    }));

    try {
      // Use retry mechanism for better reliability
      const albumData = await getAlbumDataWithRetry(albumId, 1, 3);
      
      if (albumData) {
        setData(albumData);
        setLoadingState({
          isLoading: false,
          isRefreshing: false,
          error: null
        });
      } else {
        setLoadingState({
          isLoading: false,
          isRefreshing: false,
          error: "Album not found or temporarily unavailable"
        });
      }
    } catch (error) {
      console.error("Error fetching album data:", error);
      setLoadingState({
        isLoading: false,
        isRefreshing: false,
        error: "Failed to load album data. Please try again."
      });
    }
  }, [albumId]);

  useEffect(() => {
    fetchAlbumData();
  }, [fetchAlbumData]);

  const handleRefresh = () => {
    fetchAlbumData(true);
  };

  const handleRelatedAlbumClick = (relatedAlbumId: string) => {
    router.push(`/library/albums/${relatedAlbumId}`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-800 rounded w-20 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-96 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Album Cover skeleton */}
          <div className="lg:col-span-1">
            <div className="aspect-square bg-gray-800 rounded-lg mb-4 animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-800 rounded flex-1 animate-pulse"></div>
              <div className="h-10 bg-gray-800 rounded flex-1 animate-pulse"></div>
            </div>
          </div>

          {/* Album Info skeleton */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="h-12 bg-gray-800 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-800 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Tracklist skeleton */}
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <div className="w-4 h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="w-4 h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related albums skeleton */}
        <div>
          <div className="h-6 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-3">
                <div className="aspect-square bg-gray-800 rounded-lg mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-6">{loadingState.error}</p>
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={handleRefresh}
            disabled={loadingState.isRefreshing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loadingState.isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );

  // Show loading skeleton
  if (loadingState.isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (loadingState.error && !data) {
    return <ErrorState />;
  }

  // Show not found if no data
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Album not found</h2>
          <p className="text-gray-400 mb-4">The album you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Refresh indicator */}
        {loadingState.isRefreshing && (
          <div className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Refreshing...
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-white font-semibold mb-2">Details</h1>
            <p className="text-gray-400 text-sm">
              {data.title} • {data.artistName} • {data.genreName} • {data.datecreated}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loadingState.isRefreshing}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loadingState.isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Album Cover and Controls */}
          <div className="lg:col-span-1">
            <div className="aspect-square bg-gray-700 rounded-lg mb-4 overflow-hidden relative">
              <Image
                src={isValidUrl(data.artworkPath) ? data.artworkPath : "/placeholder.svg"}
                alt={`${data.title} album cover`}
                width={300}
                height={300}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
                priority
              />
            </div>
            <div className="flex gap-3 w-full">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent flex-1">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Album Info and Tracklist */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-purple-400 mb-2">{data.title}</h2>
              <p className="text-gray-300">
                <span className="font-medium">{data.artistName}</span> • {data.genreName} • {data.datecreated}
              </p>
              {data.description && data.description !== "No description available" && (
                <p className="text-gray-400 text-sm mt-2">{data.description}</p>
              )}
            </div>

            {/* Tracklist */}
            {data.tracks && data.tracks.length > 0 ? (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-3">Tracks ({data.tracks.length})</h3>
                {data.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer ${
                      index === 0 ? "bg-purple-900/30" : ""
                    }`}
                  >
                    <span className="text-gray-400 w-4 text-sm">{index + 1}</span>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${index === 0 ? "text-purple-400" : "text-white"}`}>
                        {track.title}
                      </p>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                      {track.totalplays > 0 && (
                        <p className="text-gray-500 text-xs">{track.totalplays.toLocaleString()} plays</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                    <span className="text-gray-400 text-sm w-12 text-right">{track.duration}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No tracks available for this album</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Albums */}
        {data.relatedAlbums && data.relatedAlbums.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">By the same Artist</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.relatedAlbums.map((album) => (
                <Card
                  key={album.id}
                  className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleRelatedAlbumClick(album.id)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden">
                      <Image
                        src={isValidUrl(album.artworkPath) ? album.artworkPath : "/placeholder.svg"}
                        alt={album.title}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <h4 className="font-medium text-white text-sm truncate" title={album.title}>
                      {album.title}
                    </h4>
                    <p className="text-gray-400 text-xs truncate" title={album.artist}>
                      {album.artist}
                    </p>
                    <p className="text-gray-500 text-xs">{album.datecreated}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}