<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav>
      <div class="logo">Scooter Rental</div>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/customer-login">Customer Login</router-link>
        <router-link to="/provider-login">Provider Login</router-link>
        <router-link to="/sign-up">Sign Up</router-link> <!-- Add Sign Up link -->
      </div>
    </nav>

    <!-- Router View -->
     <!-- Ensure this is present -->
   <router-view/>
  </div>
</template>

<!-- <script>
import { useRouter } from 'vue-router';
export default{
  setup(){


  }  

}
</script> -->

<!--<style>
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
  flex-grow: 1; /* Takes up remaining space */
  width: 100%;
  height: 100%;
}
</style> --> 