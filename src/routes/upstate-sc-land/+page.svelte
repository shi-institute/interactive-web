<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import DevelopedLandScenariosLinePlot from './DevelopedLandScenariosLinePlot.svelte';

  export let data;
  $: console.log(data);

  // calcualte the aspect ratio of the screen
  // so we can decide where to place the map
  // and graphs
  let docHeight = 560;
  let docWidth = 1000;
  $: aspectRatio = docWidth / docHeight;
</script>

<svelte:window bind:innerHeight={docHeight} bind:innerWidth={docWidth} />

<PageTitle>
  Upstate South Carolina Land Use History and Projections
  <svelte:fragment slot="caption">1980-2100 🔷🔷🔷🟡🟡🟡</svelte:fragment>
</PageTitle>

<DevelopedLandScenariosLinePlot />
