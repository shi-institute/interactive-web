<script lang="ts">
  import { page } from '$app/stores';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
  import {
    Button,
    InfoBar,
    ProgressRing,
    RadioButton,
    TextBlock,
    ToggleSwitch,
  } from 'fluent-svelte';

  export let pageTitleElemVisibleHeight: number;
  export let noBorderLeft = false;
  export let handleExport: (() => Promise<void>) | undefined = undefined;

  let exportLoading = false;
</script>

<aside class:noBorderLeft="{noBorderLeft}">
  <div class="sticky-wrapper" style="--pageTitleElemVisibleHeight: {pageTitleElemVisibleHeight}px;">
    <div class="wrapper-internal">
      <TextBlock variant="subtitle" style="padding: 24px 0 0px 0;">Options</TextBlock>

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Income brackets</TextBlock>
      <TextBlock variant="caption" class="cdrz-info-sidebar--field-caption">
        Choose display options for income brackets
      </TextBlock>
      <div>
        <ToggleSwitch bind:checked="{$opWonkOptionsStore.consolidate}">
          Consolidate income brackets
        </ToggleSwitch>
      </div>
      <div>
        <ToggleSwitch bind:checked="{$opWonkOptionsStore.labelBracketValues}">
          Label bracket values
        </ToggleSwitch>
      </div>
      {#if $opWonkOptionsStore.labelBracketValues}
        <div class="sub-opts">
          <RadioButton
            bind:group="{$opWonkOptionsStore.bracketValuesLabelMode}"
            value="total_household"
          >
            Total households
          </RadioButton>
          <RadioButton
            bind:group="{$opWonkOptionsStore.bracketValuesLabelMode}"
            value="percent_of_place_households"
          >
            Percent of place households
          </RadioButton>
        </div>
      {/if}

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">
        Median household income
      </TextBlock>
      <TextBlock variant="caption" class="cdrz-info-sidebar--field-caption">
        Choose which median household incomes to display
      </TextBlock>
      <div>
        <ToggleSwitch bind:checked="{$opWonkOptionsStore.showMedianHouseholdIncome}">
          Show median household income
        </ToggleSwitch>
      </div>
      {#if $opWonkOptionsStore.showMedianHouseholdIncome}
        <div class="sub-opts">
          <div>
            <ToggleSwitch bind:checked="{$opWonkOptionsStore['medianHouseholdIncomeMode.ami']}">
              Whole area
            </ToggleSwitch>
          </div>
          <div>
            <ToggleSwitch
              bind:checked="{$opWonkOptionsStore['medianHouseholdIncomeMode.black_ami']}"
            >
              Black
            </ToggleSwitch>
          </div>
          <div>
            <ToggleSwitch
              bind:checked="{$opWonkOptionsStore['medianHouseholdIncomeMode.white_ami']}"
            >
              White
            </ToggleSwitch>
          </div>
        </div>
      {/if}

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Place and time</TextBlock>
      <InfoBar
        message="You can also change these options with the dropdown menus above the figure."
        closable="{false}"
        class="cdrz-info-sidebar--notice"
      />

      <select bind:value="{$opWonkOptionsStore.city}">
        {#each $page.data.citiesUnique as city}
          <option value="{city}">{city}</option>
        {/each}
      </select>

      <select bind:value="{$opWonkOptionsStore.yearsACS}">
        {#each $page.data.acsYearsUnique as yearRange}
          <option value="{yearRange}">{yearRange}</option>
        {/each}
      </select>

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Compare</TextBlock>
      <TextBlock variant="caption" class="cdrz-info-sidebar--field-caption">
        Choose display options for comparing cities
      </TextBlock>
      <div>
        <ToggleSwitch bind:checked="{$opWonkOptionsStore.compare}">
          Show two cities side-by-side
        </ToggleSwitch>
        {#if $opWonkOptionsStore.compare}
          <div class="sub-opts" style="padding: 0 10px 10px 10px; margin-bottom: 10px;">
            <TextBlock variant="body" class="cdrz-info-sidebar--field-title">City 2</TextBlock>
            <select bind:value="{$opWonkOptionsStore.city2}">
              {#each $page.data.citiesUnique as city}
                <option value="{city}">{city}</option>
              {/each}
            </select>
          </div>
        {/if}
      </div>
      <div>
        <ToggleSwitch bind:checked="{$opWonkOptionsStore.useSameScaleWhenComparing}">
          When comparing places, use the same x-axis scale
        </ToggleSwitch>
      </div>
      {#if $opWonkOptionsStore.useSameScaleWhenComparing}
        <div class="sub">
          <TextBlock variant="caption">
            This option is affected by the income bracket label mode
          </TextBlock>
        </div>
      {/if}

      {#if handleExport}
        <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Export</TextBlock>
        <Button
          on:click="{async () => {
            exportLoading = true;
            await handleExport();
            exportLoading = false;
          }}"
          style="width: 166px; height: 32px; margin: 8px 0;"
        >
          {#if exportLoading}
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
      {/if}
    </div>
  </div>
</aside>

<style>
  aside {
    flex-grow: 1;
    flex-shrink: 0;
    border-left: 1px solid color-mix(in srgb, currentColor, transparent 86%);
  }
  aside.noBorderLeft {
    border-left: none;
  }
  @media print {
    aside {
      display: none;
    }
  }

  aside :global(.cdrz-info-sidebar--field-title) {
    display: block;
    padding-top: 10px;
  }

  aside :global(.cdrz-info-sidebar--field-caption) {
    display: block;
    margin-top: -2px;
    margin-bottom: 4px;
  }

  .sticky-wrapper {
    position: sticky;
    top: 0;
    height: calc(100vh - 40px);
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .wrapper-internal {
    max-width: 100%;
  }

  .sub-opts {
    border: 1px solid var(--fds-surface-stroke-default);
    margin-left: 48px;
    padding-left: 10px;
    border-radius: var(--fds-control-corner-radius);
  }

  .sub {
    margin-left: 48px;
  }

  :global(.cdrz-info-sidebar--notice p) {
    font-size: 12px !important;
    line-height: 1.2 !important;
  }

  select {
    align-items: center;
    border: none;
    border-radius: var(--fds-control-corner-radius);
    box-sizing: border-box;
    cursor: default;
    display: inline-flex;
    font-family: var(--fds-font-family-text);
    font-size: var(--fds-body-font-size);
    font-weight: 400;
    justify-content: center;
    line-height: 20px;
    outline: none;
    padding-block: 4px 6px;
    padding-inline: 11px;
    position: relative;
    text-decoration: none;
    transition: var(--fds-control-faster-duration) ease background;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-clip: padding-box;
    background-color: var(--fds-control-fill-default);
    border: 1px solid;
    border-color: var(--fds-control-border-default);
    color: var(--fds-text-primary);
    width: 100%;
    margin-top: 4px;
  }
  select:hover {
    background-color: var(--fds-control-fill-secondary);
  }
  select:active {
    background-color: var(--fds-control-fill-tertiary);
    border-color: var(--fds-control-stroke-default);
    color: var(--fds-text-secondary);
  }
  option {
    background-color: var(--fds-solid-background-tertiary);
  }
</style>
