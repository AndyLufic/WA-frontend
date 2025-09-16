import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuth } from './auth';

export const useScooters = defineStore('scooters', {
  state: () => ({
    items: [],   // latest fetched scooters (public or mine, depending on call)
  }),

  actions: {
    // Public list (optionally filter by location)
    async fetchAll(params = {}) {
      const { data } = await axios.get('/api/scooters', { params });
      this.items = data;
      return data;
    },

    // Provider-owned list (optionally filter by location)
    async fetchMine(params = {}) {
      const auth = useAuth();
      const { data } = await axios.get('/api/scooters/mine', {
        params,
        headers: auth.authHeader,
      });
      this.items = data;
      return data;
    },

    async create(payload) {
      const auth = useAuth();
      const { data } = await axios.post('/api/scooters', payload, { headers: auth.authHeader });
      this.items.unshift(data);
      return data;
    },

    async update(id, patch) {
      const auth = useAuth();
      const { data } = await axios.patch(`/api/scooters/${id}`, patch, { headers: auth.authHeader });
      this.items = this.items.map(s => (s._id === id ? data : s));
      return data;
    },

    async remove(id) {
      const auth = useAuth();
      await axios.delete(`/api/scooters/${id}`, { headers: auth.authHeader });
      this.items = this.items.filter(s => s._id !== id);
    },
  },
});
