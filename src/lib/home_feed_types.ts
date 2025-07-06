// Type definitions for the API response
export interface Track {
  id: string | number
  title: string
  artist: string
  artistID: string
  album: string
  artworkPath: string 
  genre: string | null
  genreID: string | number | null
  duration: string
  lyrics: string | null
  path: string
  totalplays: number
  albumID: string
  position?: string
  trend?: boolean
}

export interface Artist {
  id: string
  profilephoto: string
  name: string
  verified: boolean
}

export interface Album {
  id: string
  title: string
  description: string
  artworkPath: string
  artist: string
  exclusive: boolean
  artistImage: string
  genre: string | null
  tag: string
}

export interface Playlist {
  id: string
  name: string
  owner: string
  exclusive: boolean
  coverurl: string
}

export interface Genre {
  id: number
  name: string
  tag: string
}

export interface NewRelease {
  id: string
  heading: string
  title: string
  artworkPath: string
  tag: string
  exclusive: boolean
  artistId: string
  artist: string
  artistArtwork: string
  Tracks: Track[]
}

export interface SliderBanner {
  id: number
  playlistID: string
  imagepath: string
}

export interface FeaturedSection {
  heading?: string
  subheading?: string
  type: string
  // Hero section
  // Image ad
  ad_title?: string
  ad_description?: string
  ad_link?: string
  ad_type?: string
  ad_image?: string
  // New releases
  HomeRelease?: NewRelease[]
  // Slider
  featured_sliderBanners?: SliderBanner[]
  // Artists
  featuredArtists?: Artist[]
  // Genres
  featuredGenres?: Genre[]
  // Weekly top
  weekartist?: string
  weekdate?: string
  weekimage?: string
  Tracks?: Track[]
  // Albums
  featuredAlbums?: Album[]
  // Playlists
  featuredPlaylists?: Playlist[]
  // DJ Mixes
  FeaturedDjMixes?: Album[]
}

export interface HomeFeedResponse {
  version: number
  page: number
  source: string
  featured: FeaturedSection[]
  total_pages: number
  total_results: number
}
