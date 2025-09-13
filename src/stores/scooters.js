import { defineStore } from "pinia";
import axios from "axios";
import { useAuth } from "./auth";

export const useScooters = defineStore("scooters", {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get("/api/scooters", { params });
        this.items = data;
        return data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      const auth = useAuth();
      try {
        const { data } = await axios.post("/api/scooters", payload, {
          headers: auth.authHeader,
        });
        this.items.push(data);
        return data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      }
    },

    async update(id, patch) {
      const auth = useAuth();
      try {
        const { data } = await axios.patch(`/api/scooters/${id}`, patch, {
          headers: auth.authHeader,
        });
        const i = this.items.findIndex((s) => s._id === id);
        if (i !== -1) this.items[i] = data;
        return data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      }
    },

    async remove(id) {
      const auth = useAuth();
      try {
        await axios.delete(`/api/scooters/${id}`, {
          headers: auth.authHeader,
        });
        this.items = this.items.filter((s) => s._id !== id);
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      }
    },
  },
});
