<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import DevelopedLandScenariosLinePlot from './DevelopedLandScenariosLinePlot.svelte';
  import Map from './UpstateLULCMap.svelte';

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

<div class="wrapper">
  <PageTitle>
    Upstate South Carolina Land Use History and Projections
    <svelte:fragment slot="caption">1980-2100 🔷🔷🔷🟡🟡🟡</svelte:fragment>
  </PageTitle>

  <div class="page-content" class:vertical={aspectRatio < 1}>
    <Map />

    <DevelopedLandScenariosLinePlot />
  </div>
</div>

{aspectRatio}

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .page-content {
    flex-grow: 1;
    flex-shrink: 1;
    display: grid;
  }
  .page-content {
    grid-template-columns: 1fr 450px;
  }
  .page-content.vertical {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
</style>
