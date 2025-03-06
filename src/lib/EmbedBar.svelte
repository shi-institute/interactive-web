<script lang="ts">
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import { hasKey } from '$utils';
  import { Button } from 'fluent-svelte';
  import ThemeSwitchButton from './ThemeSwitchButton.svelte';

  export let actions: (
    | { href: string; target: string; label: string }
    | { onClick: () => void; label: string }
  )[] = [];
  export let actionStyle = 'padding: 2px 10px; font-size: 12px; color: var(--fds-text-secondary);';
</script>

<div class="embed-bar">
  <div>
    {#if $page.data.isDeployedPreview}
      <span class="preview">Deployment Preview</span>
    {:else if dev}
      <span class="preview">Dev</span>
    {/if}
    <span>Shi Applied Research</span>
  </div>
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

  .preview {
    background-color: var(--fds-accent-default);
    color: var(--fds-text-on-accent-primary);
    padding: 1px 10px;
    font-weight: 500;
    font-size: 12px;
    font-family: var(--fds-font-family-text);
    border-radius: 12px;
    margin: 0 10px 0 -10px;
    user-select: none;
  }
</style>
