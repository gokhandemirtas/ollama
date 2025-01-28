import api from '../services/HttpClient';
import { create } from 'zustand';

interface CharacterMetaState {
  classes: Array<string>;
  races: Array<string>;
  alignments: Array<string>;
  fetchCharacterMeta: () => Promise<void>;
  updateCharacterMeta: () => Promise<void>;
}

const useCharacterMetaStore = create<CharacterMetaState>((set) => ({
  classes: [],
  races: [],
  alignments: [],
  fetchCharacterMeta: async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/character-meta`, {
        timeout: import.meta.env.VITE_TIMEOUT
      });
      const data = await response.json() as any;
      set({ classes: data.classes, races: data.races, alignments: data.alignments });
    } catch (error) {
      console.error('Failed to fetch character meta:', error);
    }
  },
  updateCharacterMeta: async () => {
    try {
      await api.get(`${import.meta.env.VITE_BACKEND_URL}/update-meta`, {
        timeout: import.meta.env.VITE_TIMEOUT
      });
    } catch (error) {
      console.error('Failed to fetch character meta:', error);
    }
  }
}));

export default useCharacterMetaStore;
