<template>
  <div class="provider-dashboard">
    <h1>Provider Dashboard</h1>

    <div class="grid">
      <!-- LEFT: My Locations -->
      <section class="card">
        <h2>My Locations</h2>

        <!-- Create location -->
        <form class="row" @submit.prevent="createLocation">
          <input v-model="newLoc.name" placeholder="Name" required />
          <input v-model="newLoc.city" placeholder="City" required />
          <input v-model.number="newLoc.lat" type="number" step="0.000001" placeholder="Lat" required />
          <input v-model.number="newLoc.lng" type="number" step="0.000001" placeholder="Lng" required />
          <button>Create</button>
        </form>

        <!-- List -->
        <ul class="list">
          <li
            v-for="l in locationsStore.mine"
            :key="l._id"
            :class="{ active: selectedLocId === l._id }"
            @click="selectLocation(l._id)"
          >
            <div class="row-between">
              <div>
                <b>{{ l.name }}</b> <small>({{ l.city }})</small>
              </div>
              <div class="actions">
                <button @click.stop="editLocation(l)">Edit</button>
                <button class="danger" @click.stop="deleteLocation(l)">Delete</button>
              </div>
            </div>
            <small class="muted">id: {{ l._id }}</small>
          </li>
        </ul>
      </section>

      <!-- RIGHT: Scooters for selected location -->
      <section class="card" v-if="selectedLocation">
        <h2>Scooters at: {{ selectedLocation.name }}</h2>

        <!-- Create scooter -->
        <form class="row" @submit.prevent="createScooter">
          <input v-model="newScooter.model" placeholder="Model (e.g. Xiaomi M365)" required />
          <input v-model.number="newScooter.battery" type="number" min="0" max="100" placeholder="Battery %" required />
          <select v-model="newScooter.status">
            <option value="available">available</option>
            <option value="reserved">reserved</option>
            <option value="in_use">in_use</option>
            <option value="maintenance">maintenance</option>
            <option value="offline">offline</option>
          </select>
          <button>Add</button>
        </form>

        <!-- List scooters -->
        <div v-if="scootersStore.items.length === 0" class="muted">No scooters here yet.</div>

        <div v-for="s in scootersStore.items" :key="s._id" class="scooter">
          <div class="row-between">
            <div>
              <b>{{ s.model }}</b> — {{ s.battery }}% <em>({{ s.status }})</em>
            </div>
            <div class="actions">
              <select v-model="s._pendingStatus" @change="updateStatus(s)">
                <option disabled value="">change status…</option>
                <option value="available">available</option>
                <option value="reserved">reserved</option>
                <option value="in_use">in_use</option>
                <option value="maintenance">maintenance</option>
                <option value="offline">offline</option>
              </select>
              <button class="danger" @click="deleteScooter(s)">Delete</button>
            </div>
          </div>
          <small class="muted">id: {{ s._id }}</small>
        </div>
      </section>

      <section class="card empty" v-else>
        <h2>Select a location</h2>
        <p class="muted">Choose one of your locations on the left to manage its scooters.</p>
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { mapStores } from "pinia";
import { useAuth } from "@/stores/auth";
import { useLocations } from "@/stores/locations";
import { useScooters } from "@/stores/scooters";

