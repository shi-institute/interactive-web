<script lang="ts">
  import { browser } from '$app/environment';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
  import { themeMode } from '$stores/themeMode';
  import { downloadElement } from '$utils/downloadElement';
  import { Button } from 'fluent-svelte';
  import type { PageData } from './$types';
  import FloatingSidebar from './FloatingSidebar.svelte';
  import Legend from './Legend.svelte';
  import OptionsBar from './OptionsBar.svelte';
  import SubtitleSelect from './SubtitleSelect.svelte';
  import { isPanelWrapperOpen } from './isPanelWrapperOpen';

  export let data;
  $: ({ acsYearsUnique, citiesUnique, isEmbedded } = data);

  function getForcedDomain(data: PageData) {
    // if we are not comparing AND wnating to use the same scale, return undefined
    if (!$opWonkOptionsStore.compare || !$opWonkOptionsStore.useSameScaleWhenComparing)
      return undefined;

    // use the correct data function based on if consolidated brackets mode is enabled
    const dataFunc = $opWonkOptionsStore.consolidate ? data.getRegroupedData : data.getData;

    // get the data for both plots that are being compared side-by-side
    const combinedData = [
      ...dataFunc($opWonkOptionsStore.yearsACS, $opWonkOptionsStore.city),
      ...dataFunc($opWonkOptionsStore.yearsACS, $opWonkOptionsStore.city2),
    ];

    // figure out the largest number of households in the largest bracket
    // across both plots
    const maxHouseholds = Math.max(
      ...combinedData.map((item) => {
        if ($opWonkOptionsStore.bracketValuesLabelMode === 'percent_of_place_households') {
          return item.householdsShare * 100;
        }
        return item.households;
      })
    );

    // construct a domain based on the maxHouseholds
    const domain = [-1 * maxHouseholds, maxHouseholds];

    return domain;
  }

  let exportElem: HTMLElement;
  let exporting = false;
  $: exportWidth = $opWonkOptionsStore.compare ? 1280 : 680;
  async function downloadFigures() {
    exporting = true;
    await downloadElement(exportElem, exportWidth, 'Household_Income_Bracket_By_Race.png');
    exporting = false;
  }
</script>

<FloatingSidebar handleExport="{downloadFigures}" isEmbedded="{isEmbedded}" />

