<script lang="ts">
  import { browser } from '$app/environment';
  import { notEmpty } from '$utils/notEmpty';
  import GentrificationPlots from '../GentrificationPlots.svelte';

  export let data;

  const groupedData = Object.values(Object.groupBy(data.gentrificationData, (d) => d.Tract))
    .filter(notEmpty)
    .filter((series) => series.length > 10)
    .filter((series) => series[0].Tract.toString().slice(2, 5) === data.county);
</script>

{#if groupedData.length === 0}
  <p>No data available</p>
{:else if browser}
  {#each groupedData as gentrificationData}
    <GentrificationPlots data="{gentrificationData}" />
  {/each}
{:else}
  <aside>
    <div><b>Please wait...</b></div>
    <i>This may take a while.</i>
  </aside>
{/if}

<style>
  aside {
    padding: 10px;
  }
</style>
