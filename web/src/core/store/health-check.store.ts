import api from '../services/HttpClient';
import {create} from 'zustand';

interface HealthCheckResults {
  isDbOnline: boolean;
  isLLmOnline: boolean;
}

interface HealthCheckState {
  healthCheckResults: HealthCheckResults;
  fetchHealthCheckResults: () => Promise<void>;
}

const useHealthCheckStore = create<HealthCheckState>((set) => ({
  healthCheckResults: {
    isDbOnline: false,
    isLLmOnline: false,
  },
  fetchHealthCheckResults: async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/healthcheck`);
      const data = await response.json() as HealthCheckResults;
      set({ healthCheckResults: data });
    } catch (error) {
      console.error('Failed to fetch health check results:', error);
    }
  },
}));

export default useHealthCheckStore;

