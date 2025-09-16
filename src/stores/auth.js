// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuth = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,          // { id, email, role, alias }
    loading: false,
    error: null,
  }),

  getters: {
    isLogged:   (s) => !!s.token,
    isProvider: (s) => s.user?.role === 'provider',
    isCustomer: (s) => s.user?.role === 'customer',
    displayName:(s) => (s.user?.alias?.trim() || s.user?.email || 'User'),
    authHeader: (s) => (s.token ? { Authorization: `Bearer ${s.token}` } : {}),
  },

  actions: {
    /* ---------- storage helpers ---------- */
    loadFromStorage() {
      try {
        const raw = localStorage.getItem('auth');
        if (!raw) return;
        const data = JSON.parse(raw);
        this.token = data.token || null;
        this.user  = data.user  || null;
      } catch (e) {
        console.warn('auth loadFromStorage failed:', e);
      }
    },
    saveToStorage() {
      localStorage.setItem('auth', JSON.stringify({ token: this.token, user: this.user }));
    },
    clear() {
      this.token = null;
      this.user  = null;
      localStorage.removeItem('auth');
    },

    /* ---------- auth API ---------- */
    async signup({ email, password, role, alias = '' }) {
      this.loading = true; this.error = null;
      try {
        const { data } = await axios.post('/api/auth/signup', { email, password, role, alias });
        this.token = data.token;
        this.user  = data.user;
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
      this.loading = true; this.error = null;
      try {
        const { data } = await axios.post('/api/auth/login', { email, password });
        this.token = data.token;
        this.user  = data.user;
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
      this.loading = true; this.error = null;
      try {
        const { data } = await axios.get('/api/auth/me', { headers: this.authHeader });
        this.user = data;
        this.saveToStorage();
        return data;
      } catch (e) {
        // token expired / user deleted etc.
        this.clear();
        this.error = e?.response?.data?.error || e.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    /* ---------- profile API ---------- */
    async updateAlias(alias) {
      this.loading = true; this.error = null;
      try {
        const { data } = await axios.put(
          '/api/users/me',
          { alias },
          { headers: this.authHeader }
        );
        this.user = data;               // { id, email, role, alias }
        this.saveToStorage();
        return data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async changePassword(currentPassword, newPassword) {
      this.loading = true; this.error = null;
      try {
        const { data } = await axios.put(
          '/api/users/me/password',
          { currentPassword, newPassword },
          { headers: this.authHeader }
        );
        return data; // { success: true }
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.clear();
    },
  },
});
