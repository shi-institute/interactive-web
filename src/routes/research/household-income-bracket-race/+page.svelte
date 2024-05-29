<script>
  import { colors } from '$lib/colors';
  import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
  import { Button } from 'fluent-svelte';
  import FloatingSidebar from './FloatingSidebar.svelte';
  import Legend from './Legend.svelte';
  import SubtitleSelect from './SubtitleSelect.svelte';

  export let data;
  $: ({ tidyDataAllYears, acsYearsUnique, citiesUnique } = data);
</script>

<FloatingSidebar />

<div class="header">
  <h1>Households by income bracket and race</h1>
  <div class="buttons">
    {#if $opWonkOptionsStore.compare}
      <Button on:click="{() => ($opWonkOptionsStore.compare = false)}">
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6.25A2.25 2.25 0 0 1 4.25 4h15.5A2.25 2.25 0 0 1 22 6.25v11.5A2.25 2.25 0 0 1 19.75 20H4.25A2.25 2.25 0 0 1 2 17.75V6.25Zm2.25-.75a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V6.25a.75.75 0 0 0-.75-.75H4.25Z"
            fill="#ffffff"
          ></path>
          <path
            d="M8.22 8.215a.75.75 0 0 1 1.06 0l2.72 2.72 2.725-2.716a.75.75 0 0 1 1.06 1.062l-2.724 2.715 2.724 2.724a.75.75 0 1 1-1.06 1.06L12 13.057 9.28 15.78a.75.75 0 0 1-1.06-1.06l2.72-2.724-2.72-2.72a.75.75 0 0 1 0-1.06Z"
            fill="#ffffff"
          ></path>
        </svg>
        Stop compare
      </Button>
    {:else}
      <Button on:click="{() => ($opWonkOptionsStore.compare = true)}">
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.31 10.248a.75.75 0 1 0-1.12-.997l-2 2.25a.75.75 0 0 0 0 .997l2 2.25a.75.75 0 1 0 1.12-.996l-.89-1.002h9.16l-.89 1.002a.75.75 0 1 0 1.12.996l2-2.25.01-.012a.747.747 0 0 0-.012-.987L16.81 9.251a.75.75 0 1 0-1.12.997l.89 1.002H7.42l.89-1.002Z"
            fill="#ffffff"
          ></path>
          <path
            d="M12.754 4.001v.002h7.498c.966 0 1.75.784 1.75 1.75v12.495a1.75 1.75 0 0 1-1.75 1.75h-8.998v-.002H3.757a1.75 1.75 0 0 1-1.75-1.75V5.751c0-.967.783-1.75 1.75-1.75h8.997Zm7.498 1.502h-7.498V10.5h-1.5V5.5H3.757a.25.25 0 0 0-.25.25v12.495c0 .138.112.25.25.25h7.497V13.5h1.5v4.998h7.498a.25.25 0 0 0 .25-.25V5.754a.25.25 0 0 0-.25-.25Z"
            fill="#ffffff"
          ></path>
        </svg>
        Compare
      </Button>
    {/if}
  </div>
</div>

<div class="figures">
  <div class="figure">
    <div class="subtitle">
      <SubtitleSelect options="{citiesUnique}" bind:value="{$opWonkOptionsStore.city}" />
      &nbsp;·&nbsp;&nbsp;
      <SubtitleSelect options="{acsYearsUnique}" bind:value="{$opWonkOptionsStore.yearsACS}" />
      <Legend />
    </div>
  </div>
  {#if $opWonkOptionsStore.compare}
    <div class="figure">
      <div class="subtitle">
        <SubtitleSelect options="{citiesUnique}" bind:value="{$opWonkOptionsStore.city2}" />
        &nbsp;·&nbsp;&nbsp;
        <SubtitleSelect
          options="{acsYearsUnique}"
          bind:value="{$opWonkOptionsStore.yearsACS}"
          disabled
        />
        <Legend />
      </div>
    </div>
  {/if}
</div>

<style>
  .header {
    position: relative;
    padding: 10px 20px 0 20px;
  }

  h1 {
    font-weight: 600;
    font-size: 24px;
    font-variant: lining-nums;
    margin-bottom: 0px;
  }

  .subtitle {
    user-select: none;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 140px;
    justify-content: right;
    gap: 6px;
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .buttons svg {
    margin-right: 6px;
  }

  .figures {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 1200px) {
    .figures {
      flex-direction: column;
    }
  }

  .figure {
    min-height: 400px;
    flex-grow: 1;
    --border-color: var(--fds-surface-stroke-default);
    --padding: 30px;
  }

  @media (min-width: 1201px) {
    .figure:nth-of-type(2) {
      border-left: 1px solid var(--border-color);
      padding-left: var(--padding);
      margin-left: var(--padding);
    }
  }
  @media (max-width: 1200px) {
    .figure:nth-of-type(2) {
      border-top: 1px solid var(--border-color);
      padding-top: var(--padding);
      margin-top: var(--padding);
    }
  }
</style>
