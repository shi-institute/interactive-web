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
    position: relative;
    display: inline-block;
    width: 16px;
    height: 10px;
    margin-top: 1px;
    margin-right: 2px;
  }

  div.rect::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: -2px;
    left: -2px;
    border: 2px solid var(--outline);
    background: var(--fill);
    z-index: 1;
  }

  div.square {
    position: relative;
    display: inline-block;
    border: 2px solid var(--outline);
    background: var(--fill);
    width: 10px;
    height: 10px;
    margin-top: 1px;
    margin-right: 6px;
  }

  div.rect::after {
    content: '';
    background: white;
    position: absolute;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    left: -3px;
    top: -3px;
  }
</style>
