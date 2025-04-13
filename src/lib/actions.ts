'use server'

import axios from 'axios';

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