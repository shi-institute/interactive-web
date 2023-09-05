<header>
  <nav>
    <ul>
      <a href="https://www.furman.edu/shi-institute/sustainability-research/">Shi Applied Research</a>
      <a href="/">All Visualizations</a>
      <a href="/">Sitemap</a>
    </ul>
  </nav>
  <div class="title">
    
  </div>
  <div class="meta"></div>
</header>

<main>
  <slot />
</main>

<style>
  header {
    --height: 30px;
    background-color: black;
    color: #e0e0e0;
    height: var(--height);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px 0 0;
    font-size: 13px;
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


</style>