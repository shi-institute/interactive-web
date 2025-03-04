<script lang="ts">
  import { IconButton } from 'fluent-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    startdrag: (MouseEvent | TouchEvent) & {
      currentTarget: EventTarget & HTMLDivElement;
    };
    dismiss: undefined;
  }>();

  export let label: string | undefined;
  export let _id: string;
  /** @deprecated */
  export let status: 'published' | 'draft' | 'modified' | undefined = undefined;

  export let disabled = false;

  export let draggable = false;
  export let dragging = false;

  export let hideId: boolean | undefined = undefined;
  $: implicitHideId = (label === undefined || label == _id) && status === undefined;

  let idElement: HTMLDivElement;
  let isTruncated = false;
  $: if (idElement) {
    isTruncated = idElement.scrollWidth > idElement.clientWidth;
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="selected-item" on:keydown on:focus on:blur on:mousedown on:touchstart>
  <div
    style="display: flex;"
    on:mousedown="{(evt) => dispatch('startdrag', evt)}"
    on:touchstart="{(evt) => dispatch('startdrag', evt)}"
  >
    {#if draggable}
      <IconButton
        tabindex="{-1}"
        aria-label="drag-handle"
        style="padding: 0; {disabled
          ? 'cursor: default;'
          : dragging
          ? 'cursor: grab;'
          : 'cursor: grabbing;'}"
        disabled="{disabled}"
      >
        <svg
          width="30"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style="height: 100%;width: 100%;"
          viewBox="0 0 42 24"
        >
          <path
            style=""
            d="M15.75 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0-7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0-7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0-7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          ></path>
        </svg>
      </IconButton>
    {/if}
  </div>
  <div class="select-item-detail" class:draggable="{draggable}">
    <div class="selected-item-label">
      {label || _id}
    </div>
    {#if (hideId ?? implicitHideId) == false}
      <div class="selected-item-id" bind:this="{idElement}" title="{isTruncated ? _id : ''}">
        {_id}
      </div>
    {/if}
  </div>
  <IconButton
    disabled="{disabled}"
    on:click="{() => {
      if (!disabled) {
        dispatch('dismiss');
      }
    }}"
  >
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
      ></path>
    </svg>
  </IconButton>
</div>

<style>
  .selected-item {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    margin-top: 6px;
    background-color: var(--fds-card-background-default);
    box-shadow: inset 0 0 0 1px var(--fds-control-stroke-default);
    border-radius: var(--fds-control-corner-radius);
  }

  .selected-item:focus-visible {
    outline: none;
    box-shadow: var(--fds-focus-stroke);
  }

  .select-item-detail {
    --drag-handle-width: 0;
    --close-button-width: 30px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    flex-grow: 1;
    width: calc(100% - var(--drag-handle-width) - var(--close-button-width));
    box-sizing: border-box;
  }
  .select-item-detail.draggable {
    --drag-handle-width: 30px;
  }

  .selected-item-label {
    font-family: var(--fds-font-family-text);
    font-size: 14px;
    font-variant-numeric: lining-nums;
    line-height: 16px;
    flex-wrap: nowrap;
    word-break: break-word;
    color: var(--fds-text-primary);
    position: relative;
  }

  .selected-item-id {
    font-family: var(--fds-font-family-text);
    font-size: 11px;
    font-variant-numeric: lining-nums;
    line-height: 16px;
    flex-wrap: nowrap;
    color: var(--fds-text-secondary);
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
