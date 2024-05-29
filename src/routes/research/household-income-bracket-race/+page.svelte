<script lang="ts">
  import { browser } from '$app/environment';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
  import { Button } from 'fluent-svelte';
  import type { PageData } from './$types';
  import FloatingSidebar from './FloatingSidebar.svelte';
  import Legend from './Legend.svelte';
  import SubtitleSelect from './SubtitleSelect.svelte';
  import { isPanelWrapperOpen } from './isPanelWrapperOpen';

  export let data;
  $: ({ acsYearsUnique, citiesUnique } = data);

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
</script>

<FloatingSidebar />

<div class="header">
  <h1>Households by income bracket and race</h1>
  <div class="buttons">
    {#if $opWonkOptionsStore.compare}
      <Button on:click="{() => ($opWonkOptionsStore.compare = false)}">
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6.25A2.25 2.25 0 0 1 4.25 4h15.5A2.25 2.25 0 0 1 22 6.25v11.5A2.25 2.25 0 0 1 19.75 20H4.25A2.25 2.25 0 0 1 2 17.75V6.25Zm2.25-.75a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V6.25a.75.75 0 0 0-.75-.75H4.25Z"
            fill="#ffffff"
          ></path>
          <path
            d="M8.22 8.215a.75.75 0 0 1 1.06 0l2.72 2.72 2.725-2.716a.75.75 0 0 1 1.06 1.062l-2.724 2.715 2.724 2.724a.75.75 0 1 1-1.06 1.06L12 13.057 9.28 15.78a.75.75 0 0 1-1.06-1.06l2.72-2.724-2.72-2.72a.75.75 0 0 1 0-1.06Z"
            fill="#ffffff"
          ></path>
        </svg>
        Stop comparing
      </Button>
    {:else}
      <Button on:click="{() => ($opWonkOptionsStore.compare = true)}">
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.31 10.248a.75.75 0 1 0-1.12-.997l-2 2.25a.75.75 0 0 0 0 .997l2 2.25a.75.75 0 1 0 1.12-.996l-.89-1.002h9.16l-.89 1.002a.75.75 0 1 0 1.12.996l2-2.25.01-.012a.747.747 0 0 0-.012-.987L16.81 9.251a.75.75 0 1 0-1.12.997l.89 1.002H7.42l.89-1.002Z"
            fill="currentColor"
          ></path>
          <path
            d="M12.754 4.001v.002h7.498c.966 0 1.75.784 1.75 1.75v12.495a1.75 1.75 0 0 1-1.75 1.75h-8.998v-.002H3.757a1.75 1.75 0 0 1-1.75-1.75V5.751c0-.967.783-1.75 1.75-1.75h8.997Zm7.498 1.502h-7.498V10.5h-1.5V5.5H3.757a.25.25 0 0 0-.25.25v12.495c0 .138.112.25.25.25h7.497V13.5h1.5v4.998h7.498a.25.25 0 0 0 .25-.25V5.754a.25.25 0 0 0-.25-.25Z"
            fill="currentColor"
          ></path>
        </svg>
        Compare
      </Button>
    {/if}
    <Button on:click="{() => ($isPanelWrapperOpen = !$isPanelWrapperOpen)}">
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.75 13.5a3.251 3.251 0 0 1 3.163 2.498L21.25 16a.75.75 0 0 1 .102 1.493l-.102.007h-9.337a3.251 3.251 0 0 1-6.326 0H2.75a.75.75 0 0 1-.102-1.493L2.75 16h2.837a3.251 3.251 0 0 1 3.163-2.5Zm0 1.5a1.75 1.75 0 0 0-1.652 1.172l-.021.063-.039.148a1.756 1.756 0 0 0 .02.815l.04.13.025.069a1.75 1.75 0 0 0 3.28-.069l.04-.13-.018.06a1.75 1.75 0 0 0 .048-.815l-.03-.137-.02-.07-.047-.134A1.75 1.75 0 0 0 8.75 15Zm6.5-11a3.251 3.251 0 0 1 3.163 2.5h2.837a.75.75 0 0 1 .102 1.493L21.25 8h-2.837a3.251 3.251 0 0 1-6.326 0H2.75a.75.75 0 0 1-.102-1.493L2.75 6.5l9.337-.002A3.251 3.251 0 0 1 15.25 4Zm0 1.5a1.75 1.75 0 0 0-1.652 1.173l-.021.062-.038.148a1.757 1.757 0 0 0 .019.815l.04.13.025.069a1.75 1.75 0 0 0 3.28-.068l.04-.131-.018.06a1.75 1.75 0 0 0 .048-.815l-.03-.137-.02-.07-.047-.134A1.75 1.75 0 0 0 15.25 5.5Z"
          fill="currentColor"
        ></path>
      </svg>
      Options
    </Button>
  </div>
</div>

<div class="figures">
  <div class="figure">
    <div class="subtitle">
      <SubtitleSelect options="{citiesUnique}" bind:value="{$opWonkOptionsStore.city}" />
      &nbsp;·&nbsp;&nbsp;
      <SubtitleSelect options="{acsYearsUnique}" bind:value="{$opWonkOptionsStore.yearsACS}" />
      <Legend />
      <PlotContainer
        plot="{data.generatePlotOptions($opWonkOptionsStore.yearsACS, $opWonkOptionsStore.city, {
          // width: $opWonkOptionsStore.fullWidthMode ? width : 800,
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
    </div>
  </div>
  {#if $opWonkOptionsStore.compare}
    <div class="figure">
      <div class="subtitle">
        <SubtitleSelect options="{citiesUnique}" bind:value="{$opWonkOptionsStore.city2}" />
        &nbsp;·&nbsp;&nbsp;
        <SubtitleSelect
          options="{acsYearsUnique}"
          bind:value="{$opWonkOptionsStore.yearsACS}"
          disabled
        />
        <Legend />
      </div>
      <PlotContainer
        plot="{data.generatePlotOptions($opWonkOptionsStore.yearsACS, $opWonkOptionsStore.city2, {
          // width: $opWonkOptionsStore.fullWidthMode ? width : 800,
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
    </div>
  {/if}
</div>

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

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 150px;
    justify-content: right;
    gap: 6px;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  @media (max-width: 700px) {
    .buttons {
      display: none;
    }
  }

  .buttons svg {
    margin-right: 6px;
  }

  .figures {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 1200px) {
    .figures {
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
    .figure:nth-of-type(2) {
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding-top: var(--padding);
      padding-bottom: var(--padding);
      margin-top: var(--padding);
    }
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
</style>
