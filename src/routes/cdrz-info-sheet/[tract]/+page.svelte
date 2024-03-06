<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import { cdrzOptionsStore } from '../../../stores/cdrzOptionsStore';
  import AddSideBySide from './AddSideBySide.svelte';
  import FloatingSidebar from './FloatingSidebar.svelte';
  import Sidebar from './Sidebar.svelte';
  import SingleCdrz from './SingleCdrz.svelte';

  export let data;

  $: pageTitleElemVisibleHeight = 78;

  let pageWidth = 1200;

  $: fixedSidebarEnabled = pageWidth >= 1080;
</script>

<PageTitle bind:visibleHeight="{pageTitleElemVisibleHeight}">
  Climate Disaster Resilience Zone (CDRZ) info sheet
  <svelte:fragment slot="caption">
    {#if $cdrzOptionsStore.compareSideBySide && data.tracts.length > 1}
      South Carolina Tracts <code>{data.tracts}</code>
    {:else}
      {data.cdrz.nickname} – Tract
      <code>{data.tracts[0]}</code>
    {/if}
  </svelte:fragment>
</PageTitle>

<svelte:window bind:innerWidth="{pageWidth}" />

<div class="page-content-wrapper">
  <div class="side-scroll">
    <SingleCdrz data="{data}" fixedSidebarEnabled="{fixedSidebarEnabled}" />
    {#if $cdrzOptionsStore.compareSideBySide}
      {#each data.additional as { 2020: cdrz, 2010: cdrz2010 }}
        <SingleCdrz
          data="{{ cdrz, cdrz2010, additional: [], tracts: data.tracts }}"
          fixedSidebarEnabled="{fixedSidebarEnabled}"
          showRemoveButton
          hideBackToAll
        />
      {/each}
      <AddSideBySide currentTracts="{data.tracts}" />
    {/if}
  </div>

  {#if fixedSidebarEnabled}
    <Sidebar pageTitleElemVisibleHeight="{pageTitleElemVisibleHeight}" />
  {:else}
    <FloatingSidebar />
  {/if}
</div>

<style>
  .page-content-wrapper {
    display: flex;
    flex-direction: row;
  }

  .side-scroll {
    overflow-x: auto;

    display: flex;
    flex-direction: row;
  }
</style>
