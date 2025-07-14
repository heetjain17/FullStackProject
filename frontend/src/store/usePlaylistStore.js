import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoadingPlaylist: false,
  error: null,

  createPlaylist: async playlistData => {
    try {
      set({ isLoadingPlaylist: true });
      const res = await axiosInstance.post('/playlist/create-playlist', playlistData);

      set( state => ({
        playlists: [...state.playlists, res.data.data]
      }))

      toast.success('Playlist created succesfully')
      return res.data.data
    } catch (error) {
      console.log('Error creating playlist: ', error);
      toast.error(error.res?.data?.error || 'Failed to create playlist')
    } finally {
      set({ isLoadingPlaylist: false });
    }
  },

  getAllPlaylists: async () => {
    try {
      set({ isLoadingPlaylist: true });
      const res = await axiosInstance.get(`/playlist/`);

      set({playlists: res.data.data})

      toast.success('All Playlists fetched succesfully')

    } catch (error) {
      console.log('Error fetching all playlists: ', error);
      toast.error('Failed to load all playlists')
    } finally {
      set({ isLoadingPlaylist: false });
    }
  },

  getPlaylistDetails: async playlistId => {
    try {
      set({ isLoadingPlaylist: true });
      const res = await axiosInstance.get(`/playlist/${playlistId}`);

      set({playlists: res.data.data})
      toast.success('Playlist fetched succesfully')

    } catch (error) {
      console.log('Error fetching playlist: ', error);
      toast.error('Failed to load playlist')
    } finally {
      set({ isLoadingPlaylist: false });
    }
  },

  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoadingPlaylist: true });
      const res = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {problemIds});
      
      toast.success('Problem added to playlist')

      // refershing the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId)
      }
    } catch (error) {
      console.log('Error adding problem to playlist: ', error);
      toast.error('Failed to add problem to playlist')
    } finally {
      set({ isLoadingPlaylist: false });
    }
  },
}))