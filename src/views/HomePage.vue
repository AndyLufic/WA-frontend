<template>
    <div class="home" >
      <!-- Navigation Bar -->
      <nav>
        
        
      </nav>
     
      <!-- Router View -->
      <router-view/> <!-- Ensure this is present --> 
      <div id="map"></div>
    </div>
  </template>
  


  <script>
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  
  export default {
    data() {
      return {
        map: null,
        scooterSpots: [
          { lng: 13.8496, lat: 44.8666, name: 'Pula Center', available: 5 }, // Pula coordinates
          { lng: 13.853, lat: 44.87, name: 'Pula Harbor', available: 3 }, // Another spot in Pula
        ],
      };
    },
    mounted() {
      console.log("Mounted Hook Triggered"); // Debugging Log
      this.initMap();
    },
    methods: {
      initMap() {
        // Set your Mapbox access token
        mapboxgl.accessToken = process.env.MAP_TOKEN; // proces koji skriva osjetljve infomacije 
  
        // Initialize the map
        this.map = new mapboxgl.Map({
          container: 'map', // Container ID
          style: 'mapbox://styles/mapbox/streets-v11', // Map style
          center: [13.8496, 44.8666], // Pula, Croatia coordinates
          zoom: 13, // Adjust zoom level as needed
        });
  
        // Add markers for scooter spots
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
  
      },
    },
  };
  </script>
  
  <style>
  /* Global Styles */
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: Arial, sans-serif;
  }
  
  /* App Container */
  #app {
    height: 100vh; /* Full viewport height */
    display: flex;
    flex-direction: column;
  }
  
  /* Navigation Bar */
  nav {
    width: 100%;
    background-color: #333;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
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
  
  
  .hero h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .hero p {
    font-size: 1.2rem;
    color: #ddd;
  }
  
  /* Fullscreen Map */
  #map {
  position: absolute;
  top: 60px; 
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100vh - 60px); 
}
  </style>