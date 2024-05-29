<script lang="ts">
  import { colors } from '$lib/colors';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
</script>

<div class="swatches">
  <span class="swatch" style="--color: {colors.vibrant.blue}">■</span>
  &nbsp;Black&nbsp;&nbsp;
  <span class="swatch" style="--color: {colors.vibrant.orange}">■</span>
  &nbsp;White
</div>

<div class="dashes">
  {#if $opWonkOptionsStore.showMedianHouseholdIncome}
    {#each [$opWonkOptionsStore.medianHouseholdIncomeMode.ami ? 'Area' : null, $opWonkOptionsStore.medianHouseholdIncomeMode.black_ami ? 'Black' : null, $opWonkOptionsStore.medianHouseholdIncomeMode.white_ami ? 'White' : null].filter(Boolean) as item, index}
      <span
        class="dash"
        style="--color: {item === 'Black'
          ? colors.vibrant.blue
          : item === 'White'
          ? colors.vibrant.orange
          : '#777'};"
      >
        - - -
      </span>
      {item}
      {index === 0 ? 'Median Household Income' : ''}&nbsp;&nbsp;
    {/each}
  {/if}
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
</style>
