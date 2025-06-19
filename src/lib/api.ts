// Demo API functions to simulate backend calls
import { Track, Playlist, Album, Artist } from '@/types/audio';
import { 
  demoTracks, 
  demoPlaylists, 
  demoAlbums, 
  demoArtists, 
  featuredContent,
  searchSuggestions 
} from './demo-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Home page content
  async getHomeContent() {
    await delay(800);
    return featuredContent;
  },

  // Search functionality
  async search(query: string, type: 'all' | 'tracks' | 'artists' | 'albums' | 'playlists' = 'all') {
    await delay(500);
    const lowerQuery = query.toLowerCase();

    const results = {
      tracks: type === 'all' || type === 'tracks' 
        ? demoTracks.filter(track => 
            track.title.toLowerCase().includes(lowerQuery) ||
            track.artist.toLowerCase().includes(lowerQuery) ||
            track.album?.toLowerCase().includes(lowerQuery)
          )
        : [],
      artists: type === 'all' || type === 'artists'
        ? demoArtists.filter(artist =>
            artist.name.toLowerCase().includes(lowerQuery)
          )
        : [],
      albums: type === 'all' || type === 'albums'
        ? demoAlbums.filter(album =>
            album.title.toLowerCase().includes(lowerQuery) ||
            album.artist.toLowerCase().includes(lowerQuery)
          )
        : [],
      playlists: type === 'all' || type === 'playlists'
        ? demoPlaylists.filter(playlist =>
            playlist.name.toLowerCase().includes(lowerQuery) ||
            playlist.description?.toLowerCase().includes(lowerQuery)
          )
        : [],
    };

    return results;
  },

  async getSearchSuggestions() {
    await delay(200);
    return searchSuggestions;
  },

  // Tracks
  async getTracks() {
    await delay(500);
    return demoTracks;
  },

  async getTrack(id: string) {
    await delay(300);
    return demoTracks.find(track => track.id === id) || null;
  },

  // Artists
  async getArtists() {
    await delay(500);
    return demoArtists;
  },

  async getArtist(id: string) {
    await delay(300);
    const artist = demoArtists.find(a => a.id === id);
    if (!artist) return null;
    
    const artistTracks = demoTracks.filter(track => track.artistId === id);
    const artistAlbums = demoAlbums.filter(album => album.artistId === id);
    
    return {
      ...artist,
      topTracks: artistTracks.slice(0, 10),
      albums: artistAlbums,
    };
  },

  // Albums
  async getAlbums() {
    await delay(500);
    return demoAlbums;
  },

  async getAlbum(id: string) {
    await delay(300);
    return demoAlbums.find(album => album.id === id) || null;
  },

  // Playlists
  async getPlaylists() {
    await delay(500);
    return demoPlaylists;
  },

  async getPlaylist(id: string) {
    await delay(300);
    return demoPlaylists.find(playlist => playlist.id === id) || null;
  },

  async createPlaylist(data: { name: string; description?: string; isPublic?: boolean }) {
    await delay(500);
    const newPlaylist: Playlist = {
      id: `playlist${Date.now()}`,
      name: data.name,
      description: data.description,
      tracks: [],
      isPublic: data.isPublic ?? true,
      createdBy: 'current-user',
      createdAt: new Date(),
    };
    
    demoPlaylists.push(newPlaylist);
    return newPlaylist;
  },

  async updatePlaylist(id: string, updates: Partial<Playlist>) {
    await delay(500);
    const playlistIndex = demoPlaylists.findIndex(p => p.id === id);
    if (playlistIndex === -1) throw new Error('Playlist not found');
    
    demoPlaylists[playlistIndex] = { ...demoPlaylists[playlistIndex], ...updates };
    return demoPlaylists[playlistIndex];
  },

  async deletePlaylist(id: string) {
    await delay(500);
    const playlistIndex = demoPlaylists.findIndex(p => p.id === id);
    if (playlistIndex === -1) throw new Error('Playlist not found');
    
    demoPlaylists.splice(playlistIndex, 1);
    return true;
  },

  async addTrackToPlaylist(playlistId: string, trackId: string) {
    await delay(300);
    const playlist = demoPlaylists.find(p => p.id === playlistId);
    const track = demoTracks.find(t => t.id === trackId);
    
    if (!playlist || !track) throw new Error('Playlist or track not found');
    
    if (!playlist.tracks.some(t => t.id === trackId)) {
      playlist.tracks.push(track);
    }
    
    return playlist;
  },

  async removeTrackFromPlaylist(playlistId: string, trackId: string) {
    await delay(300);
    const playlist = demoPlaylists.find(p => p.id === playlistId);
    if (!playlist) throw new Error('Playlist not found');
    
    playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
    return playlist;
  },

  // User library
  async getLikedTracks() {
    await delay(500);
    return demoTracks.filter(track => track.isLiked);
  },

  async getRecentlyPlayed() {
    await delay(500);
    // Simulate recently played tracks
    return demoTracks.slice(0, 10);
  },

  // Analytics (would send to real backend)
  async trackPlay(trackId: string, duration: number) {
    await delay(100);
    console.log(`Analytics: Track ${trackId} played for ${duration} seconds`);
    return true;
  },

  async trackSkip(trackId: string) {
    await delay(100);
    console.log(`Analytics: Track ${trackId} skipped`);
    return true;
  },

  async trackLike(trackId: string) {
    await delay(200);
    const track = demoTracks.find(t => t.id === trackId);
    if (track) {
      track.isLiked = true;
    }
    console.log(`Analytics: Track ${trackId} liked`);
    return true;
  },

  async trackUnlike(trackId: string) {
    await delay(200);
    const track = demoTracks.find(t => t.id === trackId);
    if (track) {
      track.isLiked = false;
    }
    console.log(`Analytics: Track ${trackId} unliked`);
    return true;
  },

  async reportTrack(trackId: string, reason: string) {
    await delay(300);
    console.log(`Analytics: Track ${trackId} reported for: ${reason}`);
    return true;
  },
};