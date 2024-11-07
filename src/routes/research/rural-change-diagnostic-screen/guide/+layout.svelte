<script lang="ts">
  import { page } from '$app/stores';
  import { hasKey } from '$utils';

  export let data;

  $: title = $page.data.currentPage?.attributes?.title;
</script>

<svelte:head>
  {#if title}
    <title>{title} - Guide - Rural Change Diagnostic Screen</title>
  {:else}
    <title>Guide - Rural Change Diagnostic Screen</title>
  {/if}
</svelte:head>

<div class="grid">
  <nav>
    <ul>
      <li>
        <a href="/research/rural-change-diagnostic-screen/guide">
          <span class="title">Home</span>
          <span class="caption">How to use this tool</span>
        </a>
      </li>
      {#each data.docsPageData as { pathname, attributes }}
        {#if attributes.title || attributes.short_title}
          <li>
            <a href="{pathname}">
              <span class="title">{attributes.short_title || attributes.title}</span>
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>

  <div class="article">
    <article>
      {#if title}
        <h1>{title}</h1>
      {/if}

      <slot />
    </article>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 240px 1fr;
    height: 100%;
  }

  @media (max-width: 800px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  nav {
    border-right: 1px solid var(--calcite-navigation-border-color, var(--calcite-color-border-3));
  }

  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    user-select: none;
  }

  nav li {
    border-bottom: 1px solid var(--calcite-navigation-border-color, var(--calcite-color-border-3));
  }

  nav li a {
    display: block;
    padding: 10px 20px;
    color: var(--calcite-color-text-1);
    text-decoration: none;
  }

  nav li:hover a span.title {
    text-decoration: underline;
  }

  nav li:hover {
    background-color: var(--calcite-color-foreground-2);
  }

  nav li:active {
    background-color: var(--calcite-color-foreground-3);
  }

  nav li a span.caption {
    font-size: 12px;
    font-style: italic;
    color: var(--calcite-color-text-3);
    display: block;
    text-decoration: none;
  }

  .article {
    overflow: auto;
  }

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

  article :global(h4) {
    margin-bottom: 0;
  }
</style>
