<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button, ComboBox, TextBlock } from 'fluent-svelte';
  import { onMount } from 'svelte';
  import scCDRZs from '../sc-cdrzs.json';

  export let currentTracts: string[];

  $: cdrzs = scCDRZs.filter((cdrz) => !currentTracts.includes(cdrz.tract));

  let selectedTract: string | undefined;
  afterNavigate(() => {
    selectedTract = cdrzs?.[0].tract;
  });
  onMount(() => {
    selectedTract = cdrzs?.[0].tract;
  });

  function addTract() {
    goto($page.url.pathname + ',' + selectedTract);
  }
</script>

<div class="wrapper">
  <TextBlock variant="bodyStrong">Add tract</TextBlock>
  <br />
  <TextBlock style="margin-top: 10px;">Select a tract</TextBlock>
  <ComboBox
    style="width: 100%;"
    items="{cdrzs.map((cdrz) => ({
      name: `${cdrz.tract} (${cdrz.nickname || cdrz.places[0].name})`,
      value: cdrz.tract,
    }))}"
    bind:value="{selectedTract}"
  />
  <Button style="margin-top: 10px;" on:click="{addTract}">Add selected tract</Button>
</div>

<style>
  .wrapper {
    padding: 20px;
    width: 240px;
    flex-grow: 0;
    flex-shrink: 0;
  }
</style>
