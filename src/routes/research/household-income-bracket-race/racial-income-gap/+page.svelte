<script lang="ts">
  import { browser } from '$app/environment';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { colors } from '$lib/colors.js';
  import { shiLogoB64Black, shiLogoB64White } from '$lib/shiLogoB64.js';
  import { downloadElement } from '$utils/downloadElement.js';
  import * as Plot from '@observablehq/plot';
  import { Button, ProgressRing } from 'fluent-svelte';
  import { html } from 'htl';

  export let data;

  let exportElem: HTMLElement;
  let exporting = false;
  let width = 640;
  function download() {
    exporting = true;
    downloadElement(exportElem, width + 20, 'Racial_Income_Gap_Median_Ratio').finally(
      () => (exporting = false)
    );
  }
</script>

<div
  class="plot"
  bind:this="{exportElem}"
  class:exporting="{exporting}"
  style="--width: {width}px;"
>
  {#if browser}
    <PlotContainer
      plot="{{
        title: 'Racial income gap: Median household income comparison',
        subtitle: 'Between white and Black households, 2022',
        caption: html`
          A larger ratio indicates a larger income gap between white and Black households.
          <br />
          The income ratio is calculated as the median household income of white households divided
          by the median household income of Black households.
          <br />
          <i>Data: US Census Bureau American Community Survey (5-year estimates)</i>
        `,
        marginTop: 15,
        marginRight: 0,
        marginBottom: 40,
        marginLeft: 29,
        x: { label: '' },
        y: { label: '', labelArrow: 'none', domain: [0, 4], grid: true },
        color: {
          legend: true,
          domain: [0, 4],
          range: [colors.vibrant.lightblue, colors.vibrant.maroon],
          label: '↑ Income ratio',
        },
        width,
        height: 300,
        marks: [
          Plot.barY(data.tidy, {
            x: 'municipality',
            y: 'whiteBlackIncomeRatio',
            fill: 'whiteBlackIncomeRatio',
          }),
          Plot.image([{}], {
            frameAnchor: 'top-right',
            dy: 0,
            dx: -15,
            src: () =>
              window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? shiLogoB64White
                : shiLogoB64Black,
            r: 15,
            preserveAspectRatio: 'xMidYMin slice',
            opacity: () =>
              window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 0.3
                : 0.8,
            tip: true,
            href: () => 'https://www.furman.edu/shi-institute/sustainability-research/',
            target: '_blank',
            title:
              'This figure was created by The Shi Institute for Sustainable Communities at Furman University',
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
    width: var(--width);
  }
  .plot.exporting :global(h2) {
    font-size: 23px !important;
  }
  .plot :global([aria-label='x-axis tick label']) {
    letter-spacing: -0.8px;
  }
  .plot :global(figure > svg:not([class*='-ramp'])) {
    margin-bottom: 5px;
  }
  .plot :global(figure > svg[class*='-ramp'] .tick:first-of-type text) {
    transform: translateX(3px);
  }
</style>
