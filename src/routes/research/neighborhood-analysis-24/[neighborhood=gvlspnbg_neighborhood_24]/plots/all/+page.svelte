<script>
  import { browser } from '$app/environment';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { html } from 'htl';
  import GentrificationPlots from '../../../GentrificationPlots.svelte';
  import { plotConfigs } from '../../../plotConfigs';

  export let data;

  const configs = Object.values(plotConfigs).map((config) => {
    if (data.neighborhood) {
      return config(
        data.neighborhood,
        data.neighborhoodsData.filter(
          ({ neighborhood_name }) =>
            neighborhood_name.toLowerCase() === data.neighborhood.toLowerCase()
        )
      );
    } else if (data.tract_name) {
      return config(
        data.tract_name,
        data.tractsData.filter(({ tract_id }) => tract_id === data.tract)
      );
    }
  });
</script>

{#if data.neighborhoodGentrificationData}
  <GentrificationPlots data="{data.neighborhoodGentrificationData}" />
{:else}
  <GentrificationPlots data="{data.tractGentrificationData}" />
{/if}

{#each configs as plot}
  <div>
    <PlotContainer
      fullWidth
      enablePopup
      plot="{{
        ...plot,
        caption: plot.caption
          ? browser
            ? html({ raw: [plot.caption] })
            : plot.caption
          : undefined,
      }}"
    />
  </div>
{/each}

<style>
  div {
    border: 1px solid #80808040;
    padding: 20px;
    margin: 20px;
  }
</style>
