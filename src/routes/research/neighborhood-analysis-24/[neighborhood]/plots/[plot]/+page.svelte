<script lang="ts">
  import FullPagePlot from '$lib/plot/FullPagePlot.svelte';

  export let data;
</script>

<FullPagePlot plot="{data.plotConfig}" plotContainer="{{ enablePopup: true }}" />
