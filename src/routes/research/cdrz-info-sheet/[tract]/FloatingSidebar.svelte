<script>
  import { IconButton, Tooltip } from 'fluent-svelte';
  import Sidebar from './Sidebar.svelte';

  export let open = false;
</script>

<div class="floating-sidebar-wrapper" class:open="{open}">
  <IconButton class="close-icon" on:click="{() => (open = false)}">
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
      ></path>
    </svg>
  </IconButton>
  <Sidebar pageTitleElemVisibleHeight="{2}" noBorderLeft />
</div>

<div class="open-icon-wrapper" class:open="{open}">
  <Tooltip text="Open page options" alignment="end">
    <IconButton class="open-icon" on:click="{() => (open = true)}">
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.707 4.293a1 1 0 0 1 0 1.414L9.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z"
        ></path>
      </svg>
    </IconButton>
  </Tooltip>
</div>

<style>
  .floating-sidebar-wrapper {
    position: fixed;
    right: 20px;
    top: 20px;
    bottom: 20px;
    width: 300px;
    background-color: var(--fds-solid-background-tertiary);
    border: 1px solid var(--fds-surface-stroke-default);
    border-radius: var(--fds-control-corner-radius);
    transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateX(340px);
    box-shadow: var(--fds-dialog-shadow);
    opacity: 0;
  }
  .floating-sidebar-wrapper.open {
    transform: translateX(0);
    opacity: 1;
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
  }
  .open-icon-wrapper.open {
    transform: translateX(40px);
    opacity: 0;
  }
</style>
