<script lang="ts">
  import { browser } from '$app/environment';
  import { colors } from '$lib/colors';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';

  $: isAlone = !$opWonkOptionsStore.compare;
  $: isCity = isAlone ? !$opWonkOptionsStore.city.split(',')[0].endsWith('CDP') : undefined;
</script>

<div class="legend">
  <div class="swatches">
    <span class="swatch" style="--color: {colors.vibrant.blue}">■</span>
    &nbsp;Black&nbsp;&nbsp;
    <span class="swatch" style="--color: {colors.vibrant.orange}">■</span>
    &nbsp;White
  </div>

  <div class="dashes">
    {#if $opWonkOptionsStore.showMedianHouseholdIncome}
      {#each [$opWonkOptionsStore['medianHouseholdIncomeMode.ami'] ? (isCity ? 'City' : 'Municipality') : null, $opWonkOptionsStore['medianHouseholdIncomeMode.black_ami'] ? 'Black' : null, $opWonkOptionsStore['medianHouseholdIncomeMode.white_ami'] ? 'White' : null].filter(Boolean) as item, index}
        <span
          class="dash"
          style="--color: {item === 'Black'
            ? colors.vibrant.blue
            : item === 'White'
            ? colors.vibrant.orange
            : browser &&
              window?.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '#aaa'
            : '#777'};"
        >
          - - -
        </span>
        {item}
        {index === 0 ? 'Median Household Income' : ''}&nbsp;&nbsp;
      {/each}
    {/if}
  </div>
</div>

<style>
  .swatches {
    font-size: 14px;
    margin-top: -6px;
    margin-bottom: -4px;

    display: flex;
    align-items: center;
  }

  .swatch {
    font-size: 22px;
    color: var(--color);
    margin-top: -2px;
  }

  .dashes {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .dash {
    font-weight: 600;
    color: var(--color);
    margin-right: 2px;
  }

  .legend {
    margin: 6px 0 10px 0;
  }
</style>
