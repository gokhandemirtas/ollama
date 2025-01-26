import api from '../services/HttpClient';
import { create } from 'zustand';

interface CharacterMetaState {
  classes: Array<string>;
  races: Array<string>;
  alignments: Array<string>;
  fetchCharacterMeta: () => Promise<void>;
}

const useCharacterMetaStore = create<CharacterMetaState>((set) => ({
  classes: [],
  races: [],
  alignments: [],
  fetchCharacterMeta: async () => {
    if (localStorage.getItem('characterMeta')) {
      const data = JSON.parse(localStorage.getItem('characterMeta')!);
      set({ classes: data.classes, races: data.races, alignments: data.alignments });
      return
    }
    try {
      const response = await api.post(`${import.meta.env.VITE_BACKEND_URL}/character-meta`, {
        json: { query: "Get character meta" },
        timeout: import.meta.env.VITE_TIMEOUT
      });
      const json = await response.json() as any;
      const data = JSON.parse(json);
      localStorage.setItem('characterMeta', json);
      set({ classes: data.classes, races: data.races, alignments: data.alignments });
    } catch (error) {
      console.error('Failed to fetch character meta:', error);
    }
  }
}));

export default useCharacterMetaStore;
