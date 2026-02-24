<script lang="ts">
  import { goto } from '$app/navigation';

  function handleClick(evt: MouseEvent & { target?: HTMLAnchorElement }) {
    evt.preventDefault();
    goto(evt.target?.href);
  }
</script>

<div class="content">
  <h2>Get started</h2>
  <div class="grid-l1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <calcite-tile
      icon="map"
      heading="Explore the map tool"
      description="Explore the data and perform analyses"
      scale="l"
      href="/research/rural-change-diagnostic-screen/map"
      on:click="{handleClick}"
    ></calcite-tile>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <calcite-tile
      icon="open-book"
      heading="View the guide"
      description="Learn how to use the tool"
      scale="l"
      href="/research/rural-change-diagnostic-screen/guide"
      on:click="{handleClick}"
    ></calcite-tile>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <calcite-tile
      icon="article"
      heading="Read the research brief"
      description=""
      scale="l"
      href="/research/rural-change-diagnostic-screen/brief"
      on:click="{handleClick}"
    ></calcite-tile>
  </div>
</div>

<style>
  .content {
    padding: 10px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }
  .grid-l1 {
    display: grid;
    grid-template-columns: 3fr 2fr 2fr;
  }
</style>
