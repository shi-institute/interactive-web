<script lang="ts">
  import { browser } from '$app/environment';
  import * as Plot from '@observablehq/plot';

  export let plot: Plot.PlotOptions;
  export let fullWidth = false;

  let clientWidth: number | undefined;
  let div: HTMLDivElement;
  $: {
    if (browser) {
      div?.firstChild?.remove(); // remove old chart if it exists
      div?.append(Plot.plot({ ...plot, width: fullWidth ? clientWidth : plot.width || 640 }));
    }
  }
</script>

<div bind:clientWidth="{clientWidth}">
  <div bind:this="{div}" role="img"><div style="height: {plot.height || 300}px;"></div></div>
</div>
