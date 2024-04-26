<script lang="ts">
  export let data;

  $: console.log(data.pageNames);
</script>

<svelte:head>
  <title>Sitemap</title>
</svelte:head>

<h1>Pages on {data.url}</h1>

<ul>
  <!-- list all non-dynanmic routes -->
  {#each data.pageNames.filter((pageName) => !pageName.includes('[')) as pageName}
    <li><a href="/research{pageName}">{pageName}</a></li>
  {/each}
</ul>