{#if !isEmbedded}
  <OptionsBar />
{/if}

<div class="exportable" bind:this="{exportElem}">
  <div class="header">
    <h1>Households by income bracket and race</h1>
  </div>

  <div class="figures" class:exporting="{exporting}" style="--exportWidth: {exportWidth}px;">
    <div class="figure">
      <div class="subtitle">
        <SubtitleSelect
          options="{citiesUnique}"
          bind:value="{$opWonkOptionsStore.city}"
          disabled="{exporting}"
        />
        &nbsp;·&nbsp;
        <SubtitleSelect
          options="{acsYearsUnique}"
          bind:value="{$opWonkOptionsStore.yearsACS}"
          disabled="{exporting}"
        />
        <Legend />
        {#key $themeMode}
          <PlotContainer
            plot="{(width) =>
              data.generatePlotOptions($opWonkOptionsStore.yearsACS, $opWonkOptionsStore.city, {
                width,
                height: $opWonkOptionsStore.consolidate ? 252 : 400,
                consolidate: $opWonkOptionsStore.consolidate,
                labelBracketValues: $opWonkOptionsStore.labelBracketValues,
                showPercentOfHouseholds:
                  $opWonkOptionsStore.bracketValuesLabelMode === 'percent_of_place_households',
                showAreaMedianHouseholdIncome:
                  $opWonkOptionsStore.showMedianHouseholdIncome &&
                  $opWonkOptionsStore['medianHouseholdIncomeMode.ami'],
                showBlackMedianHouseholdIncome:
                  $opWonkOptionsStore.showMedianHouseholdIncome &&
                  $opWonkOptionsStore['medianHouseholdIncomeMode.black_ami'],
                showWhiteMedianHouseholdIncome:
                  $opWonkOptionsStore.showMedianHouseholdIncome &&
                  $opWonkOptionsStore['medianHouseholdIncomeMode.white_ami'],
                xAxisDomain: getForcedDomain(data),
              })}"
            fullWidth
          />
        {/key}
      </div>
    </div>
    {#if $opWonkOptionsStore.compare}
      <div class="figure" class:isEmbedded="{isEmbedded}">
        <div class="subtitle">
          <SubtitleSelect
            options="{citiesUnique}"
            bind:value="{$opWonkOptionsStore.city2}"
            disabled="{exporting}"
          />
          &nbsp;·&nbsp;
          <SubtitleSelect
            options="{acsYearsUnique}"
            bind:value="{$opWonkOptionsStore.yearsACS}"
            disabled
          />
          <Legend />
        </div>
        {#key $themeMode}
          <PlotContainer
            plot="{(width) =>
              data.generatePlotOptions($opWonkOptionsStore.yearsACS, $opWonkOptionsStore.city2, {
                width,
                height: $opWonkOptionsStore.consolidate ? 252 : 400,
                consolidate: $opWonkOptionsStore.consolidate,
                labelBracketValues: $opWonkOptionsStore.labelBracketValues,
                showPercentOfHouseholds:
                  $opWonkOptionsStore.bracketValuesLabelMode === 'percent_of_place_households',
                showAreaMedianHouseholdIncome:
                  $opWonkOptionsStore.showMedianHouseholdIncome &&
                  $opWonkOptionsStore['medianHouseholdIncomeMode.ami'],
                showBlackMedianHouseholdIncome:
                  $opWonkOptionsStore.showMedianHouseholdIncome &&
                  $opWonkOptionsStore['medianHouseholdIncomeMode.black_ami'],
                showWhiteMedianHouseholdIncome:
                  $opWonkOptionsStore.showMedianHouseholdIncome &&
                  $opWonkOptionsStore['medianHouseholdIncomeMode.white_ami'],
                xAxisDomain: getForcedDomain(data),
              })}"
            fullWidth
          />
        {/key}
      </div>
    {/if}
  </div>

  <!-- svelte-ignore a11y-structure -->
  {#if exporting}
    <figcaption class="export-credit" style="--exportWidth: {exportWidth}px;">
      Created by the Applied Research team at the Shi Insitiute for Sustainable Communities.
    </figcaption>
  {/if}
</div>

{#if isEmbedded}
  <EmbedBar
    actions="{[{ label: 'Options', onClick: () => ($isPanelWrapperOpen = !$isPanelWrapperOpen) }]}"
  />
{/if}

{#if !isEmbedded}
  <div class="prompt">
    {#if browser}
      <p>
        Want to adjust the way the figure looks? Click or tap the <Button
          variant="hyperlink"
          style="padding-left: 0; padding-right: 0;"
          on:click="{() => ($isPanelWrapperOpen = true)}"
        >
          Options
        </Button> button on the bottom-right side of your screen.
      </p>
      {#if !$opWonkOptionsStore.compare}
        <p>
          Or, <Button
            variant="hyperlink"
            style="padding-left: 0; padding-right: 0;"
            on:click="{() => ($opWonkOptionsStore.compare = true)}"
          >
            Compare with another municipality
          </Button>.
        </p>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .header {
    position: relative;
    padding: 10px 20px 0 20px;
  }

  h1 {
    font-weight: 600;
    font-size: 24px;
    font-variant: lining-nums;
    margin-bottom: 0px;
  }

  .subtitle {
    user-select: none;
  }

  .figures {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 1200px) {
    .figures:not(.exporting) {
      flex-direction: column;
    }
  }

  .figure {
    min-height: 300px;
    flex-grow: 1;
    --border-color: var(--fds-surface-stroke-default);
    --padding: 30px;
  }

  @media (min-width: 1201px) {
    .figure:nth-of-type(2) {
      border-left: 1px solid var(--border-color);
      padding-left: var(--padding);
      margin-left: var(--padding);
    }
  }
  @media (max-width: 1200px) {
    .figure:nth-of-type(2):not(.exporting) {
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding-top: var(--padding);
      padding-bottom: var(--padding);
      margin-top: var(--padding);
    }
  }
  .figure:nth-of-type(2).isEmbedded {
    border-bottom: none;
  }

  .prompt {
    font-family: var(--fds-font-family-text);
    font-size: var(--fds-body-font-size);
    text-align: center;
    margin: 30px 20px 60px 20px;
  }
  .prompt p {
    margin: 0;
  }

  .figures.exporting {
    width: var(--exportWidth);
  }

  .export-credit {
    width: var(--exportWidth);
    font-style: italic;
    padding: 0 20px 12px 20px;
  }
</style>
