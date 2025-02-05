<script lang="ts">
  export let data;
</script>

{#if data.neighborhood && data.neighborhoodsData}
  <pre>{JSON.stringify(
      data.neighborhoodsData.filter(
        (d) => d.neighborhood_name.toLowerCase() === data.neighborhood.toLowerCase()
      ),
      null,
      2
    )}</pre>
{:else}
  <pre>{JSON.stringify(
      data.tractsData.filter((d) => d.tract_id === data.tract),
      null,
      2
    )}</pre>
{/if}
