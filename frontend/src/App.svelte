<script lang="ts">
  import svelteLogo from './assets/svelte.svg';
  import { client } from './lib/client';

  client.greeting.query().then((r) => console.log('trpc result', r));

  let loggedInUser: string = null;
  let error: string = null;

  function login(username: string, password: string) {
    error = null;
    client.auth.login
      .mutate({
        username,
        password
      })
      .then(() => (loggedInUser = username))
      .catch((err) => (error = `Failed to login ${username}: ${err.message}`));
  }

  function logout() {
    error = null;
    client.auth.logout
      .query()
      .then(() => (loggedInUser = null))
      .catch((err) => (error = `Failed to logout: ${err.message}`));
  }
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <button on:click={() => login('demo', '***')}>Login</button>
  <button on:click={() => login('Albert', '***')}>Login False</button>
  <button on:click={logout}>Logout</button>
  <br />
  <br />
  {#if loggedInUser}
    <div style="color: green;">Logged in as "{loggedInUser}"</div>
  {/if}
  {#if error}
    <div style="color: red;">{error}</div>
  {/if}
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
