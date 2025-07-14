import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useSubmissionStore = create(set => ({
  isLoading: null,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get('/submission/get-all-submissions');

      set({ submissions: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error getting all submissions ', error);
      toast.error('Error getting all submissions');
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async problemId => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/submission/get-submission/${problemId}`);

      set({ submissions: res.data.data });
      console.log('submission by problemId: ',res.data.data);
      
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error getting all submissions ', error);
      toast.error('Error getting all submissions');
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async problemId => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );

      set({ submissionCount: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error getting all submissions ', error);
      toast.error('Error getting all submissions');
    } finally {
      set({ isLoading: false });
    }
  }
}));
