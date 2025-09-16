<template>
  <div class="home">
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapStores } from "pinia";
import { useLocations } from "@/stores/locations";
import { useScooters } from "@/stores/scooters";
import { useAuth } from "@/stores/auth";

export default {
  name: "HomePage",
  computed: {
    ...mapStores(useLocations),
    ...mapStores(useScooters),
    ...mapStores(useAuth),
  },

  async mounted() {
    this.map = new maplibregl.Map({
      container: this.$refs.map,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [13.8496, 44.8666],
      zoom: 13,
    });
    this.map.addControl(new maplibregl.NavigationControl(), "top-right");

    this.map.once("load", async () => {
      // Public locations
      await this.locationsStore.fetchAll();
      // Ensure my (owned) locations are loaded if I'm a provider
      await this.ensureMineLoaded();

      this.renderLocationMarkers();
      this.map.resize();

      // Enable create mode for providers
      if (this.authStore.isProvider) this.enableCreateLocation();
    });

    // Re-render when public locations change
    this._unwatchItems = this.$watch(
      () => this.locationsStore.items,
      () => this.renderLocationMarkers(),
      { deep: true }
    );

    // Re-render when owned locations change (affects which buttons show)
    this._unwatchMine = this.$watch(
      () => this.locationsStore.mine,
      () => this.renderLocationMarkers(),
      { deep: true }
    );

    // When token/role changes (login/logout), refetch "mine" and toggle create mode
    this._unwatchAuth = this.$watch(
      () => [this.authStore.token, this.authStore.user?.role],
      async () => {
        await this.ensureMineLoaded();
        // Toggle create mode
        if (this.map) {
          if (this._createHandler) {
            this.map.off("click", this._createHandler);
          }
          if (this.authStore.isProvider) {
            this.enableCreateLocation();
          } else if (this.map?.getCanvas()) {
            this.map.getCanvas().style.cursor = "";
          }
        }
        this.renderLocationMarkers();
      }
    );
  },

  beforeUnmount() {
    if (this._unwatchItems) this._unwatchItems();
    if (this._unwatchMine) this._unwatchMine();
    if (this._unwatchAuth) this._unwatchAuth();
    if (this.map) {
      if (this._createHandler) this.map.off("click", this._createHandler);
      this.map.remove();
    }
  },

  methods: {
    // Load my locations if I'm a provider
    async ensureMineLoaded() {
      try {
        if (this.authStore.isProvider && typeof this.locationsStore.fetchMine === "function") {
          await this.locationsStore.fetchMine();
        }
      } catch (e) {
        console.warn("fetchMine failed:", e?.response?.data || e.message);
      }
    },

    // Ownership check helper
    isOwnedLocation(locId) {
      if (typeof this.locationsStore.isMine === "function") {
        return this.locationsStore.isMine(locId);
      }
      const mine = this.locationsStore.mine || [];
      const set = new Set(mine.map((l) => l._id));
      return set.has(locId);
    },

    enableCreateLocation() {
      if (this.map?.getCanvas()) this.map.getCanvas().style.cursor = "crosshair";
      // bind with arrow to preserve `this`
      this._createHandler = (e) => this.handleMapClickToCreateLocation(e);
      this.map.on("click", this._createHandler);
    },

    async handleMapClickToCreateLocation(e) {
      // Provider-only
      if (!this.authStore.isProvider) return;

      // Ignore clicks on markers/popups to avoid accidental creates
      const t = e?.originalEvent?.target;
      if (t && (t.closest(".maplibregl-marker") || t.closest(".maplibregl-popup"))) return;

      const proceed = window.confirm("Create a new pickup/dropoff location here?");
      if (!proceed) return;
      const name = prompt("Location name:", "Pula Center") || "Unnamed";
      const city = prompt("City:", "Pula") || "Unknown";
      try {
        await this.locationsStore.create({
          name,
          city,
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        });
        // Ensure "mine" includes the new location
        await this.ensureMineLoaded();
        this.renderLocationMarkers();
      } catch (err) {
        console.error("Create location failed:", err);
        alert("Create location failed: " + (err?.error || err?.message || "Unknown error"));
      }
    },

    renderLocationMarkers() {
      if (!this.map) return;
      if (!this._markers) this._markers = new Map();

      // Clear previous
      this._markers.forEach((m) => m.remove());
      this._markers.clear();

      for (const loc of this.locationsStore.items) {
        const el = document.createElement("div");
        el.style.cssText =
          "width:18px;height:18px;border-radius:50%;border:2px solid #fff;background:#2980b9;box-shadow:0 0 4px rgba(0,0,0,.3)";

        const isMine = this.isOwnedLocation(loc._id);

        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <div style="font-family:system-ui;min-width:260px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div>
                <h3 style="margin:0">${loc.name}</h3>
                <small>${loc.city}</small>
              </div>
              ${
                this.authStore.isProvider && isMine
                  ? `<div style="display:flex;gap:6px">
                       <button data-act="loc-edit" data-id="${loc._id}">Edit</button>
                       <button data-act="loc-delete" data-id="${loc._id}">Delete</button>
                     </div>`
                  : ""
              }
            </div>
            <hr style="margin:8px 0"/>
            <div id="scooters-${loc._id}">Loading scooters...</div>
            ${
              this.authStore.isProvider
                ? `<p style="margin-top:8px;color:#666;font-size:12px">
                     ${
                       isMine
                         ? "You own this location. You can manage scooters here."
                         : "This location belongs to another provider (view-only)."
                     }
                   </p>`
                : ""
            }
          </div>
        `;
        const popup = new maplibregl.Popup({ offset: 12 }).setDOMContent(popupContent);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([loc.lng, loc.lat])
          .setPopup(popup)
          .addTo(this.map);

        // When popup opens, load scooters for this location
        popup.on("open", async () => {
          const container = popupContent.querySelector(`#scooters-${loc._id}`);
          try {
            await this.scootersStore.fetchAll({ location: loc._id });
            const scooters = this.scootersStore.items.filter(
              (s) => s.location?._id === loc._id
            );

            if (!scooters.length) {
              container.innerHTML = "<p>No scooters here.</p>";
            } else {
              container.innerHTML = scooters
                .map(
                  (s) => `
                  <div style="border:1px solid #ddd;padding:6px;margin:6px 0;border-radius:4px">
                    <b>${s.model}</b> — ${s.battery}% <em>(${s.status})</em>
                    ${
                      this.authStore.isProvider && isMine
                        ? `<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                             <button data-act="status" data-id="${s._id}" data-value="available">Available</button>
                             <button data-act="status" data-id="${s._id}" data-value="reserved">Reserved</button>
                             <button data-act="status" data-id="${s._id}" data-value="in_use">In use</button>
                             <button data-act="status" data-id="${s._id}" data-value="maintenance">Maint.</button>
                             <button data-act="delete" data-id="${s._id}">Delete</button>
                           </div>`
                        : ""
                    }
                  </div>`
                )
                .join("");
            }

            // Provider: add scooter only if I own this location
            if (this.authStore.isProvider && isMine) {
              container.innerHTML += `
                <div style="margin-top:8px"><button data-act="add">+ Add Scooter</button></div>
              `;
            }

            // Attach actions (guarded by isMine)
            if (this.authStore.isProvider) {
              popupContent.addEventListener(
                "click",
                async (ev) => {
                  const btn = ev.target.closest("button");
                  if (!btn) return;
                  const act = btn.dataset.act;
                  const id = btn.dataset.id;

                  try {
                    // --- Location actions (owned only) ---
                    if (act === "loc-edit") {
                      if (!isMine) return;
                      const newName = prompt("New location name:", loc.name) || loc.name;
                      const newCity = prompt("New city:", loc.city) || loc.city;
                      await this.locationsStore.update(loc._id, { name: newName, city: newCity });
                      // refresh lists
                      await this.locationsStore.fetchAll();
                      await this.ensureMineLoaded();
                      // refresh popup
                      popup.setDOMContent(popupContent);
                      popup.fire?.("open");
                    }

                    if (act === "loc-delete") {
                      if (!isMine) return;
                      if (!confirm("Delete this location? This will also remove its scooters.")) return;
                      await this.locationsStore.remove(loc._id);
                      // remove marker from map
                      marker.remove();
                      this._markers.delete(loc._id);
                      return; // popup gone
                    }

                    // --- Scooter actions (owned location only) ---
                    if (act === "delete") {
                      if (!isMine) return;
                      if (!confirm("Delete scooter?")) return;
                      await this.scootersStore.remove(id);
                      popup.setDOMContent(popupContent);
                      popup.fire?.("open");
                    }

                    if (act === "status") {
                      if (!isMine) return;
                      await this.scootersStore.update(id, { status: btn.dataset.value });
                      popup.setDOMContent(popupContent);
                      popup.fire?.("open");
                    }

                    if (act === "add") {
                      if (!isMine) return;
                      const model = prompt("Model:", "Xiaomi M365") || "Unknown";
                      const battery = Number(prompt("Battery %:", "100") || 100);
                      await this.scootersStore.create({
                        model, battery, status: "available", location: loc._id
                      });
                      popup.setDOMContent(popupContent);
                      popup.fire?.("open");
                    }
                  } catch (err) {
                    console.error("Action failed:", err);
                    alert("Action failed: " + (err?.error || err?.message || "Unknown error"));
                  }
                },
                { once: true } // reattach on reopen
              );
            }
          } catch (err) {
            container.innerHTML = `<p style="color:red">Failed to load scooters.</p>`;
          }
        });

        this._markers.set(loc._id, marker);
      }
    },
  },
};
</script>

<style>
.home { height: 100%; }   /* fills .page from App.vue */
.map  { width: 100%; height: 100%; }
</style>
