<template>
  <div class="home">
    <!-- Navigation Bar -->
    <nav>
      <div class="nav-container">
        <div class="logo">Scooter Rental</div>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/customer-login">Customer Login</router-link>
          <router-link to="/provider-login">Provider Login</router-link>
          <router-link to="/sign-up">Sign Up</router-link>
        </div>
      </div>
    </nav>

    <!-- Map Container -->
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default {
  name: "HomePage",
  data() {
    return {
      map: null,
      scooterSpots: [
        { lng: 13.8496, lat: 44.8666, name: "Pula Center", available: 5 },
        { lng: 13.853, lat: 44.87, name: "Pula Harbor", available: 3 },
      ],
    };
  },
  mounted() {
    console.log("Mounted Hook Triggered");
    this.initMap();
  },
  methods: {
    initMap() {
      // ✅ Vue CLI uses process.env.VUE_APP_...
      mapboxgl.accessToken = process.env.VUE_APP_MAP_TOKEN;
      console.log("Mapbox token:", process.env.VUE_APP_MAP_TOKEN);


      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [13.8496, 44.8666], // Pula, Croatia
        zoom: 13,
      });

      // ✅ Add markers after map is fully loaded
      this.map.on("load", () => {
        this.scooterSpots.forEach((spot) => {
          new mapboxgl.Marker()
            .setLngLat([spot.lng, spot.lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <h3>${spot.name}</h3>
                <p>${spot.available} scooters available</p>
              `)
            )
            .addTo(this.map);
        });
      });
    },
  },
};
</script>

<style>
/* Global Styles */
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: Arial, sans-serif;
}

/* App Container */
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation Bar */
nav {
  width: 100%;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

nav .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

nav .nav-links a {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
}

nav .nav-links a:hover {
  text-decoration: underline;
}

/* Map Container */
#map {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100vh - 60px
  );
}
</style>
