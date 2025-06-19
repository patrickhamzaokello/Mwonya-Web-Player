import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { customLoader } from "@/lib/utils"

interface ArtistRecommendationsProps {
  data: {
    heading: string
    subheading: string
    featuredArtists: Array<{
      id: string
      profilephoto: string
      name: string
      verified: boolean
    }>
  }
}

export function ArtistRecommendations({ data }: ArtistRecommendationsProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          {data.subheading} {data.heading}
        </h2>
      </div>
      <ScrollArea className="pb-4">
        <div className="flex gap-5">
          {data.featuredArtists.map((artist) => (
            <Link 
              key={artist.id} 
              href={`/artist/${artist.id}`} 
              className="group flex flex-col items-center space-y-3 w-32"
            >
              {/* Artist image with Apple Music styling */}
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100 shadow-sm">
                <Image
                 loader={customLoader}
                  src={artist.profilephoto || "/api/placeholder/112/112"}
                  alt={artist.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Artist name and verification badge */}
              <div className="flex items-center justify-center gap-1.5 w-full px-1">
                <span className="text-sm font-medium truncate">{artist.name}</span>
                {artist.verified && (
                  <div className="flex-shrink-0">
                    <VerificationBadge />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </div>
  )
}

// Custom verification badge SVG that resembles Apple Music's verification icon
function VerificationBadge() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7.5" fill="#0066FF" />
      <path 
        d="M11.3337 5.5L6.75033 10.0833L4.66699 8" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
