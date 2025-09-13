<template>
  <div class="dashboard">
    <h1>Provider Dashboard</h1>

    <p v-if="locationsStore.loading || scootersStore.loading">Loading…</p>
    <p v-if="locationsStore.error" class="error">Locations error: {{ locationsStore.error }}</p>
    <p v-if="scootersStore.error" class="error">Scooters error: {{ scootersStore.error }}</p>

    <div v-if="!locationsStore.items.length && !locationsStore.loading">
      <em>No locations yet. Create one by clicking on the map (as provider) or add here later.</em>
    </div>

    <div v-for="loc in locationsStore.items" :key="loc._id" class="location-card">
      <h2>
        {{ loc.name }} <small>({{ loc.city }})</small>
      </h2>
      <p>Coords: {{ loc.lat }}, {{ loc.lng }}</p>

      <button @click="openCreateForm(loc._id)">+ Add Scooter</button>

      <table class="scooter-table" v-if="scootersByLocation(loc._id).length">
        <thead>
          <tr>
            <th>Model</th>
            <th>Battery</th>
            <th>Status</th>
            <th>Last Seen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in scootersByLocation(loc._id)" :key="s._id">
            <td>{{ s.model }}</td>
            <td>{{ s.battery }}%</td>
            <td>
              <select v-model="s.status" @change="updateStatus(s)">
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </td>
            <td>{{ formatDateTime(s.lastSeen) }}</td>
            <td>
              <button @click="editScooter(s)">Edit</button>
              <button @click="removeScooter(s._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="muted">No scooters at this location.</p>
    </div>

    <!-- Create/Edit Scooter Modal -->
    <div v-if="formOpen" class="modal">
      <div class="modal-content">
        <h3>{{ editMode ? "Edit Scooter" : "Create Scooter" }}</h3>
        <form @submit.prevent="submitForm">
          <label>Model</label>
          <input v-model="form.model" required />

          <label>Battery (%)</label>
          <input type="number" v-model.number="form.battery" min="0" max="100" required />

          <label>Status</label>
          <select v-model="form.status">
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>

          <div class="actions">
            <button type="submit" :disabled="scootersStore.loading">Save</button>
            <button type="button" @click="closeForm">Cancel</button>
          </div>
        </form>
        <p v-if="scootersStore.error" class="error">{{ scootersStore.error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useLocations } from "@/stores/locations";
import { useScooters } from "@/stores/scooters";

export default {
  name: "ProviderDashboard",
  setup() {
    const locationsStore = useLocations();
    const scootersStore = useScooters();

    const formOpen = ref(false);
    const editMode = ref(false);
    const form = ref({
      id: null,
      location: null,
      model: "",
      battery: 100,
      status: "available",
    });

    onMounted(async () => {
      try {
        await locationsStore.fetchAll();      // load locations
        await scootersStore.fetchAll();       // load all scooters once
      } catch (e) {
        // errors are already set on stores; console helps debugging
        console.error("Dashboard load failed:", e);
      }
    });

    function scootersByLocation(locId) {
      return scootersStore.items.filter((s) => s.location?._id === locId);
    }

    function openCreateForm(locId) {
      editMode.value = false;
      form.value = {
        id: null,
        location: locId,
        model: "",
        battery: 100,
        status: "available",
      };
      formOpen.value = true;
    }

    function editScooter(s) {
      editMode.value = true;
      form.value = {
        id: s._id,
        location: s.location._id,
        model: s.model,
        battery: s.battery,
        status: s.status,
      };
      formOpen.value = true;
    }

    async function submitForm() {
      try {
        if (editMode.value) {
          await scootersStore.update(form.value.id, {
            model: form.value.model,
            battery: form.value.battery,
            status: form.value.status,
          });
        } else {
          await scootersStore.create({
            model: form.value.model,
            battery: form.value.battery,
            status: form.value.status,
            location: form.value.location,
          });
        }
        formOpen.value = false;
      } catch (e) {
        console.error("Save failed:", e);
      }
    }

    async function updateStatus(s) {
      try {
        await scootersStore.update(s._id, { status: s.status });
      } catch (e) {
        alert("Update failed: " + (e?.response?.data?.error || e.message));
      }
    }

    async function removeScooter(id) {
      if (!confirm("Delete this scooter?")) return;
      try {
        await scootersStore.remove(id);
      } catch (e) {
        alert("Delete failed: " + (e?.response?.data?.error || e.message));
      }
    }

    function closeForm() { formOpen.value = false; }
    function formatDateTime(d) { return d ? new Date(d).toLocaleString() : "–"; }

    return {
      locationsStore,
      scootersStore,
      formOpen,
      editMode,
      form,
      openCreateForm,
      editScooter,
      submitForm,
      updateStatus,
      removeScooter,
      closeForm,
      scootersByLocation,
      formatDateTime,
    };
  },
};
</script>

<style>
.dashboard { padding: 1rem; }
.location-card {
  border: 1px solid #ddd; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; background: #f9f9f9;
}
.scooter-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
.scooter-table th, .scooter-table td { border: 1px solid #ccc; padding: 0.4rem 0.6rem; }
.error { color: #c0392b; }
.muted { color: #777; }

.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; padding: 1rem; border-radius: 6px; width: 320px; }
.actions { margin-top: 1rem; display: flex; justify-content: space-between; }
</style>
