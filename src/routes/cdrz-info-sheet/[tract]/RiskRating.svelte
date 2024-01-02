<script lang="ts">
  export let rating: string;
  export let score: string | number | null;

  $: bgColor = (() => {
    if (rating === 'Very High') return '#c04a5f';
    if (rating === 'Relatively High') return '#d9746b';
    if (rating === 'Relatively Moderate') return '#ecd664';
    if (rating === 'Relatively Low') return '#5d9ac6';
    if (rating === 'Very Low' || rating === 'No Expected Annual Losses') return '#566cbb';
    if (rating === 'Not Applicable') return '#cccccc';
    if (rating === 'Insufficient Data') return '#858585';
    return '#ffffff';
  })();

  $: ratingRewrite = (() => {
    if (rating === 'No Expected Annual Losses') return 'None';
    return rating;
  })();

  $: parsedScore = (() => {
    const parsed = parseFloat(`${score}`);
    if (isNaN(parsed)) return null;
    if (parsed === 0) return null;
    return parsed.toFixed(1);
  })();
</script>

<div class="wrapper">
  <div class="rating" style="--bgColor: {bgColor};">{ratingRewrite}</div>
  {#if parsedScore}
    <div class="score">&nbsp;({parsedScore})</div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .rating {
    --shade: color-mix(in srgb, var(--bgColor), transparent 70%);
    background-color: var(--shade);
    padding: 1px 3px;
    font-size: 13px;
    border: 1px solid var(--shade);
  }

  .score {
    font-size: 14px;
  }
</style>
