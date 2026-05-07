<script lang="ts">
  import { onMount } from 'svelte';
  import PageTitle from '$lib/PageTitle.svelte';
  import DevelopedLandScenariosLinePlot from './DevelopedLandScenariosLinePlot.svelte';

  let Map: typeof import('./UpstateLULCMap.svelte').default | undefined;
  onMount(async () => {
    Map = (await import('./UpstateLULCMap.svelte')).default;
  });

  export let data;
  $: console.log(data);

  // calcualte the aspect ratio of the screen
  // so we can decide where to place the map
  // and graphs
  let docHeight = 560;
  let docWidth = 1000;
  $: aspectRatio = docWidth / docHeight;

  let sidebarWidth = 450;
</script>

<svelte:window bind:innerHeight={docHeight} bind:innerWidth={docWidth} />

<div class="wrapper">
  <PageTitle>
    Upstate South Carolina Land Use History and Projections
    <svelte:fragment slot="caption">1980-2100 🔷🔷🔷🟡🟡🟡</svelte:fragment>
  </PageTitle>

  <div class="page-content" class:vertical={aspectRatio < 1}>
    {#if Map}<svelte:component this={Map} />{/if}

    <div class="sidebar" bind:clientWidth={sidebarWidth}>
      <DevelopedLandScenariosLinePlot width={sidebarWidth} />
    </div>
  </div>
</div>

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
    overflow: auto;
    height: 0;
  }
  .page-content {
    grid-template-columns: 1fr 450px;
  }
  .page-content.vertical {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .sidebar {
    padding: 20px;
    overflow: auto;
    box-shadow: -1px 1px 5px 0px rgb(0 0 0 / 15%);
    z-index: 400;
  }
</style>
