'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import MinimalistArtistHero from "@/components/music/minimalist-artist-hero";

function ArtistPageContent() {
  const params = useParams();
  const artistId = params.artistId as string;

  return (
    <div className="min-h-screen bg-background">
      <MinimalistArtistHero artistId={artistId} userId="mwUWTsKbYeIVPV20BN8or955NA1J43" />
    </div>
  );
}

export default function ArtistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <ArtistPageContent />
    </Suspense>
  );
}