<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';

  export let data;
</script>

<svelte:head>
  <title>CDRZ Info Sheets</title>
</svelte:head>

<PageTitle>
  Climate Disaster Resilience Zone (CDRZ) info sheets
  <svelte:fragment slot="caption">South Carolina</svelte:fragment>
</PageTitle>

<ul>
  {#each data.cdrzs as cdrz}
    <a href="/cdrz-info-sheet/{cdrz.tract}"><li>{cdrz.tract} ({cdrz.places[0].name})</li></a>
  {/each}
</ul>
