<script lang="ts">
  export let type: 'rectangle' | 'rect' | 'square' = 'rectangle';
  export let outline: string;
  export let fill: string = 'transparent';
</script>

<div class="entry" style="--outline: {outline}; --fill: {fill};">
  {#if type === 'rectangle' || type === 'rect'}
    <div class="rect" />
  {/if}
  {#if type === 'square'}
    <div class="square" />
  {/if}
  <p><slot /></p>
</div>

<style>
  .entry {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
  }

  p {
    margin: 0;
    font-size: 14px;
  }

  div.rect {
    display: inline-block;
    border: 2px solid var(--outline);
    background: var(--fill);
    width: 16px;
    height: 10px;
    margin-top: 1px;
  }

  div.square {
    display: inline-block;
    border: 2px solid var(--outline);
    background: var(--fill);
    width: 10px;
    height: 10px;
    margin-top: 1px;
    margin-right: 6px;
  }
</style>
