import { defineStore } from 'pinia';
import axios from 'axios';

export const useScooters = defineStore('scooters', {
  state: () => ({ items: [], loading: false, error: null }),
  actions: {
    async fetchAll(params = {}) {
      this.loading = true; this.error = null;
      try {
        const res = await axios.get('/api/scooters', { params }); // proxy handles base
        this.items = res.data;
      } catch (e) { this.error = e?.response?.data || e.message; }
      finally { this.loading = false; }
    },
    async create(payload) {
      const { data } = await axios.post('/api/scooters', payload);
      this.items.push(data);
      return data;
    },
    async update(id, patch) {
      const { data } = await axios.patch(`/api/scooters/${id}`, patch);
      const i = this.items.findIndex(s => s.id === id);
      if (i !== -1) this.items[i] = data;
      return data;
    },
    async remove(id) {
      await axios.delete(`/api/scooters/${id}`);
      this.items = this.items.filter(s => s.id !== id);
    }
  }
});
