<script lang="ts">
  import { page } from '$app/stores';
  import selectedThemeMode from '$stores/selectedThemeMode';
  import { hasKey } from '$utils';
  import { Button, IconButton } from 'fluent-svelte';
  import ThemeSwitchButton from './ThemeSwitchButton.svelte';

  export let actions: (
    | { href: string; target: string; label: string }
    | { onClick: () => void; label: string }
  )[] = [];
  export let actionStyle = 'padding: 2px 10px; font-size: 12px; color: var(--fds-text-secondary);';

  function toggleTheme() {
    selectedThemeMode.update((mode) => {
      if (mode === 'light') return 'dark';
      if (mode === 'dark') return 'auto';
      return 'light';
    });
  }
</script>

<div class="embed-bar">
  <div>Shi Applied Research</div>
  <div style="display: flex; flex-direction: row;">
    <ThemeSwitchButton style="{actionStyle} min-block-size: 20px;" />
    <Button variant="hyperlink" style="{actionStyle}" href="{$page.url.pathname}" target="_blank">
      Open in new tab
    </Button>
    {#each actions as action}
      {#if hasKey(action, 'href')}
        <Button
          variant="hyperlink"
          style="{actionStyle}"
          href="{action.href}"
          target="{action.target || '_blank'}"
        >
          {action.label}
        </Button>
      {:else}
        <Button variant="hyperlink" style="{actionStyle}" on:click="{action.onClick}">
          {action.label}
        </Button>
      {/if}
    {/each}
  </div>
</div>

<style>
  .embed-bar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--fds-solid-background-tertiary);
    border-top: 1px solid var(--fds-surface-stroke-default);
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--fds-text-tertiary);
  }
</style>
