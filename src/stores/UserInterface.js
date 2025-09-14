import { defineStore } from 'pinia';

let nextId = 1;

export const useUserInterface = defineStore('userInterface', {
  state: () => ({
    toasts: [], // [{ id, text, type }]
  }),
  actions: {
    addToast(text, type = 'success', timeout = 2000) {
      const t = { id: nextId++, text, type };
      this.toasts.push(t);
      if (timeout) setTimeout(() => this.removeToast(t.id), timeout);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },
  },
});
