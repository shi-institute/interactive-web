<script lang="ts">
  import PlotContainer from '$lib/PlotContainer.svelte';
  import * as Plot from '@observablehq/plot';

  export let data: { year: number; data: number; Type: string }[];
  export let maxWidth: number = 0;
  export let disableTip: boolean = false;
  export let height = 300;

  let maxUSD = data.reduce((acc, { data }) => Math.max(acc, data), 0);
</script>

<div class="plot-container" style="--maxWidth: {maxWidth ? `${maxWidth}px` : '100%'};">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      height,
      color: { legend: true },
      x: { type: 'linear', label: 'Year', tickFormat: 'd' },
      y: {
        type: 'linear',
        label: `US Dollars (inflation-adjusted to 2020)`,
        tickFormat: 's',
        domain: [0, maxUSD],
      },
      marginTop: 30,
      marginRight: 14,
      marginBottom: 40,
      marginLeft: 40,
      marks: [
        Plot.lineY(data, {
          x: 'year',
          y: 'data',
          stroke: 'Type',
          tip: disableTip ? undefined : { format: { x: 'd', y: '$,.0f' } },
        }),
      ],
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">House value and income over time</h2>
  </PlotContainer>
</div>

<style>
  .plot-container {
    box-sizing: border-box;
    border: 1px solid var(--calcite-color-border-1);
    padding: 8px;
    max-width: var(--maxWidth);
  }
  .plot-container :global(svg[class^='plot-']) {
    background-color: var(--calcite-color-foreground-1);
  }
</style>
