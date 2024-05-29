<script lang="ts">
  import { appSettings, basemapNames } from '$stores/appSettings';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
  import { ComboBox, InfoBar, RadioButton, TextBlock, ToggleSwitch } from 'fluent-svelte';

  export let pageTitleElemVisibleHeight: number;
  export let noBorderLeft = false;
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

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Compare</TextBlock>
      <TextBlock variant="caption" class="cdrz-info-sidebar--field-caption">
        Choose display options for comparing cities
      </TextBlock>
      <div>
        <ToggleSwitch bind:checked="{$opWonkOptionsStore.compare}">
          Show two cities side-by-side
        </ToggleSwitch>
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
    height: calc(100vh - var(--headerVisibleHeight) - var(--pageTitleElemVisibleHeight));
    overflow: auto;
    padding: 0 20px;
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
</style>
