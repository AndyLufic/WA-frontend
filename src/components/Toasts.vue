<template>
  <div class="toasts">
    <div v-for="t in ui.toasts" :key="t.id" class="toast" :data-type="t.type">
      {{ t.text }}
    </div>
  </div>
</template>

<script>
import { useUserInterface } from '@/stores/UserInterface';

export default {
  name: 'AppToasts',
  setup() {
    const ui = useUserInterface();
    return { ui };
  },
};
</script>

<style scoped>
.toasts {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  padding: 10px 12px;
  border-radius: 8px;
  background: #10b981; /* success */
  color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,.12);
  font-size: 14px;
  font-weight: 600;
}

.toast[data-type="error"] {
  background: #ef4444;
}
</style>
