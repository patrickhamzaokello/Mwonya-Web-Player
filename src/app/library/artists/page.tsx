import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Music Platform</h1>
        <p className="text-muted-foreground">Discover amazing artists and their music</p>

        <div className="space-y-4">
          <div>
            <Link href="/library/artists/martist6044f454b39d2pin">
              <Button size="lg" className="w-full">
                View Beepee's Profile
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Example URL structure:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs">/library/artists/[artistId]</code>
          </div>
        </div>
      </div>
    </div>
  )
}
