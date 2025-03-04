<script lang="ts">
  import { page } from '$app/stores';
  import PageTitle from '$lib/PageTitle.svelte';
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

<Button
  style="margin: 0 20px;"
  href="/research/neighborhood-analysis-24/{$page.params.neighborhood}/plots/all"
>
  View all plots
</Button>
