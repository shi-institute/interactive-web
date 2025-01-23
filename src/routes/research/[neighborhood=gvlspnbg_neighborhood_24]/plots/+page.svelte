<script lang="ts">
  import { page } from '$app/stores';
  import PageTitle from '$lib/PageTitle.svelte';
  import { Button } from 'fluent-svelte';
  import { plotConfigs } from './[plot]/plotConfigs';

  export let data;

  const autoPlots = Object.entries(plotConfigs)
    .map(([key, config]) => [config('', []).title || key, key] as const)
    .map(([title, key]) => [`${title}`, key] as const);

  const manualPlots = [['Gentrification plots', 'gentrification']] as const;

  const plots = [...autoPlots, ...manualPlots];
</script>

<PageTitle>
  Index of plots
  <svelte:fragment slot="caption">{data.neighborhood} neighborhood</svelte:fragment>
</PageTitle>

<ul>
  {#each plots.sort(([a], [b]) => a.localeCompare(b)) as [title, key]}
    <li><a href="/research/{$page.params.neighborhood}/plots/{key}">{title}</a></li>
  {/each}
</ul>

<Button style="margin: 0 20px;" href="/research/{$page.params.neighborhood}/plots/all">
  View all plots
</Button>
