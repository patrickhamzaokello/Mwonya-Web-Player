import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ArtistApiResponse, ProcessedArtistData } from "./artist_page_types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const customLoader = ({ src }: { src: string }) => {
  try {
    new URL(src);
    return src;
  } catch {
    return "/placeholder.svg";
  }
};

export function formatTime(seconds: number): string {
    if (isNaN(seconds)) return "0:00"
  
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
  
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  export function formatDuration(seconds: number): string {
    if (isNaN(seconds)) return "0:00"
  
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
  
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  export const customUrlImageLoader = ({ src }: { src: string }) => {
    try {
      new URL(src);
      return src;
    } catch {
      return "/placeholder.svg";
    }
  };



export function processArtistData(apiResponse: ArtistApiResponse): ProcessedArtistData {
  const sections = apiResponse.Artist

  return {
    intro: sections.find((s) => s.Type === "intro")?.ArtistIntro?.[0] || null,
    latestRelease: sections.find((s) => s.Type === "pick")?.ArtistPick?.[0] || null,
    popularTracks: sections.find((s) => s.Type === "trending")?.Tracks || [],
    discography: sections.find((s) => s.Type === "release")?.ArtistAlbum || [],
    relatedArtists: sections.find((s) => s.Type === "related_artist")?.RelatedArtist || [],
    events: sections.find((s) => s.Type === "events")?.Events || [],
    bio: sections.find((s) => s.Type === "bio")?.Bio?.[0] || null,
  }
}