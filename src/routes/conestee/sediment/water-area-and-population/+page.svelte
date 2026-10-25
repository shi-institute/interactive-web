<script lang="ts">
  import { browser } from '$app/environment';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { colors, vibrantText } from '$lib/colors.js';
  import { downloadElement } from '$utils/downloadElement.js';
  import * as Plot from '@observablehq/plot';
  import { Button, ProgressRing } from 'fluent-svelte';

  export let data;

  const populationLabel = 'Estimated watershed population';
  const acresLabel = 'Open water area (acres)';

  // the population (left) axis is the primary y scale;
  // acres (right axis) are linearly mapped onto it
  const populationDomain = [0, 400_000];
  const acresDomain = [12, 130];
  const acresToY = (acres: number) =>
    populationDomain[0] +
    ((acres - acresDomain[0]) / (acresDomain[1] - acresDomain[0])) *
      (populationDomain[1] - populationDomain[0]);
  const yToAcres = (y: number) =>
    acresDomain[0] +
    ((y - populationDomain[0]) / (populationDomain[1] - populationDomain[0])) *
      (acresDomain[1] - acresDomain[0]);

  const populationTicks = Array.from({ length: 9 }, (_, i) => i * 50_000);
  const acresTicks = [12, 20, 40, 60, 80, 100, 120, 130];

  let exportElem: HTMLElement;
  let exporting = false;
  let plotClientWidth = 0;

  // when embedded, the plot (including its title and legend) fills the window
  // height that is not used by the plot padding (20px top and bottom) and embed bar
  let innerHeight = 0;
  let embedBarHeight = 0;
  $: embeddedHeight = Math.max(240, innerHeight - 40 - embedBarHeight);

  function download() {
    exporting = true;
    downloadElement(exportElem, plotClientWidth - 20, 'Conestee_Water_Area_and_Population').finally(
      () => (exporting = false)
    );
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://use.typekit.net/izw5ghp.css" />
</svelte:head>

<svelte:window bind:innerHeight="{innerHeight}" />

<div
  class="plot"
  bind:this="{exportElem}"
  class:exporting="{exporting}"
  class:embedded="{data.isEmbedded}"
  bind:clientWidth="{plotClientWidth}"
>
  {#if browser}
    <PlotContainer
      fullWidth
      boxSizing="{data.isEmbedded ? 'border-box' : 'content-box'}"
      plot="{(width) => ({
        title: 'Open water area and watershed population',
        subtitle: 'Lake Conestee, 1892–2026',
        marginTop: 30,
        marginRight: 32,
        marginBottom: 40,
        marginLeft: 59,
        x: { label: 'Year', tickFormat: 'd' },
        y: { domain: populationDomain, axis: null },
        color: {
          legend: true,
          domain: [populationLabel, acresLabel],
          range: [colors.vibrant.teal, colors.vibrant.maroon],
        },
        height: data.isEmbedded ? embeddedHeight : 420,
        marks: [
          Plot.gridY(populationTicks),
          Plot.axisY(populationTicks, {
            anchor: 'left',
            tickFormat: (d) => d.toLocaleString('en-US'),
            // the full axis labels collide at the top of the plot on narrow screens
            label: width < 480 ? '↑ Population' : `↑ ${populationLabel}`,
            labelAnchor: 'top',
            color: $vibrantText.teal,
          }),
          Plot.axisY(acresTicks.map(acresToY), {
            anchor: 'right',
            tickFormat: (d) => Math.round(yToAcres(d)),
            label: width < 480 ? 'Acres ↑' : `${acresLabel} ↑`,
            labelAnchor: 'top',
            color: $vibrantText.maroon,
          }),
          Plot.ruleY([0]),
          Plot.lineY(data.tidy, {
            x: 'year',
            y: 'watershedPopulation',
            stroke: () => populationLabel,
            strokeWidth: 2,
          }),
          Plot.dot(data.tidy, {
            x: 'year',
            y: 'watershedPopulation',
            fill: () => populationLabel,
            r: 3,
            channels: { Year: 'year', Population: 'watershedPopulation' },
            tip: { format: { x: false, y: false, fill: false, Year: 'd', Population: ',' } },
          }),
          Plot.lineY(data.tidy, {
            x: 'year',
            y: (d) => acresToY(d.openWaterAcres),
            stroke: () => acresLabel,
            strokeWidth: 2,
          }),
          Plot.dot(data.tidy, {
            x: 'year',
            y: (d) => acresToY(d.openWaterAcres),
            fill: () => acresLabel,
            r: 3,
            // the y channel is remapped onto the population scale, so show the original acres
            channels: { Year: 'year', 'Open water area': 'openWaterAcres' },
            tip: {
              format: {
                x: false,
                y: false,
                fill: false,
                Year: 'd',
                'Open water area': (d) => `${d.toFixed(1)} acres`,
              },
            },
          }),
        ],
      })}"
    />
  {/if}
</div>

{#if !data.isEmbedded}
  <div class="controls">
    <Button on:click="{download}" style="width: 166px; height: 32px; margin: 8px 0;">
      {#if exporting}
        <ProgressRing style="--fds-accent-default: currentColor;" size="{16}" />
      {:else}
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="margin: 0 12px 0 0;"
        >
          <path
            d="M18.25 20.5a.75.75 0 1 1 0 1.5l-13 .004a.75.75 0 1 1 0-1.5l13-.004ZM11.648 2.012l.102-.007a.75.75 0 0 1 .743.648l.007.102-.001 13.685 3.722-3.72a.75.75 0 0 1 .976-.073l.085.073a.75.75 0 0 1 .072.976l-.073.084-4.997 4.997a.75.75 0 0 1-.976.073l-.085-.073-5.003-4.996a.75.75 0 0 1 .976-1.134l.084.072 3.719 3.714L11 2.755a.75.75 0 0 1 .648-.743l.102-.007-.102.007Z"
            fill="currentColor"
          ></path>
        </svg>
        Download as PNG
      {/if}
    </Button>
  </div>
{/if}

{#if data.isEmbedded}
  <EmbedBar bind:clientHeight="{embedBarHeight}" />
{/if}

<style>
  .plot,
  .controls {
    padding: 20px;
  }
  .controls {
    padding-top: 0;
  }
  .plot {
    min-height: 530px;
  }
  .plot.embedded {
    min-height: unset;
  }
  .plot :global(figure > h2),
  .plot :global(figure > h3),
  .plot :global(figure > span > h3),
  .plot :global(figcaption) {
    font-family: greycliff-cf, sans-serif;
  }
  .plot :global(figure > h2) {
    margin-bottom: 4px !important;
  }
  .plot.exporting :global(figure > h2) {
    font-size: 23px !important;
  }
</style>
