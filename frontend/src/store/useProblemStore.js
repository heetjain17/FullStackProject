import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useProblemStore = create(set => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get('/problem/get-all-problems');

      set({ problems: res.data.data });
    } catch (error) {
      console.log('Error getting all problems ', error);
      toast.error('Error getting all problems ');
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getProblemById: async id => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problem/get-problem/${id}`);

      set({ problem: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log('Error getting problem ', error);
      toast.error('Error getting problem ');
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problem/get-solved-problems`);

      set({ problems: res.data.problems });
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error getting solved problems ', error);
      toast.error('Error getting solved problems ');
    } finally {
      set({ isProblemLoading: false });
    }
  }
}));
