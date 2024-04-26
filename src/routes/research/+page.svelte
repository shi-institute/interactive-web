<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import { listOxford } from '$utils';

  export let data;
</script>

<svelte:head>
  <title>All visualizations</title>
</svelte:head>

<PageTitle>
  All visualizations
  <svelte:fragment slot="caption">
    Applied Sustainability Research, The Shi Insititute for Sustainable Communities, Furman
    University
  </svelte:fragment>
</PageTitle>

<section class="cards">
  {#each data.visualizations as vizInfo}
    <article class="card">
      <a href="/research{vizInfo.href}">
        <img src="{vizInfo.backgroundHref}" alt="" />
      </a>
      <div class="meta">
        <a href="/research{vizInfo.href}">
          <h1>
            {vizInfo.label}
            {#if vizInfo.date}
              <span class="year">{vizInfo.date.getUTCFullYear()}</span>
            {/if}
          </h1>
        </a>
        {#if vizInfo.authors && vizInfo.authors.length > 0}
          <p class="byline">
            By {listOxford(vizInfo.authors)}
          </p>
        {/if}

        {#if vizInfo.caption}
          <p class="caption">{vizInfo.caption}</p>
        {/if}
      </div>
    </article>
  {/each}
</section>

<style>
  section.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, 400px));
    gap: 10px;
    padding: 20px;
  }

  article.card {
    border: 1px solid #ccc;
    min-height: 180px;

    display: flex;
    flex-direction: column;
  }
  @media (prefers-color-scheme: dark) {
    article.card {
      border-color: #3d3d3d;
    }
  }

  .card img {
    aspect-ratio: 2.4;
    object-fit: cover;
    object-position: center;
    width: 100%;
  }

  .card .meta {
    padding: 10px;
  }

  .card h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    margin-top: auto;
  }
  .card h1:hover {
    text-decoration: underline;
  }

  .card a {
    display: contents;
    color: inherit;
  }

  .card .caption {
    margin: 10px 0 0 0;
    font-size: 15px;
    opacity: 0.9;
  }

  .card .year {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.8;
  }

  .card .byline {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
</style>
