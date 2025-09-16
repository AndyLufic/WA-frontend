import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuth } from './auth';

export const useLocations = defineStore('locations', {
  state: () => ({
    items: [],   // public list (no owner field)
    mine: [],    // my locations (provider only)
  }),

  getters: {
    mineIdSet: (s) => new Set(s.mine.map(l => l._id)),
    isMine: (s) => (id) => s.mineIdSet.has(id),
  },

  actions: {
    async fetchAll() {
      const { data } = await axios.get('/api/locations');
      this.items = data;
      return data;
    },

    async fetchMine() {
      const auth = useAuth();
      const { data } = await axios.get('/api/locations/mine', { headers: auth.authHeader });
      this.mine = data;
      return data;
    },

    async create(payload) {
      const auth = useAuth();
      const { data } = await axios.post('/api/locations', payload, { headers: auth.authHeader });
      // keep both lists in sync
      this.items.unshift({ ...data }); // public list doesn’t include owner; fine
      this.mine.unshift(data);
      return data;
    },

    async update(id, patch) {
      const auth = useAuth();
      const { data } = await axios.patch(`/api/locations/${id}`, patch, { headers: auth.authHeader });
      // update public list
      this.items = this.items.map(l => (l._id === id ? { ...l, ...data } : l));
      // update mine
      this.mine  = this.mine.map(l => (l._id === id ? data : l));
      return data;
    },

    async remove(id) {
      const auth = useAuth();
      await axios.delete(`/api/locations/${id}`, { headers: auth.authHeader });
      this.items = this.items.filter(l => l._id !== id);
      this.mine  = this.mine.filter(l => l._id !== id);
    },
  },
});
