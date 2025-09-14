<template>
  <div class="user-menu" ref="root">
    <button class="trigger" @click="open = !open" :aria-expanded="open">
      <AvatarName :name="name" />
      <div class="info">
        <div class="name">{{ name }}</div>
        <div class="role">{{ role }}</div>
      </div>
      <span class="chev">▾</span>
    </button>

    <div v-if="open" class="menu" role="menu">
      <router-link class="item" to="/profile" role="menuitem">Profile</router-link>
      <router-link
        v-if="role === 'provider'"
        class="item"
        to="/provider-dashboard"
        role="menuitem"
      >
        Provider Dashboard
      </router-link>
      <button class="item danger" @click="$emit('logout')" role="menuitem">Logout</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AvatarName from './AvatarName.vue';

export default {
  name: 'UserMenu',
  components: { AvatarName },
  props: {
    name: { type: String, default: '' }, // alias or email (auth.displayName)
    role: { type: String, default: '' }, // 'customer' | 'provider'
  },
  emits: ['logout'],
  setup() {
    const open = ref(false);
    const root = ref(null);

    function onClickOutside(e) {
      if (!root.value) return;
      if (!root.value.contains(e.target)) open.value = false;
    }

    onMounted(() => {
      document.addEventListener('click', onClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside);
    });

    return { open, root };
  },
};
</script>

<style scoped>
.user-menu { position: relative; }
.trigger {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; border: 0; color: #fff; cursor: pointer; padding: 4px 6px;
}
.trigger .info { display: flex; flex-direction: column; line-height: 1.1; text-align: left; }
.trigger .name { font-size: 13px; font-weight: 600; color: #fff; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }
.trigger .role { font-size: 11px; color: #cfd8e3; text-transform: capitalize; }
.trigger .chev { font-size: 12px; opacity: .8; }

.menu {
  position: absolute; right: 0; top: calc(100% + 6px);
  background: #fff; color: #111;
  border: 1px solid #e5e7eb; border-radius: 8px;
  min-width: 200px; box-shadow: 0 8px 20px rgba(0,0,0,.12); padding: 6px;
  z-index: 50;
}
.item {
  display: block; width: 100%;
  text-align: left; padding: 8px 10px; border-radius: 6px;
  color: #111; text-decoration: none; border: 0; background: transparent; cursor: pointer;
}
.item:hover { background: #f1f5f9; }
.item.danger { color: #b91c1c; }
.item.danger:hover { background: #fee2e2; }
</style>
