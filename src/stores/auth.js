import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuth = defineStore('auth', {
  state: () => ({
    token: null,
    user: null, // { id, email, role }
    loading: false,
    error: null
  }),

  getters: {
    isLogged: (s) => !!s.token,
    isProvider: (s) => s.user?.role === 'provider',
    isCustomer: (s) => s.user?.role === 'customer',
    authHeader: (s) => (s.token ? { Authorization: `Bearer ${s.token}` } : {})
  },

  actions: {
    loadFromStorage() {
      const raw = localStorage.getItem('auth');
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        this.token = data.token || null;
        this.user = data.user || null;
      } catch (err) {
        console.error("Failed to parse auth from storage:", err);
      }
    },

    saveToStorage() {
      localStorage.setItem('auth', JSON.stringify({ token: this.token, user: this.user }));
    },

    clear() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth');
    },

    async signup({ email, password, role }) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post('/api/auth/signup', { email, password, role });
        this.token = data.token;
        this.user = data.user;
        this.saveToStorage();
        return data.user;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async login({ email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post('/api/auth/login', { email, password });
        this.token = data.token;
        this.user = data.user;
        this.saveToStorage();
        return data.user;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async me() {
      if (!this.token) return null;
      try {
        const { data } = await axios.get('/api/auth/me', { headers: this.authHeader });
        this.user = data;
        this.saveToStorage();
        return data;
      } catch (err) {
        console.error("Auth me failed:", err);
        this.clear();
        return null;
      }
    },

    logout() {
      this.clear();
    }
  }
});
