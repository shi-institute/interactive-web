<script lang="ts">
  import { page } from '$app/stores';

  $: title = $page.data.currentPage?.attributes?.title;
</script>

<svelte:head>
  {#if title}
    <title>{title} - Guide - Rural Change Diagnostic Screen</title>
  {:else}
    <title>Guide - Rural Change Diagnostic Screen</title>
  {/if}
</svelte:head>

<article>
  {#if title}
    <h1>{title}</h1>
  {/if}

  <slot />
</article>

<style>
  article {
    margin: 0 auto;
    width: 100%;
    max-width: 800px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 1.5;
    padding-bottom: 20px;
  }

  article :global(aside.note) {
    background-color: var(--calcite-color-background-1);
    border: 1px solid var(--calcite-color-border-1);
    padding: 10px;
    margin: 20px 0;
  }
  article :global(aside.note::before) {
    content: 'Note';
    font-weight: bold;
    color: var(--calcite-color-text-2);
    display: block;
    margin-bottom: 10px;
  }

  article :global(p) {
    margin-top: 0;
    margin-bottom: 10px;
  }

  article :global(h1) {
    font-size: 24px;
    margin-bottom: 0;
  }

  article :global(h2) {
    font-size: 20px;
    margin-bottom: 0;
  }

  article :global(h3) {
    font-size: 18px;
    margin-bottom: 0;
  }
</style>
