<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import { html } from 'htl';
  import { getLandcoverStats } from './getLandcoverStats';

  export let width = 640;
  export let height: number | undefined = undefined;

  let showYAxisGap = false;

  let landcoverStats: Awaited<ReturnType<typeof getLandcoverStats>> = [];
  $: getLandcoverStats().then((data) => {
    landcoverStats = data;
  });

  const colors = ['#1a7f45', '#eb2a2c', '#39539f', '#f38236'];

  $: plotOptions = {
    width,
    height,
    title: 'Developed land projections for each IPCC scenario',
    subtitle: 'Upstate South Carolina, 2006-2100',
    caption: html`
      <!-- <b>Figure 1. Projected developed land use in square kilometers for Upstate South Carolina.</b> -->
      Each color represents a different IPCC scenario.
      <b style="color: ${colors[0]}">A1B</b> is the rapid economic growth scenario.
      <b style="color: ${colors[1]}">A2</b> is the regionally oriented (more isolationist) economic
      development scenario. <b style="color: ${colors[2]}">B1</b> is the global environmental
      sustainability scenario. <b style="color: ${colors[3]}">B2</b> is the local environmental
      sustainability scenario.
    `,
    x: {
      label: 'Year',
      // show grid lines for the x-axis
      grid: true,
      // tell plot to only show these ranges (bonus: it also ensures labels do not overlap)
      domain: [2006, 2100],
      // convert the year into a string so there are not commas
      tickFormat: (d: unknown) => `${d}`,
    },
    y: {
      label: 'Developed land (millions of km²)',
      // if `showYAxisGap` is checked, force the domain to start at 0
      // otherwise, allow plot to choose the best y-axis domain
      domain: showYAxisGap ? [0, 2.3] : undefined,
    },

    marks: [
      Plot.crosshairX(landcoverStats, { x: 'year', y: 'millionSqKmDeveloped' }),
      Plot.line(landcoverStats, {
        marker: 'dot',
        x: 'year',
        y: 'millionSqKmDeveloped',
        z: 'scenario', // split each scenario into its own series
        stroke: 'scenario', // use different colors for each scenario
      }),
    ],
    color: {
      legend: true,
      range: colors,
    },
  };

  let div: HTMLDivElement;
  $: {
    div?.firstChild?.remove(); // remove old chart if it exists
    div?.append(Plot.plot(plotOptions));
  }
</script>

<div bind:this={div} role="img" />

<input id="showYAxisGap" type="checkbox" bind:checked={showYAxisGap} />
<label for="showYAxisGap">Show gap between minimum value and y=0 on the y-axis</label>
