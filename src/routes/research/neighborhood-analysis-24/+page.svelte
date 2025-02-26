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

<style>
  section {
    padding: 0 10px;
  }
  span.public {
    font-size: 10px;
  }
</style>
