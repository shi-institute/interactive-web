<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import { appSettings } from '../../stores/appSettings';
  import LandingPageMap from './LandingPageMap.svelte';

  export let data;

  let pageTitleVisibleHeight = 78;
  let listHeight = 210;
</script>

<svelte:head>
  <title>CDRZ Info Sheets</title>
</svelte:head>

<PageTitle bind:visibleHeight="{pageTitleVisibleHeight}">
  Climate Disaster Resilience Zone (CDRZ) info sheets
  <svelte:fragment slot="caption">South Carolina</svelte:fragment>
</PageTitle>

<div class="tracts-list" bind:clientHeight="{listHeight}">
  Click a tract to view details:

  <ul>
    {#each data.cdrzs as cdrz}
      <a href="/cdrz-info-sheet/{cdrz.tract}"><li>{cdrz.tract} ({cdrz.places[0].name})</li></a>
    {/each}
  </ul>
</div>

<div
  class="map"
  style="--pageTitleVisibleHeight: {pageTitleVisibleHeight}px; --listHeight: {listHeight}px;"
>
  {#key $appSettings.basemap}
    <LandingPageMap />
  {/key}
</div>

<style>
  .tracts-list {
    padding: 10px;
  }
  ul {
    margin: 0;
    padding: 0 0 0 20px;
  }
  @media (min-width: 600px) {
    .tracts-list {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 9999;
      background-color: var(--fds-solid-background-tertiary);
      border: 1px solid var(--fds-surface-stroke-default);
      border-radius: var(--fds-control-corner-radius);
      padding: 15px 20px 15px 15px;
    }
  }

  .map {
    width: 100%;
    height: calc(100% - var(--pageTitleVisibleHeight) - var(--listHeight));
  }
  @media (min-width: 600px) {
    .map {
      height: calc(100% - var(--pageTitleVisibleHeight));
    }
  }
</style>
