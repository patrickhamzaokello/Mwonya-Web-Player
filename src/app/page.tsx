"use client";

import { Suspense } from "react";
import { fetchHomeData, HomeFeedResponse } from "@/lib/actions";
import { HeroSection } from "@/components/hero-section";
import { NewReleases } from "@/components/new-releases";
import { DiscoverSlider } from "@/components/discover-slider";
import { FeaturedArtists } from "@/components/featured-artists";
import { FeaturedGenres } from "@/components/featured-genres";
import { RecentlyPlayed } from "@/components/recently-played";
import { TrendingTracks } from "@/components/trending-tracks";
import { ExclusiveReleases } from "@/components/exclusive-releases";
import { RecommendedTracks } from "@/components/recommended-tracks";
import { FeaturedPlaylists } from "@/components/featured-playlists";
import { ArtistRecommendations } from "@/components/artist-recommendations";
import { FeaturedAlbums } from "@/components/featured-albums";
import { FeaturedMixtapes } from "@/components/featured-mixtapes";
import { MobileNavigation } from "@/components/mobile-navigation";
import { MiniPlayer } from "@/components/mini-player";
import { HomeSkeleton } from "@/components/home-skeleton";
import { ErrorDisplay } from "@/components/error-display";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24 w-full overflow-x-hidden">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
      <MiniPlayer />
      <MobileNavigation />
    </main>
  );
}

function HomeContent() {
  const userID = "mwUWTsKbYeIVPV20BN8or955NA1J43";
  const [data, setData] = useState<HomeFeedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const homeData = await fetchHomeData(userID);
        console.log("Fetched Home data:", homeData);
        setData(homeData);
      } catch (err) {
        console.error("Error fetching Home data:", err);
        setError("An unknown error occurred");
      }
    }

    fetchData();
    console.log("Home data state:", data);
  }, [userID]);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!data) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <div className="max-w-full w-full px-4 py-6 mx-auto lg:container overflow-hidden">
        <div className="flex flex-col space-y-6">
          {data.featured.map((section, index) => {
            switch (section.type) {
              case "hero":
                return (
                  <HeroSection
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      subheading: section.subheading || "Default Subheading",
                    }}
                  />
                );
              case "newRelease":
                return (
                  <NewReleases
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      HomeRelease: section.HomeRelease || [],
                    }}
                  />
                );
              case "slider":
                return (
                  <DiscoverSlider
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      featured_sliderBanners:
                        section.featured_sliderBanners || [],
                    }}
                  />
                );
              case "artist":
                return (
                  <FeaturedArtists
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      featuredArtists: section.featuredArtists || [],
                    }}
                  />
                );
              case "genre":
                return (
                  <FeaturedGenres
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      featuredGenres: section.featuredGenres || [],
                    }}
                  />
                );
              case "recently":
                return (
                  <RecentlyPlayed
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      subheading: section.subheading || "Default Subheading",
                    }}
                  />
                );
              case "trend":
                if (section.heading === "Trending Now") {
                  return (
                    <TrendingTracks
                      key={index}
                      data={{
                        ...section,
                        heading: section.heading || "Default Heading",
                        Tracks: section.Tracks || [],
                      }}
                    />
                  );
                } else if (section.heading === "You Might Like") {
                  return (
                    <RecommendedTracks
                      key={index}
                      data={{
                        ...section,
                        heading: section.heading || "Default Heading",
                        Tracks: section.Tracks || [],
                      }}
                    />
                  );
                }
                return null;
              case "albums":
                if (section.heading === "Exclusive Release") {
                  return (
                    <ExclusiveReleases
                      key={index}
                      data={{
                        ...section,
                        heading: section.heading || "Default Heading",
                        featuredAlbums: section.featuredAlbums || [],
                      }}
                    />
                  );
                } else if (section.heading === "Featured Albums") {
                  return (
                    <FeaturedAlbums
                      key={index}
                      data={{
                        ...section,
                        heading: section.heading || "Default Heading",
                        featuredAlbums: section.featuredAlbums || [],
                      }}
                    />
                  );
                }
                return null;
              case "playlist":
                return (
                  <FeaturedPlaylists
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      featuredPlaylists: section.featuredPlaylists || [],
                    }}
                  />
                );
              case "artist_more_like":
                return (
                  <ArtistRecommendations
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      subheading: section.subheading || "Default Subheading",
                      featuredArtists: section.featuredArtists || [],
                    }}
                  />
                );
              case "djs":
                return (
                  <FeaturedMixtapes
                    key={index}
                    data={{
                      ...section,
                      heading: section.heading || "Default Heading",
                      FeaturedDjMixes: section.FeaturedDjMixes || [],
                    }}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
}
