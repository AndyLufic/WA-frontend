<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapStores } from 'pinia';
import { useScooters } from '@/stores/scooters';

mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;

export default {
  name: 'ScooterMap',
  computed: { ...mapStores(useScooters) },

  mounted() {
    console.log('ScooterMap mounted');

    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [13.848, 44.868],
      zoom: 12
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    // Wait for full load before wiring handlers
    this.map.once('load', () => {
      console.log('Map loaded');

      // fetch scooters then render
      this.scootersStore.fetchAll();

      // show crosshair to indicate click-to-add
      this.map.getCanvas().style.cursor = 'crosshair';

      // CLICK handler
      this.map.on('click', async (e) => {
        console.log('MAP CLICK', e.lngLat);

        const proceed = window.confirm('Add a scooter here?');
        if (!proceed) return;

        const payload = {
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          model: 'Test',
          city: 'Pula',
          battery: 100,
          status: 'available'
        };

        try {
          const created = await this.scootersStore.create(payload);
          console.log('CREATED', created);
          this.renderMarkers();
        } catch (err) {
          console.error('CREATE FAILED', err);
          alert('Create failed: ' + (err?.response?.data?.error || err.message));
        }
      });

      // initial render
      this.$nextTick(() => this.renderMarkers());
    });
  },

  beforeUnmount() {
    if (this.map) this.map.remove();
  },

  watch: {
    'scootersStore.items': {
      deep: true,
      handler() { this.renderMarkers(); }
    }
  },

  methods: {
    renderMarkers() {
      if (!this.map) return;
      if (!this._markers) this._markers = new Map();

      // clear old
      this._markers.forEach(m => m.remove());
      this._markers.clear();

      for (const s of this.scootersStore.items) {
        const el = document.createElement('div');
        el.style.cssText =
          'width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,.1);background:' +
          this.colorByStatus(s.status);
        const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(this.popupHTML(s));
        const m = new mapboxgl.Marker(el).setLngLat([s.lng, s.lat]).setPopup(popup).addTo(this.map);
        this._markers.set(s.id, m);
      }
    },
    colorByStatus(status) {
      return { available:'#2ecc71', reserved:'#f1c40f', in_use:'#e67e22', maintenance:'#e74c3c', offline:'#7f8c8d' }[status] || '#3498db';
    },
    popupHTML(s) {
      return `
        <div data-id="${s.id}" style="font-family: system-ui; min-width: 220px">
          <strong>${s.model}</strong><br/><small>${s.city}</small>
          <div>Battery: ${s.battery}%</div>
          <div>Status: ${s.status}</div>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
            <button data-act="status" data-value="available">Available</button>
            <button data-act="status" data-value="reserved">Reserved</button>
            <button data-act="status" data-value="in_use">In use</button>
            <button data-act="status" data-value="maintenance">Maint.</button>
            <button data-act="delete">Delete</button>
          </div>
        </div>`;
    }
  }
};
</script>

<template>
  <div ref="mapContainer" style="height:100vh;width:100%"></div>
</template>

<!-- Leave this empty; we're using options API above -->
<script setup></script>
