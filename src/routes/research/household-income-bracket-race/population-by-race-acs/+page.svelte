<script lang="ts">
  import { browser } from '$app/environment';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { colors } from '$lib/colors.js';
  import { downloadElement } from '$utils/downloadElement.js';
  import * as Plot from '@observablehq/plot';
  import { Button, ProgressRing } from 'fluent-svelte';
  import { html } from 'htl';
  import { getPlotOptionsCV } from './getPlotOptionsCV.js';
  import { getPlotOptionsRaceACS } from './getPlotOptionsRaceACS.js';

  export let data;

  let exportElem: HTMLElement;
  let fiveYearElem: HTMLElement;
  let oneYearElem: HTMLElement;
  let cvElem: HTMLElement;
  let exporting = false;
  let width = 970;
  let resetBorders = false;
  function download(elem = exportElem, width: number, _resetBorders = false) {
    exporting = true;
    if (_resetBorders) resetBorders = true;
    downloadElement(elem, width + 20, 'Racial_Income_Gap_Median_Ratio').finally(() => {
      exporting = false;
      resetBorders = false;
    });
  }
</script>

<div
  class="plot"
  bind:this="{exportElem}"
  class:exporting="{exporting}"
  style="--width: {width}px;"
  class:resetBorders="{resetBorders}"
>
  {#if browser}
    <div class="five-year" bind:this="{fiveYearElem}">
      <PlotContainer
        plot="{getPlotOptionsRaceACS(
          data.est5,
          'Five-year',
          400,
          undefined,
          resetBorders || true,
          false
        )}"
        fullWidth="{!exporting}"
      />
    </div>
    <div class="one-year" bind:this="{oneYearElem}">
      <PlotContainer
        plot="{getPlotOptionsRaceACS(
          data.est1,
          'One-year',
          400,
          undefined,
          resetBorders || false,
          false
        )}"
        fullWidth="{!exporting}"
      />
    </div>
    <div class="cv" bind:this="{cvElem}">
      <PlotContainer plot="{getPlotOptionsCV(data.cv)}" fullWidth="{!exporting}" />
    </div>
  {/if}
</div>

{#if !data.isEmbedded}
  <div class="controls">
    <Button
      disabled="{exporting}"
      on:click="{() => download(exportElem, width)}"
      style="width: 166px; height: 32px; margin: 8px 0;"
    >
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
    <div>
      <Button
        disabled="{exporting}"
        variant="hyperlink"
        on:click="{() => download(fiveYearElem, 360, true)}"
      >
        Only download five-year estimates figure
      </Button>
    </div>
    <div>
      <Button
        disabled="{exporting}"
        variant="hyperlink"
        on:click="{() => download(oneYearElem, 360, true)}"
      >
        Only download one-year estimates figure
      </Button>
    </div>
    <div>
      <Button
        disabled="{exporting}"
        variant="hyperlink"
        on:click="{() => download(cvElem, 640, true)}"
      >
        Only download coefficient of variation figure
      </Button>
    </div>
  </div>
{/if}

{#if data.isEmbedded}
  <EmbedBar />
{/if}

<style>
  .controls {
    padding: 20px;
    padding-top: 0;
  }
  .plot {
    display: grid;
    grid-template-columns: minmax(230px, 430px) minmax(230px, 430px);
    grid-template-rows: auto auto;
    max-width: 970px;
    grid-template-areas:
      'five-year  one-year'
      'cv         cv';
    padding: 20px;
  }
  .plot.exporting {
    width: var(--width);
    padding: 30px;
  }
  .plot .five-year {
    grid-area: five-year;
    border-right: 1px solid var(--fds-surface-stroke-default);
    padding-right: 30px;
    padding-bottom: 30px;
  }
  .plot .one-year {
    grid-area: one-year;
    padding-left: 30px;
    padding-bottom: 30px;
  }
  .plot .cv {
    grid-area: cv;
    border-top: 1px solid var(--fds-surface-stroke-default);
    padding-top: 30px;
  }

  @media (max-width: 700px) and (min-width: 501px) {
    .plot .five-year {
      padding-right: 5px;
      padding-bottom: 10px;
    }
    .plot .one-year {
      padding-left: 5px;
      padding-bottom: 10px;
    }
    .plot .cv {
      padding-top: 20px;
    }
    .plot
      :where(.five-year, .one-year)
      :global(
        g[aria-label='text']:not([text-anchor='start'])
          > text:not(:first-of-type):not(:last-of-type)
      ) {
      display: none;
    }
  }

  @media (max-width: 500px) {
    .plot {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'five-year'
        'one-year'
        'cv';
    }
    .plot .five-year,
    .plot .one-year {
      padding: 0 0 20px 0;
      margin: 0 0 20px 0;
      border: none;
      border-bottom: 1px solid var(--fds-surface-stroke-default);
    }
    .plot .cv {
      padding: 0;
      border: none;
    }
  }

  .plot.resetBorders :where(.five-year, .one-year, .cv) {
    border: none;
    margin: 0;
    padding: 20px;
  }
</style>
