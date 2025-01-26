import { IUser } from '../models/user';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user: IUser) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
