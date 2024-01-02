<script lang="ts">
  import 'fluent-svelte/theme.css';
  import 'leaflet/dist/leaflet.css';
</script>

<header>
  <nav>
    <ul>
      <a href="https://www.furman.edu/shi-institute/sustainability-research/">
        Shi Applied Research
      </a>
      <a href="/">All Visualizations</a>
      <a href="/sitemap">Sitemap</a>
    </ul>
  </nav>
  <div class="title"></div>
  <div class="meta"></div>
</header>

<main>
  <slot />
</main>

<style>
  header {
    --height: var(--header-height);
    background-color: black;
    color: #e0e0e0;
    height: var(--height);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px 0 0;
    font-size: 13px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  ul {
    height: var(--height);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  nav a {
    height: var(--height);
    display: inline-flex;
    align-items: center;
    color: #e0e0e0;
    text-decoration: none;
    padding: 0 10px;
  }
  nav a:hover {
    background-color: rgba(255, 255, 255, 0.18);
  }
  nav a:active {
    background-color: rgba(255, 255, 255, 0.26);
  }

  main {
    flex-grow: 1;
  }
  :global(:root) {
    --fds-accent-dark-1: 260, 70%, 48%;
  }
  @media (prefers-color-scheme: dark) {
    main {
      background-color: #212121;
      color: #e0e0e0;
    }
    :global(a) {
      color: rgb(160, 178, 238);
    }
    :global(a:visited) {
      color: rgb(190, 160, 238);
    }
    :global(:root) {
      --fds-accent-light-2: 260, 70%, 78%;
    }
  }
</style>
