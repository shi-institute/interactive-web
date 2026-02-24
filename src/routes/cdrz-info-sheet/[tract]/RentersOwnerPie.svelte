<script lang="ts">
  export let size: number;

  export let renters: number;
  export let owners: number;
  export let style = '';

  $: total = renters + owners;
  $: rentersFraction = renters / total;
  $: ownersFraction = owners / total;
</script>

<!-- adapted from https://sparkbox.com/foundry/how_to_code_an_SVG_pie_chart -->
<div class="wrapper" style="{style}">
  <svg height="{size}" width="{size}" viewBox="0 0 20 20">
    <circle r="10" cx="10" cy="10" fill="olive"></circle>
    <circle
      r="5"
      cx="10"
      cy="10"
      fill="transparent"
      stroke="tomato"
      stroke-width="10"
      stroke-dasharray="calc(31.4 * {rentersFraction}) 31.4"
      transform="rotate(-90) translate(-20)"
    ></circle>
  </svg>

  <div class="swatches">
    <div class="swatch">
      <div class="swatch-cube" style="color: tomato;"></div>
      <div class="swatch-label">Renters ({(rentersFraction * 100).toFixed(0)}%)</div>
    </div>
    <div class="swatch">
      <div class="swatch-cube" style="color: olive;"></div>
      <div class="swatch-label">Owners ({(ownersFraction * 100).toFixed(0)}%)</div>
    </div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }

  .swatch {
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
  }

  .swatch-cube {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: currentColor;
  }

  .swatch-label {
    font-size: 14px;
  }

  .swatches {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
</style>
