<article>
  <slot />
</article>

<style>
  article {
    margin: 0 auto;
    width: 100%;
    max-width: 800px;
    padding: 0 20px;
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
</style>
