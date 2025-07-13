import { fetchArtistData } from "@/actions/artist-data";
import FeaturedAlbumsSection from "@/components/home-sections/featured-albums";
import { FeaturedArtistsSection } from "@/components/home-sections/featured-artists-section";
import { ArtistBioSection } from "@/components/music/artist_components/artist-bio";
import { LatestRelease } from "@/components/music/artist_components/latest-release";
import MinimalistArtistHero from "@/components/music/artist_components/minimalist-artist-hero";
import { PopularTracks } from "@/components/music/artist_components/popular-tracks";
import { useAudio } from "@/contexts/EnhancedAudioContext";
import { Track } from "@/lib/home_feed_types";
import { processArtistData } from "@/lib/utils";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

export default async function ArtistPage({ params }: PageProps) {
  const { artistId } = await params;
  const userid = "mwUWTsKbYeIVPV20BN8or955NA1J43";

  try {
    const apiResponse = await fetchArtistData(artistId, userid);
    const artistData = processArtistData(apiResponse);

    if (!artistData.intro) {
      notFound();
    }

    return (
      <div className="h-full overflow-auto">
        <div className="space-y-8 p-6">
          {/* Hero Section */}
          <MinimalistArtistHero artistData={artistData.intro} trackstoPlay={artistData.popularTracks} />
          <div className="flex flex-row gap-8">
            {/* Popular Tracks */}
            {artistData.popularTracks.length > 0 && (
              <PopularTracks tracks={artistData.popularTracks} />
            )}

            {/* Latest Release */}
            {artistData.latestRelease && (
              <LatestRelease release={artistData.latestRelease} />
            )}
          </div>

          {/* Discography */}
          {artistData.discography.length > 0 && (
            <FeaturedAlbumsSection
              albums={artistData.discography || []}
              heading={"Discography"}
            />
          )}

          {/* Related Artists */}
          {artistData.relatedArtists.length > 0 && (
            <FeaturedArtistsSection
              artists={artistData.relatedArtists || []}
              heading={"Related Artists"}
            />
          )}

          {/* Artist Bio */}
          {artistData.bio && <ArtistBioSection bio={artistData.bio} />}

          {/* Events section would go here when data is available */}
          {artistData.events.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-6">
                <h2 className="text-2xl font-semibold text-foreground mb-8">
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground">
                  No upcoming events at this time.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading artist page:", error);
    notFound();
  }
}
