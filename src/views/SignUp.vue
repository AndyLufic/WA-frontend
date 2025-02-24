<template>
  <div class="signup">
    <h1>Sign Up</h1>
    <form @submit.prevent="signUp">
      <input type="text" placeholder="Full Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <input type="password" placeholder="Confirm Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p>
      Already have an account?
      <router-link to="/customer-login">Log in here</router-link>.
    </p>
  </div>
</template>

<script>
export default {
  name:"SignUp",
  methods: {
    signUp() {
      // Add sign-up logic here
      alert('Sign up successful!');
    },
  },
};
</script>

<style scoped>
.signup {
  text-align: center;
  margin-top: 2rem;
}

input {
  display: block;
  margin: 0.5rem auto;
  padding: 0.5rem;
  width: 200px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #369f6e;
}

p {
  margin-top: 1rem;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>