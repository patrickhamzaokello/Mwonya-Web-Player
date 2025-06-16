"use server";
import axios from 'axios';


export interface HomeFeedResponse {
  version: number;
  page: number;
  source: string;
  featured: Array<
    | HeroSection
    | ImageAdSection
    | NewReleaseSection
    | SliderSection
    | ArtistSection
    | GenreSection
    | TimelySection
    | RecentlyPlayedSection
    | TrendSection
    | AlbumsSection
    | TextAdSection
    | PlaylistSection
    | ArtistMoreLikeSection
    | FeaturedAlbumsSection
    | FeaturedMixtapesSection
  >;
  total_pages: number;
  total_results: number;
}

interface HeroSection {
  heading: string;
  type: "hero";
  subheading: string;
}

interface ImageAdSection {
  ad_title: string;
  type: "image_ad";
  ad_description: string;
  ad_link: string;
  ad_type: string;
  ad_image: string;
}

interface NewReleaseSection {
  heading: string;
  type: "newRelease";
  HomeRelease: AlbumRelease[];
}

export interface AlbumRelease {
  id: string;
  heading: string;
  title: string;
  artworkPath: string;
  tag: string;
  exclusive: boolean;
  artistId: string;
  artist: string;
  artistArtwork: string;
  Tracks: Track[];
}

export interface Track {
  id: number | string;
  title: string;
  artist: string;
  artistID: string;
  album: string;
  artworkPath: string | null;
  genre: string;
  genreID: number | string;
  duration: string;
  explicit: boolean;
  lyrics: string | null;
  path: string;
  totalplays: number;
  albumID: string;
  position?: string;
  trend?: boolean;
}

interface SliderSection {
  heading: string;
  type: "slider";
  featured_sliderBanners: SliderBanner[];
}

interface SliderBanner {
  id: number;
  playlistID: string;
  imagepath: string;
}

interface ArtistSection {
  heading: string;
  type: "artist";
  featuredArtists: Artist[];
}

interface Artist {
  id: string;
  profilephoto: string;
  name: string;
  verified: boolean;
}

interface GenreSection {
  heading: string;
  type: "genre";
  featuredGenres: Genre[];
}

interface Genre {
  id: number;
  name: string;
  tag: string;
}

interface TimelySection {
  heading: string;
  subheading: string;
  weekartist: string;
  weekdate: string;
  weekimage: string;
  type: "timely";
  Tracks: Track[];
}

interface RecentlyPlayedSection {
  heading: string;
  type: "recently";
  subheading: string;
}

interface TrendSection {
  heading: string;
  type: "trend";
  Tracks: Track[];
}

interface AlbumsSection {
  heading: string;
  type: "albums";
  featuredAlbums: Album[];
}

interface Album {
  id: string;
  title: string;
  description: string;
  artworkPath: string;
  artist: string;
  exclusive: boolean;
  artistImage: string;
  genre: string;
  tag: string;
}

interface TextAdSection {
  ad_title: string;
  type: "text_ad";
  ad_description: string;
  ad_link: string;
  ad_type: string;
  ad_image: string;
}

interface PlaylistSection {
  heading: string;
  type: "playlist";
  featuredPlaylists: Playlist[];
}

interface Playlist {
  id: string;
  name: string;
  owner: string;
  exclusive: boolean;
  coverurl: string;
}

interface ArtistMoreLikeSection {
  heading: string;
  subheading: string;
  type: "artist_more_like";
  featuredArtists: Artist[];
}

interface FeaturedAlbumsSection {
  heading: string;
  type: "albums";
  featuredAlbums: Album[];
}

interface FeaturedMixtapesSection {
  heading: string;
  type: "djs";
  FeaturedDjMixes: Mixtape[];
}

export interface Mixtape {
  id: string;
  title: string;
  description: string;
  artworkPath: string;
  artist: string;
  exclusive: boolean;
  artistImage: string;
  genre: string | null;
  tag: string;
}


export async function fetchHomeData(userID: string, page = 1): Promise<HomeFeedResponse> {
  console.log("Fetching Home data for user:", userID, "on page:", page);
  try {
    const response = await fetch(`https://api.mwonya.com/v1/Requests/endpoints/allcombined.php?page=${page}&userID=${userID}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Home data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Home data:", error);
    throw new Error("Failed to fetch Home data");
  }
}


export async function fetchPlaylistData(playlistId: string, page: number = 1) {
  try {
    const response = await axios.get(
      'https://api.mwonya.com/v1/Requests/endpoints/selectedPlaylist.php',
      {
        params: {
          page,
          playlistID: playlistId
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist data:', error);
    throw new Error('Failed to fetch playlist data');
  }
} 