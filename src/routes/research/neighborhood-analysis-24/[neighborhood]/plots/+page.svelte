<script lang="ts">
  import { page } from '$app/stores';
  import PageTitle from '$lib/PageTitle.svelte';
  import { capitalize } from '$utils/capitalize';
  import { Button } from 'fluent-svelte';
  import { getPlotsList } from '../../getPlotsList';

  export let data;

  const { tractPlots: autoPlots, blockPlots: autoBlockPlots } = getPlotsList($page.url);
  const manualPlots = [['Gentrification plots', 'gentrification']] as const;
  const plots = [...autoPlots, ...(data.neighborhood ? autoBlockPlots : []), ...manualPlots];
</script>

<PageTitle>
  Index of plots
  <svelte:fragment slot="caption">
    {#if data.neighborhood}
      {data.neighborhood} neighborhood
    {:else}
      Tract {data.tract}
    {/if}
  </svelte:fragment>
</PageTitle>

<ul>
  {#each plots.sort(([a], [b]) => a.localeCompare(b)) as [title, key]}
    <li>
      <a href="/research/neighborhood-analysis-24/{$page.params.neighborhood}/plots/{key}">
        {title}
      </a>
    </li>
  {/each}
</ul>

<div class="button-row">
  <Button href="/research/neighborhood-analysis-24/{$page.params.neighborhood}/plots/all">
    View all plots
  </Button>

  <Button
    href="/research/neighborhood-analysis-24/compare?neighborhoods={encodeURIComponent(
      capitalize($page.params.neighborhood)
    )}&title={encodeURIComponent('Custom collection')}&subtitle={encodeURIComponent(
      `${capitalize($page.params.neighborhood)} neighborhood`
    )}&wizard=true"
  >
    Build a collection
  </Button>
</div>

<style>
  .button-row {
    display: flex;
    flex-direction: row;
    gap: 6px;
    margin: 0 20px;
    padding-bottom: 20px;
  }
</style>
