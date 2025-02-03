<script lang="ts">
  import GentrificationPlots from '../../../GentrificationPlots.svelte';

  export let data;
</script>

{#if data.neighborhoodGentrificationData}
  <GentrificationPlots data="{data.neighborhoodGentrificationData}" />
{:else}
  <GentrificationPlots data="{data.tractGentrificationData}" />
{/if}
