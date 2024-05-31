<script lang="ts">
  import { browser } from '$app/environment';
  import embeddedFont from '$lib/JetBrains_Mono_Embedded';
  import * as Plot from '@observablehq/plot';

  export let plot: Plot.PlotOptions | ((width: number) => Plot.PlotOptions);
  export let fullWidth = false;

  let clientWidth: number | undefined;
  let div: HTMLDivElement;
  $: {
    if (browser) {
      div?.firstChild?.remove(); // remove old chart if it exists

      const plotOptions = typeof plot === 'function' ? plot(clientWidth || 640) : plot;

      const plotNode = Plot.plot({
        ...plotOptions,
        width: fullWidth ? clientWidth : plotOptions.width || 640,
      });

      const svgNodes = plotNode.querySelectorAll('svg');
      for (const svgNode of svgNodes) {
        const plotStyleNode = svgNode.querySelector('style');
        if (plotStyleNode)
          plotStyleNode.innerHTML += `
/* we must provide an embedded version of the font so that it can load when the svg
   is inserted into a canvas element (this happens when we save the figure to png
   with html2canvas) */
@font-face {
  font-family: 'JetBrains Mono Embedded';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('${embeddedFont}');
}
svg.${svgNode.classList[0]} {
  font-family: 'JetBrains Mono', 'JetBrains Mono Embedded', monospace;
  font-weight: 500;
  font-size: 12px;
}
`;
      }

      div?.append(plotNode);
    }
  }
</script>

<div bind:clientWidth="{clientWidth}">
  <div bind:this="{div}" role="img">
    <div
      style="height: {(typeof plot === 'function' ? plot(clientWidth || 640) : plot).height ||
        300}px;"
    ></div>
  </div>
</div>
