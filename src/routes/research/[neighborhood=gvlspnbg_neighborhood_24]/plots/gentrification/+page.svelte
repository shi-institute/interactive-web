<script lang="ts">
  import GentrificationPlots from './GentrificationPlots.svelte';

  export let data;
</script>

<GentrificationPlots data="{data.gentrificationData}" neighborhood="{data.neighborhood}" />
