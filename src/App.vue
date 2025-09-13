<template>
  <div id="app">
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

    <!-- Only one router-view in the whole app, here -->
    <router-view />
  </div>
</template>


<script>

export default { name: "App" };

</script>

<style>
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
nav .logo { font-size: 1.5rem; font-weight: bold; }
nav .nav-links a { color: white; text-decoration: none; margin-left: 1rem; }
nav .nav-links a:hover { text-decoration: underline; }
</style>