export default {
  name: "ProviderDashboard",
  computed: {
    ...mapStores(useAuth),
    ...mapStores(useLocations),
    ...mapStores(useScooters),
  },
  setup() {
    const selectedLocId = ref(null);

    const newLoc = ref({ name: "", city: "", lat: null, lng: null });
    const newScooter = ref({ model: "", battery: 100, status: "available" });

    const selectedLocation = computed(() =>
      useLocations().mine.find((l) => l._id === selectedLocId.value)
    );

    async function refreshMine() {
      const locationsStore = useLocations();
      const scootersStore = useScooters();

      await locationsStore.fetchMine();
      // keep selection valid
      if (selectedLocId.value && !selectedLocation.value && locationsStore.mine[0]) {
        selectedLocId.value = locationsStore.mine[0]._id;
      }
      if (selectedLocId.value) {
        await scootersStore.fetchMine({ location: selectedLocId.value });
      }
    }

    onMounted(async () => {
      const auth = useAuth();
      if (!auth.isProvider) return; // guard
      await refreshMine();
      if (!selectedLocId.value && useLocations().mine[0]) {
        selectedLocId.value = useLocations().mine[0]._id;
        await useScooters().fetchMine({ location: selectedLocId.value });
      }
    });

    async function selectLocation(id) {
      selectedLocId.value = id;
      await useScooters().fetchMine({ location: id });
    }

    async function createLocation() {
      const locationsStore = useLocations();
      try {
        const payload = {
          name: newLoc.value.name.trim(),
          city: newLoc.value.city.trim(),
          lat: Number(newLoc.value.lat),
          lng: Number(newLoc.value.lng),
        };
        await locationsStore.create(payload);
        newLoc.value = { name: "", city: "", lat: null, lng: null };
        await refreshMine();
      } catch (e) {
        console.error(e);
        alert("Failed to create location.");
      }
    }

    async function editLocation(l) {
      const locationsStore = useLocations();
      const name = prompt("New name:", l.name) || l.name;
      const city = prompt("New city:", l.city) || l.city;
      try {
        await locationsStore.update(l._id, { name, city });
        await refreshMine();
      } catch (e) {
        console.error(e);
        alert("Failed to update location.");
      }
    }

    async function deleteLocation(l) {
      const locationsStore = useLocations();
      if (!confirm("Delete this location? This will also remove your scooters there.")) return;
      try {
        await locationsStore.remove(l._id);
        if (selectedLocId.value === l._id) {
          selectedLocId.value = null;
          useScooters().items = [];
        }
        await refreshMine();
      } catch (e) {
        console.error(e);
        alert("Failed to delete location.");
      }
    }

    async function createScooter() {
      if (!selectedLocId.value) return;
      const scootersStore = useScooters();
      try {
        const payload = {
          model: newScooter.value.model.trim(),
          battery: Number(newScooter.value.battery),
          status: newScooter.value.status,
          location: selectedLocId.value,
        };
        await scootersStore.create(payload);
        newScooter.value = { model: "", battery: 100, status: "available" };
        await scootersStore.fetchMine({ location: selectedLocId.value });
      } catch (e) {
        console.error(e);
        alert("Failed to create scooter.");
      }
    }

    async function updateStatus(s) {
      const scootersStore = useScooters();
      const next = s._pendingStatus;
      if (!next) return;
      try {
        await scootersStore.update(s._id, { status: next });
        s._pendingStatus = "";
      } catch (e) {
        console.error(e);
        alert("Failed to update status.");
      }
    }

    async function deleteScooter(s) {
      const scootersStore = useScooters();
      if (!confirm("Delete scooter?")) return;
      try {
        await scootersStore.remove(s._id);
        await scootersStore.fetchMine({ location: selectedLocId.value });
      } catch (e) {
        console.error(e);
        alert("Failed to delete scooter.");
      }
    }

    return {
      selectedLocId,
      newLoc,
      newScooter,
      selectedLocation,
      selectLocation,
      createLocation,
      editLocation,
      deleteLocation,
      createScooter,
      updateStatus,
      deleteScooter,
    };
  },
};
</script>

<style>
.provider-dashboard { max-width: 1080px; margin: 24px auto; padding: 0 12px; }
h1 { margin-bottom: 16px; }

.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

.card { border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; }
.card.empty { display:flex; align-items:center; justify-content:center; min-height: 260px; }

.list { list-style: none; padding: 0; margin: 12px 0 0; }
.list li { padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px; cursor: pointer; }
.list li.active { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,.2); }
.list li .actions { display:flex; gap:6px; }

.row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 10px; }
.row-between { display:flex; align-items:center; justify-content:space-between; gap: 10px; }

input, select { width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; }
button { background:#2563eb; color:#fff; border:0; padding:8px 12px; border-radius:6px; cursor:pointer; }
button:hover { background:#1d4ed8; }
button.danger { background:#ef4444; }
button.danger:hover { background:#dc2626; }
.muted { color:#6b7280; font-size: 12px; }

.scooter { border:1px solid #e5e7eb; padding:10px; border-radius:8px; margin:8px 0; }
</style>
