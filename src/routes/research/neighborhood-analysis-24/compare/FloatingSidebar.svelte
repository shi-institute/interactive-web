<script lang="ts">
  import { Button, IconButton, Tooltip } from 'fluent-svelte';
  import Sidebar from './Sidebar.svelte';
  import { isPanelWrapperOpen } from './isPanelWrapperOpen';

  export let open = false;
  $: {
    // if the panel is open, wait 360 milliseconds before marking is closed
    // to give the wrapper transition enough time to hide the panel and wrapper
    if (open) {
      setTimeout(() => {
        open = $isPanelWrapperOpen;
      }, 360);
    } else {
      open = $isPanelWrapperOpen;
    }
  }

  export let isEmbedded = false;
</script>

{#if open}
  <div class="floating-sidebar-wrapper" class:open="{$isPanelWrapperOpen}">
    <IconButton class="close-icon" on:click="{() => ($isPanelWrapperOpen = false)}">
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
        ></path>
      </svg>
    </IconButton>
    <Sidebar pageTitleElemVisibleHeight="{2}" noBorderLeft />
  </div>
{/if}

{#if !isEmbedded}
  <div class="open-icon-wrapper" class:open="{$isPanelWrapperOpen}">
    <Tooltip text="Open page options" alignment="end">
      <Button on:click="{() => ($isPanelWrapperOpen = true)}" class="expand-button">
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="margin: 0 4px 0 -2px;"
        >
          <path
            d="M15.707 4.293a1 1 0 0 1 0 1.414L9.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z"
          ></path>
        </svg>
        Settings
      </Button>
    </Tooltip>
  </div>
{/if}

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="scrim"
    class:isOpen="{$isPanelWrapperOpen}"
    on:click="{() => ($isPanelWrapperOpen = false)}"
  ></div>
{/if}

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 99;
    background-color: #000000;
    opacity: 0;
    transition: opacity 360ms;
    animation: close-scrim 360ms forwards;
  }
  .scrim.isOpen {
    animation: open-scrim 360ms forwards;
  }
  @keyframes open-scrim {
    0% {
      display: block;
      opacity: 0;
    }
    100% {
      opacity: 0.12;
    }
  }
  @keyframes close-scrim {
    0% {
      display: block;
      opacity: 0.06;
    }
    100% {
      opacity: 0;
      display: none;
    }
  }

  .floating-sidebar-wrapper {
    position: fixed;
    right: 20px;
    top: 20px;
    bottom: 20px;
    width: 320px;
    background-color: var(--fds-solid-background-tertiary);
    border: 1px solid var(--fds-surface-stroke-default);
    border-radius: var(--fds-control-corner-radius);
    transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateX(340px);
    box-shadow: var(--fds-dialog-shadow);
    opacity: 0;
    z-index: 100;
  }
  .floating-sidebar-wrapper.open {
    transform: translateX(0);
    opacity: 1;
  }
  @media (max-width: 500px) {
    .floating-sidebar-wrapper {
      width: 100%;
      inset: 0;
    }
  }

  .floating-sidebar-wrapper :global(.close-icon) {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }

  .open-icon-wrapper {
    position: fixed;
    right: 0;
    bottom: 20px;
    background-color: var(--fds-solid-background-tertiary);
    border: 1px solid var(--fds-surface-stroke-default);
    border-right: none;
    border-radius: var(--fds-control-corner-radius) 0 0 var(--fds-control-corner-radius);
    padding: 2px;
    transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateX(0);
    opacity: 1;
    z-index: 99;
  }
  .open-icon-wrapper.open {
    transform: translateX(40px);
    opacity: 0;
  }

  .open-icon-wrapper :global(.expand-button):not(:hover):not(:active) {
    box-shadow: none !important;
    background-color: transparent !important;
  }
</style>
