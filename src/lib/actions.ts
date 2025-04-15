'use server'

import axios from 'axios';


export interface HomeData {
  version: number
  page: number
  source: string
  featured: Array<{
    heading: string
    type: string
    subheading?: string
    HomeRelease?: Array<{
      id: string
      heading: string
      title: string
      artworkPath: string
      tag: string
      exclusive: boolean
      artistId: string
      artist: string
      artistArtwork: string
      Tracks: Array<{
        id: number | string
        title: string
        artist: string
        artistID: string
        album: string
        artworkPath: string
        genre: string
        genreID: number | string
        duration: string
        lyrics: null | string
        path: string
        totalplays: number
        albumID: string
      }>
    }>
    featured_sliderBanners?: Array<{
      id: number
      playlistID: string
      imagepath: string
    }>
    featuredArtists?: Array<{
      id: string
      profilephoto: string
      name: string
      verified: boolean
    }>
    featuredGenres?: Array<{
      id: number
      name: string
      tag: string
    }>
    Tracks?: Array<{
      id: number | string
      title: string
      artist: string
      artistID: string
      album: string
      artworkPath: string
      genre: string
      genreID: number | string
      duration: string
      lyrics: null | string
      path: string
      totalplays: number
      albumID: string
    }>
    featuredAlbums?: Array<{
      id: string
      title: string
      description: string
      artworkPath: string
      artist: string
      exclusive: boolean
      artistImage: string
      genre: string | null
      tag: string
    }>
    featuredPlaylists?: Array<{
      id: string
      name: string
      owner: string
      exclusive: boolean
      coverurl: string
    }>
    FeaturedDjMixes?: Array<{
      id: string
      title: string
      description: string
      artworkPath: string
      artist: string
      exclusive: boolean
      artistImage: string
      genre: string
      tag: string
    }>
  }>
  total_pages: number
  total_results: number
}


export async function fetchHomeData(userID: string, page = 1): Promise<HomeData> {
  try {
    const response = await axios.get(`https://api.mwonya.com/Requests/endpoints/allcombined.php`, {
      params: {
        page,
        userID: userID,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching Home data:", error)
    throw new Error("Failed to fetch Home data")
  }
}


export async function fetchPlaylistData(playlistId: string, page: number = 1) {
  try {
    const response = await axios.get(
      `https://api.mwonya.com/Requests/endpoints/selectedPlaylist.php`,
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