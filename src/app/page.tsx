"use client";

import React, { useEffect, useState } from "react";

import { useAudio } from "@/contexts/EnhancedAudioContext";

import { useAuth } from "@/contexts/AuthContext";

import { useHomeFeed } from "@/hooks/use-home-feed";
import { DEFAULT_USER_ID, CONTENT_TYPES } from "@/lib/constants";
import { MusicHeroSlider } from "@/components/home-sections/hero-section";
import { ImageAd } from "@/components/home-sections/image-ad";
import { NewReleasesSection } from "@/components/home-sections/new-releases-section";
import { FeaturedArtistsSection } from "@/components/home-sections/featured-artists-section";
import { WeeklyTopSection } from "@/components/home-sections/weekly-top-section";
import { GenreSection } from "@/components/home-sections/genre-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FeaturedAlbumsSection from "@/components/home-sections/featured-albums";
import FeaturedTracksSection from "@/components/home-sections/featured-tracks-section";
import FeaturedPlaylistsSection from "@/components/home-sections/featured-playlist";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { setQueue, play, currentTrack, isPlaying } = useAudio();
  const { data, loading, error } = useHomeFeed(DEFAULT_USER_ID);

  useEffect(() => {
    if (isAuthenticated) {
      // loadHomeData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Will be handled by AppShell redirect
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-64 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-40 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load home feed. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No data available at the moment.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-8 p-6">
        {data.featured.map((section, index) => {
          switch (section.type) {
            case CONTENT_TYPES.NEW_RELEASE:
              return (
                <MusicHeroSlider
                  key={index}
                  releases={section.HomeRelease || []}
                />
              );

            case CONTENT_TYPES.IMAGE_AD:
              return (
                <ImageAd
                  key={index}
                  title={section.ad_title || ""}
                  description={section.ad_description || ""}
                  image={section.ad_image || ""}
                  link={section.ad_link || ""}
                  type={section.ad_type || ""}
                />
              );

            // case CONTENT_TYPES.NEW_RELEASE:
            //   return (
            //     <NewReleasesSection
            //       key={index}
            //       releases={section.HomeRelease || []}
            //       heading={section.heading || "New Releases"}
            //     />
            //   );

            case CONTENT_TYPES.ARTIST:
              return (
                <FeaturedArtistsSection
                  key={index}
                  artists={section.featuredArtists || []}
                  heading={section.heading || "Featured Artists"}
                />
              );

            case CONTENT_TYPES.ALBUMS:
              return (
                <FeaturedAlbumsSection
                  key={index}
                  albums={section.featuredAlbums || []}
                  heading={section.heading || "Featured Albums"}
                />
              );

            case CONTENT_TYPES.DJS:
              return (
                <FeaturedAlbumsSection
                  key={index}
                  albums={section.FeaturedDjMixes || []}
                  heading={section.heading || "Featured Mixtapes"}
                />
              );

            case CONTENT_TYPES.GENRE:
              return (
                <GenreSection
                  key={index}
                  genres={section.featuredGenres || []}
                  heading={section.heading || "Featured Genres"}
                />
              );

            case CONTENT_TYPES.TIMELY:
              return (
                <WeeklyTopSection
                  key={index}
                  tracks={section.Tracks || []}
                  heading={section.heading || "Weekly Top 10"}
                  subheading={section.subheading || ""}
                  weekArtist={section.weekartist || ""}
                  weekDate={section.weekdate || ""}
                  weekImage={section.weekimage || ""}
                />
              );

            case CONTENT_TYPES.PLAYLIST:
              return (
                <FeaturedPlaylistsSection
                  key={index}
                  playlists={section.featuredPlaylists || []}
                  heading={section.heading || "Featured Playlists"}
                />
              );

            case CONTENT_TYPES.TREND:
              return (
                <FeaturedTracksSection
                  key={index}
                  tracks={section.Tracks || []}
                  heading={section.heading || "Featured Tracks"}
                />
              );

            case CONTENT_TYPES.TEXT_AD:
              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8"
                >
                  <h3 className="text-xl font-bold mb-2">{section.ad_title}</h3>
                  <p className="mb-4">{section.ad_description}</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Learn More
                  </button>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
