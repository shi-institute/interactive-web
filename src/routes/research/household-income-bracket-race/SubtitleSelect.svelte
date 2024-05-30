<script lang="ts">
  export let options: string[] = [];
  export let value: string = options[0];
  export let disabled = false;

  let width = 1200;

  function updateSelectWidth(select: HTMLSelectElement) {
    if (select?.options && select.selectedIndex > -1) {
      const option = select.options[select.selectedIndex];
      const span = document.createElement('span');

      span.textContent = option.textContent;

      const ostyles = getComputedStyle(option);
      span.style.fontFamily = ostyles.fontFamily;
      span.style.fontStyle = ostyles.fontStyle;
      span.style.fontWeight = ostyles.fontWeight;
      span.style.fontSize = ostyles.fontSize;

      document.body.appendChild(span);
      select.style.width = span.offsetWidth + (disabled ? 0 : 20) + 'px';
      document.body.removeChild(span);
    }
  }

  let selectElem: HTMLSelectElement;
  $: if (selectElem) {
    disabled; // also re-run when disabled status changes
    updateSelectWidth(selectElem);
  }
</script>

<svelte:window bind:innerWidth="{width}" />

{#if disabled}
  <span class="displayed-option-disabled">{value}</span>
{:else}
  <select
    bind:this="{selectElem}"
    bind:value="{value}"
    on:change="{(evt) => updateSelectWidth(evt.target)}"
    disabled="{disabled}"
  >
    {#each options as option}
      <option value="{option}">{option}</option>
    {/each}
  </select>
  <span style="margin-left: -20px;">▾</span>
{/if}

<style>
  select,
  .displayed-option-disabled {
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    user-select: none;
    color: inherit;
    opacity: 1;
    display: inline-block;

    font-weight: 400;
    font-size: 16px;
    font-family: inherit;
    line-height: 1.15;
    margin-top: 0;
    margin-bottom: 0.25rem;
  }

  select:not([disabled]):hover {
    text-decoration: underline;
  }

  option {
    background-color: var(--fds-solid-background-tertiary);
  }
</style>
