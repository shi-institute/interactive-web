<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';

  export let data;
</script>

<PageTitle>Neighborhoods and tracts</PageTitle>

<section>
  <h2>Neighborhoods</h2>
  <ul>
    {#each data.routes.filter(({ type }) => type === 'neighborhood') as { id, url, locked }}
      <li>
        <a href="{url}">{id}</a>
        {#if !locked}
          <span class="public">🟣</span>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<section>
  <h2>Tracts</h2>
  <ul>
    {#each data.routes.filter(({ type }) => type === 'tract') as { id, url, locked }}
      <li>
        <a href="{url}">{id}</a>
        {#if !locked}
          <span class="public">🟣</span>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<section>
  <h2>More</h2>
  <ul>
    <li>
      <a href="/research/neighborhood-analysis-24/all-gentrification-plots?county=045">
        All gentrification plots - Greenville County
      </a>
    </li>
    <li>
      <a href="/research/neighborhood-analysis-24/all-gentrification-plots?county=083">
        All gentrification plots - Spartanburg County
      </a>
    </li>
    <li>
      <a href="/research/neighborhood-analysis-24/compare?wizard=true">Build a collection</a>
      <span class="public">🟣</span>
    </li>
  </ul>
</section>

<style>
  section {
    padding: 0 10px;
  }
  span.public {
    font-size: 10px;
  }
</style>
