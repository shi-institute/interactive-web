<script>
  import { browser } from '$app/environment';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { capitalize } from '$utils/capitalize';
  import { html } from 'htl';
  import { plotConfigs } from '../[plot]/plotConfigs';
  import GentrificationPlots from '../gentrification/GentrificationPlots.svelte';

  export let data;

  const configs = Object.values(plotConfigs).map((config) =>
    config(
      capitalize(data.neighborhood),
      data.neighborhoodsData.filter(
        ({ neighborhood_name }) =>
          neighborhood_name.toLowerCase() === data.neighborhood.toLowerCase()
      )
    )
  );
</script>

<GentrificationPlots data="{data.gentrificationData}" neighborhood="{data.neighborhood}" />

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
