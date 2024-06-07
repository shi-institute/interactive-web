<script lang="ts">
  import { browser } from '$app/environment';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { downloadElement } from '$utils/downloadElement.js';
  import { Button, ProgressRing } from 'fluent-svelte';
  import { getPlotOptionsCV } from './getPlotOptionsCV.js';
  import { getPlotOptionsRaceACS } from './getPlotOptionsRaceACS.js';

  export let data;

  let exportElem: HTMLElement;
  let fiveYearElem: HTMLElement;
  let oneYearElem: HTMLElement;
  let cvElem: HTMLElement;
  let exporting = false;
  let exportingSingle = false;
  let oneAndFiveYearOnly = false;
  let width = 0;
  let resetBorders = false;
  function download(
    elem = exportElem,
    _width: number,
    _resetBorders = false,
    name = 'ACS_Differences_Gvl',
    _exportingSingle = false
  ) {
    exporting = true;
    width = _width;
    if (_resetBorders) resetBorders = true;
    if (_exportingSingle) exportingSingle = true;
    return downloadElement(elem, width + 20, name).finally(() => {
      exporting = false;
      exportingSingle = false;
      resetBorders = false;
    });
  }
</script>

<div
  class="plot"
  bind:this="{exportElem}"
  class:exporting="{exporting}"
  class:exportingSingle="{exportingSingle}"
  style="{`--width: ${width}px;`}"
  class:resetBorders="{resetBorders}"
>
  <div class="header">
    <h1>Discrepencies in 1-year and 5-year population by race estimates</h1>
  </div>

  {#if browser}
    <div
      class="five-year"
      bind:this="{fiveYearElem}"
      class:oneAndFiveYearOnly="{oneAndFiveYearOnly}"
    >
      <PlotContainer
        plot="{getPlotOptionsRaceACS(
          data.est5,
          (exportingSingle ? 'Population by race: ' : '') + 'Five-year',
          400,
          undefined,
          resetBorders || true,
          exportingSingle
        )}"
        fullWidth
      />
    </div>
    <div class="one-year" bind:this="{oneYearElem}" class:oneAndFiveYearOnly="{oneAndFiveYearOnly}">
      <PlotContainer
        plot="{getPlotOptionsRaceACS(
          data.est1,
          (exportingSingle ? 'Population by race: ' : '') + 'One-year',
          400,
          undefined,
          resetBorders || false,
          exportingSingle
        )}"
        fullWidth
      />
    </div>
    {#if !oneAndFiveYearOnly}
      <div class="cv" bind:this="{cvElem}">
        <PlotContainer
          plot="{getPlotOptionsCV(data.cv, exportingSingle ? 'Population by race: ' : '')}"
          fullWidth
        />
      </div>
    {/if}
  {/if}
</div>

{#if !data.isEmbedded}
  <div class="controls">
    <Button
      disabled="{exporting}"
      on:click="{() => download(exportElem, 840)}"
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
        on:click="{() => download(fiveYearElem, 640, true, 'ACS_CV_Gvl_5est', true)}"
      >
        Only download five-year estimates figure
      </Button>
    </div>
    <div>
      <Button
        disabled="{exporting}"
        variant="hyperlink"
        on:click="{() => download(oneYearElem, 640, true, 'ACS_CV_Gvl_1est', true)}"
      >
        Only download one-year estimates figure
      </Button>
    </div>
    <div>
      <Button
        disabled="{exporting}"
        variant="hyperlink"
        on:click="{() => {
          oneAndFiveYearOnly = true;
          download(exportElem, 860, false, 'ACS_CV_Gvl_1est').finally(() => {
            oneAndFiveYearOnly = false;
          });
        }}"
      >
        Only download combined five-year and one-year estimates figure
      </Button>
    </div>
    <div>
      <Button
        disabled="{exporting}"
        variant="hyperlink"
        on:click="{() => download(cvElem, 640, true, 'ACS_CV_Gvl_CV', true)}"
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
  .header {
    position: relative;
    grid-area: header;
  }
  h1 {
    font-weight: 600;
    font-size: 24px;
    font-variant: lining-nums;
    margin: 0;
    padding: 0 0 20px 0;
  }
  .plot:not(.exportingSingle) :global(h2) {
    font-size: 22px;
  }

  .controls {
    padding: 20px;
    padding-top: 0;
  }
  .plot {
    display: grid;
    grid-template-columns: minmax(230px, 430px) minmax(230px, 430px);
    grid-template-rows: auto auto auto;
    max-width: 970px;
    grid-template-areas:
      'header     header  '
      'five-year  one-year'
      'cv         cv';
    padding: 20px;
  }
  .plot.exporting {
    width: var(--width);
    padding: 30px;
  }
  .plot.exportingSingle {
    display: block;
  }
  .plot .five-year {
    grid-area: five-year;
    border-right: 1px solid var(--fds-surface-stroke-default);
    padding-right: 30px;
  }
  .plot .one-year {
    grid-area: one-year;
    padding-left: 30px;
  }
  .plot :where(.five-year, .one-year) {
    padding-bottom: 30px;
    container-type: inline-size;
  }
  .plot :where(.five-year, .one-year).oneAndFiveYearOnly {
    padding-bottom: 0;
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
  }

  @media (max-width: 500px) {
    .plot {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto auto;
      grid-template-areas:
        'header'
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

  @container (max-width: 320px) {
    .plot
      :where(.five-year, .one-year)
      :global(
        g[aria-label='text']:not([text-anchor='start'])
          > text:not(:first-of-type):not(:last-of-type)
      ) {
      display: none;
    }
  }
</style>
