import { Album, Track } from "./home_feed_types"

export interface ArtistIntro {
  id: string
  name: string
  profilephoto: string
  coverimage: string
  monthly: string
  verified: boolean
  user_access_exclusive: boolean
  circle_cost: number
  circle_duration: number
  circle_cost_maximum: number
  following: boolean
  intro: string
}

export interface ArtistPick {
  id: string
  type: string
  out_now: string
  coverimage: string
  song_title: string
  exclusive: boolean
  song_cover: string
}





export interface RelatedArtist {
  id: string
  name: string
  verified: boolean
  genre: string
  profilephoto: string
}

export interface ArtistBio {
  id: string
  name: string
  email: string
  phone: string
  facebookurl: string
  twitterurl: string
  instagramurl: string
  RecordLable: string
  profilephoto: string
  coverimage: string
  bio: string
  genre: string
  datecreated: string
  tag: string
  overalplays: string
  monthly: string
  status: string
  verified: boolean
}

export interface ArtistEvent {
  // Add event properties when available
  id: string
  title: string
  date: string
  venue: string
  // Add more as needed
}

export interface ArtistSection {
  Type: string
  heading?: string
  ArtistIntro?: ArtistIntro[]
  ArtistPick?: ArtistPick[]
  Tracks?: Track[]
  ArtistAlbum?: Album[]
  RelatedArtist?: RelatedArtist[]
  Events?: ArtistEvent[]
  Bio?: ArtistBio[]
}

export interface ArtistApiResponse {
  page: number
  Artist: ArtistSection[]
  total_pages: number
  total_results: number
}

export interface ProcessedArtistData {
  intro: ArtistIntro | null
  latestRelease: ArtistPick | null
  popularTracks: Track[]
  discography: Album[]
  relatedArtists: RelatedArtist[]
  events: ArtistEvent[]
  bio: ArtistBio | null
}
