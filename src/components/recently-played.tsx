import { Music } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentlyPlayedProps {
  data: {
    heading: string
    subheading: string
  }
}

export function RecentlyPlayed({ data }: RecentlyPlayedProps) {
  // In a real app, this would be fetched from user data
  const recentlyPlayed = []

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{data.heading}</h2>
        <p className="text-sm text-muted-foreground">{data.subheading}</p>
      </div>

      {recentlyPlayed.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Recently played tracks would go here */}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              No recently played tracks
            </CardTitle>
            <CardDescription>Your recently played tracks will appear here as you listen to music.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start listening to discover new music and build your history.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
