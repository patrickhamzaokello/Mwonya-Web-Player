import MinimalistArtistHero from "@/components/music/minimalist-artist-hero";
interface PageProps {
  params: {
    artistId: string;
  };
}

export default function ArtistPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background">
      <MinimalistArtistHero artistId={params.artistId} userId="mwUWTsKbYeIVPV20BN8or955NA1J43" />
    </div>
  );
}
