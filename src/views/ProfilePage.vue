<template>
  <div class="profile">
    <h1>My Profile</h1>

    <section class="card">
      <h2>Display name (Alias)</h2>
      <p class="muted">This name will be shown in the header instead of your email.</p>
      <form @submit.prevent="saveAlias">
        <label>Alias</label>
        <input v-model="alias" placeholder="e.g. AlexRider" />
        <button :disabled="savingAlias">Save alias</button>
      </form>
    </section>

    <section class="card">
      <h2>Change password</h2>
      <form @submit.prevent="savePassword">
        <label>Current password</label>
        <input type="password" v-model="currentPassword" required />
        <label>New password</label>
        <input type="password" v-model="newPassword" required minlength="6" />
        <label>Confirm new password</label>
        <input type="password" v-model="confirm" required />
        <button :disabled="savingPass">Change password</button>
      </form>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/stores/auth';
import { useUserInterface } from '@/stores/UserInterface';

export default {
  name: 'ProfilePage',
  setup() {
    const auth = useAuth();
    const ui = useUserInterface();

    const alias = ref('');
    const savingAlias = ref(false);

    const currentPassword = ref('');
    const newPassword = ref('');
    const confirm = ref('');
    const savingPass = ref(false);

    onMounted(() => {
      if (!auth.user) auth.loadFromStorage();
      alias.value = auth.user?.alias || '';
    });

    async function saveAlias() {
      savingAlias.value = true;
      try {
        await auth.updateAlias(alias.value);
        ui.addToast('Alias updated');
      } catch (e) {
        ui.addToast(auth.error || e.message || 'Failed to update alias', 'error', 3000);
      } finally {
        savingAlias.value = false;
      }
    }

    async function savePassword() {
      if (newPassword.value !== confirm.value) {
        ui.addToast('New passwords do not match', 'error', 3000);
        return;
      }
      savingPass.value = true;
      try {
        await auth.changePassword(currentPassword.value, newPassword.value);
        ui.addToast('Password updated');
        currentPassword.value = newPassword.value = confirm.value = '';
      } catch (e) {
        ui.addToast(auth.error || e.message || 'Failed to change password', 'error', 3000);
      } finally {
        savingPass.value = false;
      }
    }

    return {
      auth, alias, savingAlias,
      currentPassword, newPassword, confirm, savingPass,
      saveAlias, savePassword,
    };
  },
};
</script>

<style>
.profile { max-width: 720px; margin: 24px auto; padding: 0 12px; }
.card { border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
h1 { margin-bottom: 16px; }
h2 { margin: 0 0 10px; }
label { display:block; margin-top:10px; font-size:14px; color:#555; }
input { width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin:4px 0 10px; }
button { background:#2563eb; color:#fff; border:0; padding:8px 12px; border-radius:6px; cursor:pointer; }
button:disabled { opacity:.6; cursor:not-allowed; }
.muted { color:#6b7280; font-size: 13px; margin-top:-6px; margin-bottom:6px; }
</style>
