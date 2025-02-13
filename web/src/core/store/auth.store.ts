import { GoogleAuthProvider, UserCredential, onAuthStateChanged, signInWithPopup } from 'firebase/auth';

import { create } from 'zustand';
import { fbAuth } from '../services/Firebase';

interface AuthState {
  user: any | null;
  clearUser: () => void;
  login: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  clearUser: () => set({ user: null }),
  login: async() => {
    onAuthStateChanged(fbAuth, async(user) => {
      if (user) {
        set({ user: user as any });
      } else {
        const credential: UserCredential = await signInWithPopup(fbAuth, new GoogleAuthProvider());
        console.log(credential);
        set({ user: credential.user as any });
      }
    })

  },
  logout: () => {},
}));

export default useAuthStore;
