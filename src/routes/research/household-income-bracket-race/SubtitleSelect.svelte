<script lang="ts">
  import { MenuFlyout, MenuFlyoutItem } from 'fluent-svelte';

  export let options: string[] = [];
  export let value: string = options[0];
  export let disabled = false;
</script>

<MenuFlyout alignment="start" placement="bottom">
  <button class="subtitle-dropdown-button" disabled="{disabled}">
    {value}
    {disabled ? '' : '▾'}
  </button>
  <svelte:fragment slot="flyout">
    {#each options as option}
      <MenuFlyoutItem selected="{value === option}" on:click="{() => (value = option)}">
        <span>{option}</span>
      </MenuFlyoutItem>
    {/each}
  </svelte:fragment>
</MenuFlyout>

<style>
  button {
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    user-select: none;
    color: inherit;

    font-weight: 400;
    font-size: 16px;
    font-family: inherit;
    line-height: 1.15;
    margin-top: 0;
    margin-bottom: 0.25rem;
  }

  button:not([disabled]):hover {
    text-decoration: underline;
  }
</style>
