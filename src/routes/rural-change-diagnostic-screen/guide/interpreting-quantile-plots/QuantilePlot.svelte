<script lang="ts">
  import PlotContainer from '$lib/PlotContainer.svelte';
  import * as Plot from '@observablehq/plot';

  export let data: { year: number; data: number; Type: string }[];
  export let maxWidth: number = 0;
  export let disableTip: boolean = false;
  export let height = 300;
  export let useGenericTime = false
</script>

<div class="plot-container" style="--maxWidth: {maxWidth ? `${maxWidth}px` : '100%'};">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      height,
      color: { legend: true },
      x: { type: 'linear', label: useGenericTime ? 'Time' : 'Year', tickFormat: 'd', ticks: useGenericTime ? [] : undefined },
      y: { type: 'linear', domain: [0, 1], label: 'Quantile', tickFormat: '.0%' },
      marginTop: 30,
      marginRight: 14,
      marginBottom: useGenericTime ? 10 : 40,
      marks: [
        Plot.lineY(data, {
          x: 'year',
          y: 'data',
          stroke: 'Type',
          tip: disableTip ? undefined : { format: { x: 'd', y: '.0%' } },
        }),
      ],
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">House value and income quantiles over time</h2>
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
