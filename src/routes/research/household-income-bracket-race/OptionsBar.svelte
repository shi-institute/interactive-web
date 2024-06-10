<script lang="ts">
  import { page } from '$app/stores';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
  import { Button, TextBlock, ToggleSwitch } from 'fluent-svelte';
  import { isPanelWrapperOpen } from './isPanelWrapperOpen';

  let windowWidth = 1000;
</script>

<svelte:window bind:innerWidth="{windowWidth}" />

<div class="button-bar">
  <div>
    <TextBlock variant="caption">
      Municipality 1
      {#if windowWidth > 1200}
        (left)
      {:else}
        (top)
      {/if}
    </TextBlock>
    <select bind:value="{$opWonkOptionsStore.city}">
      {#each $page.data.citiesUnique as city}
        <option value="{city}">{city}</option>
      {/each}
    </select>
  </div>

  {#if $opWonkOptionsStore.compare}
    <div>
      <TextBlock variant="caption" class="cdrz-info-sidebar--field-title">
        Municipality 2
        {#if windowWidth > 1200}
          (right)
        {:else}
          (bottom)
        {/if}
      </TextBlock>
      <select bind:value="{$opWonkOptionsStore.city2}">
        {#each $page.data.citiesUnique as city}
          <option value="{city}">{city}</option>
        {/each}
      </select>
    </div>
  {/if}

  <div>
    <TextBlock variant="caption">Year range</TextBlock>
    <select bind:value="{$opWonkOptionsStore.yearsACS}">
      {#each $page.data.acsYearsUnique as yearRange}
        <option value="{yearRange}">{yearRange}</option>
      {/each}
    </select>
  </div>

  <div>
    <Button on:click="{() => ($isPanelWrapperOpen = !$isPanelWrapperOpen)}">
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style="margin-right: 8px;"
      >
        <path
          d="M8.75 13.5a3.251 3.251 0 0 1 3.163 2.498L21.25 16a.75.75 0 0 1 .102 1.493l-.102.007h-9.337a3.251 3.251 0 0 1-6.326 0H2.75a.75.75 0 0 1-.102-1.493L2.75 16h2.837a3.251 3.251 0 0 1 3.163-2.5Zm0 1.5a1.75 1.75 0 0 0-1.652 1.172l-.021.063-.039.148a1.756 1.756 0 0 0 .02.815l.04.13.025.069a1.75 1.75 0 0 0 3.28-.069l.04-.13-.018.06a1.75 1.75 0 0 0 .048-.815l-.03-.137-.02-.07-.047-.134A1.75 1.75 0 0 0 8.75 15Zm6.5-11a3.251 3.251 0 0 1 3.163 2.5h2.837a.75.75 0 0 1 .102 1.493L21.25 8h-2.837a3.251 3.251 0 0 1-6.326 0H2.75a.75.75 0 0 1-.102-1.493L2.75 6.5l9.337-.002A3.251 3.251 0 0 1 15.25 4Zm0 1.5a1.75 1.75 0 0 0-1.652 1.173l-.021.062-.038.148a1.757 1.757 0 0 0 .019.815l.04.13.025.069a1.75 1.75 0 0 0 3.28-.068l.04-.131-.018.06a1.75 1.75 0 0 0 .048-.815l-.03-.137-.02-.07-.047-.134A1.75 1.75 0 0 0 15.25 5.5Z"
          fill="currentColor"
        ></path>
      </svg>
      More options
    </Button>
  </div>

  <div>
    <ToggleSwitch bind:checked="{$opWonkOptionsStore.compare}">
      Compare two municipalities
    </ToggleSwitch>
  </div>
</div>
<div class="options-hint-bar">
  <Button variant="hyperlink" on:click="{() => ($isPanelWrapperOpen = true)}">
    Compare and change municipalities
  </Button>
</div>

<style>
  .button-bar,
  .options-hint-bar {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 10px;
    border-bottom: 1px solid var(--fds-surface-stroke-default);
    gap: 10px;
  }
  .button-bar > div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .button-bar > div:last-of-type {
    flex-grow: 1;
    align-items: flex-end;
  }

  @media (max-width: 950px) {
    .button-bar {
      display: none;
    }
  }
  @media (min-width: 951px) {
    .options-hint-bar {
      display: none;
    }
  }

  select {
    align-items: center;
    border: none;
    border-radius: var(--fds-control-corner-radius);
    box-sizing: border-box;
    cursor: default;
    display: inline-flex;
    font-family: var(--fds-font-family-text);
    font-size: var(--fds-body-font-size);
    font-weight: 400;
    justify-content: center;
    line-height: 20px;
    outline: none;
    padding-block: 4px 6px;
    padding-inline: 11px;
    position: relative;
    text-decoration: none;
    transition: var(--fds-control-faster-duration) ease background;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-clip: padding-box;
    background-color: var(--fds-control-fill-default);
    border: 1px solid;
    border-color: var(--fds-control-border-default);
    color: var(--fds-text-primary);
    width: 100%;
  }
  select:hover {
    background-color: var(--fds-control-fill-secondary);
  }
  select:active {
    background-color: var(--fds-control-fill-tertiary);
    border-color: var(--fds-control-stroke-default);
    color: var(--fds-text-secondary);
  }
  option {
    background-color: var(--fds-solid-background-tertiary);
  }
</style>
