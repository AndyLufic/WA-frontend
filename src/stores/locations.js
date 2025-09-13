import { defineStore } from "pinia";
import axios from "axios";
import { useAuth } from "./auth";

export const useLocations = defineStore("locations", {
  state: () => ({
    items: [],   // array of locations
    loading: false,
    error: null
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get("/api/locations");
        this.items = data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      const auth = useAuth();
      try {
        const { data } = await axios.post("/api/locations", payload, {
          headers: auth.authHeader
        });
        this.items.push(data);
        return data;
      } catch (e) {
        throw e?.response?.data || e;
      }
    },

    async update(id, patch) {
      const auth = useAuth();
      try {
        const { data } = await axios.patch(`/api/locations/${id}`, patch, {
          headers: auth.authHeader
        });
        const i = this.items.findIndex(l => l._id === id);
        if (i !== -1) this.items[i] = data;
        return data;
      } catch (e) {
        throw e?.response?.data || e;
      }
    },

    async remove(id) {
      const auth = useAuth();
      try {
        await axios.delete(`/api/locations/${id}`, {
          headers: auth.authHeader
        });
        this.items = this.items.filter(l => l._id !== id);
      } catch (e) {
        throw e?.response?.data || e;
      }
    }
  }
});
