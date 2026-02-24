<script lang="ts">
  import { browser } from '$app/environment';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { colors } from '$lib/colors.js';
  import { downloadElement } from '$utils/downloadElement.js';
  import * as Plot from '@observablehq/plot';
  import { Button, ProgressRing } from 'fluent-svelte';
  import { html } from 'htl';

  export let data;
  $: figureData = data.tidy
    .filter((d) => d.type === 'Above $75,000')
    .map((d) => ({
      ...d,
      municipality: d.municipality.replaceAll(' ', ' '),
    }));

  let exportElem: HTMLElement;
  let exporting = false;
  let width = 640;
  function download() {
    exporting = true;
    downloadElement(exportElem, width + 20, 'Percent_Black_Households_75k_Income').finally(
      () => (exporting = false)
    );
  }
</script>

<div class="plot" bind:this="{exportElem}" class:exporting="{exporting}">
  {#if browser}
    <PlotContainer
      plot="{{
        title: 'Percentage of Black households that earn over $75k',
        subtitle: 'In 2022',
        // prettier-ignore
        caption: html`<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
        marginTop: 8,
        marginRight: 0,
        marginBottom: 40,
        marginLeft: 36,
        x: { label: 'Municipality' },
        y: { label: '', labelArrow: 'none', domain: [0, 1], tickFormat: '.0%', grid: true },
        width,
        height: 300,
        marks: [
          Plot.barY(figureData, {
            x: 'municipality',
            y: 'fraction',
            fill: colors.vibrant.maroon,
          }),
          Plot.textY(figureData, {
            x: 'municipality',
            y: () => 0.05,
            text: (d) => `${(d.fraction * 100).toFixed(1)}%`,
            fill: 'white',
          }),
        ],
      }}"
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
  <EmbedBar />
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
    min-height: 410px;
  }
  .plot.exporting :global(h2) {
    font-size: 23px !important;
  }
  .plot :global([aria-label='x-axis tick label']) {
    letter-spacing: -0.8px;
  }
  .plot :global([aria-label='x-axis tick label'] > text:first-of-type) {
    letter-spacing: -0.8px;
  }
  .plot :global(figure > svg) {
    margin-bottom: 5px;
  }
</style>
