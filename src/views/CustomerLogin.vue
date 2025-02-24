<template>
    <div>
      <h1>Customer Login</h1>
      <form @submit.prevent="login">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name:"CustomerLogin",
    methods: {
      login() {
        // Add login logic here
      },
    },
  };
  </script>