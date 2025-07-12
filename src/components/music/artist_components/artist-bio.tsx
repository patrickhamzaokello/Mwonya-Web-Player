import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, MapPin } from "lucide-react"
import { ArtistBio } from "@/lib/artist_page_types"

interface ArtistBioProps {
  bio: ArtistBio
}

export function ArtistBioSection({ bio }: ArtistBioProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Biography</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">About {bio.name}</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {bio.bio.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Artist Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="text-foreground">{bio.datecreated}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Label:</span>
                    <span className="text-foreground">{bio.RecordLable}</span>
                  </div>

                  {bio.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="text-foreground">{bio.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Plays</span>
                    <Badge variant="secondary">{bio.overalplays}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Listeners</span>
                    <Badge variant="secondary">{bio.monthly}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Genre</span>
                    <Badge variant="outline">{bio.genre}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
