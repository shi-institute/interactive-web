<script lang="ts">
  import { page } from '$app/stores';
  import PageTitle from '$lib/PageTitle.svelte';
  import { Button } from 'fluent-svelte';
  import { blockPlotConfigs, plotConfigs } from '../../plotConfigs';

  export let data;

  const autoPlots = Object.entries(plotConfigs)
    .map(([key, config]) => [config('', [], $page.url).title || key, key] as const)
    .map(([title, key]) => [`${title}`, key] as const);

  const autoBlockPlots = Object.entries(blockPlotConfigs)
    .map(([key, config]) => [config('', [], $page.url).title || key, key] as const)
    .flatMap(([title, key]) => {
      if (key === 'population_pyramid') {
        return [
          [`${title} (2020)`, `${key}?year=2020`],
          [`${title} (2010)`, `${key}?year=2010`],
          [`${title} (2000)`, `${key}?year=2000`],
        ] as const;
      } else {
        return [[title, key] as const];
      }
    })
    .map(([title, key]) => [`${title} [decennial]`, `decennial‾‾${key}`] as const);

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
