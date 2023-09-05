<script lang="ts">
  export let data;

  $: console.log(data.pageNames)
</script>

<svelte:head>
  <title>Sitemap</title>
</svelte:head>

<h1>Pages on {data.url}</h1>

{#each data.pageNames as pageName}
   <a href={pageName}>{pageName}</a>
{/each}
