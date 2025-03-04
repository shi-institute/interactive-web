<script lang="ts">
  import { ComboBox } from 'fluent-svelte';
  import { createEventDispatcher, tick } from 'svelte';
  import type { Option } from '.';
  import SelectedOption from './SelectedOption.svelte';

  export let options: Option[] | undefined = undefined;

  /**
   * Disables the field.
   */
  export let disabled = false;

  /**
   * The current value that is selected.
   *
   * If a value is provided without a label and there is a reference definition
   * provided, the component will attempt to populate the label.
   */
  export let selectedOption: Option | null = null;

  /**
   * Instead of showing a selected item preview box,
   * just show the name of the selected item in the dropdown field
   */
  export let showCurrentSelectionOnDropdown = false;

  /**
   * Specifiy whether selected items should be hidden from the options.
   *
   * @default true
   */
  export let hideSelected = true;

  const dispatch = createEventDispatcher<{
    change: Omit<Option, 'disabled' | 'errorMessage' | 'identifier'> | null;
  }>();

  let oldSelectedOption = selectedOption;
  function handleUpdateOption(newOption: Option | null) {
    selectedOption = newOption;

    // don't attempt to dispatch and update if the option is the same
    const isDifferent = JSON.stringify(oldSelectedOption) !== JSON.stringify(newOption);
    if (!isDifferent) return;

    // expose changes to selected options via change event
    if (newOption) {
      const { disabled, errorMessage, identifier, ...propsToDispatch } = newOption || {};
      dispatch('change', propsToDispatch);
    } else {
      dispatch('change', null);
    }

    // finally, update the old selected option
    oldSelectedOption = newOption;
  }

  /**
   * Takes the `selectedOptions` array and converts it to an array of objects
   * accepted by the ComboBox component.
   */
  function toComboboxOption(opt: Option) {
    return {
      ...opt,
      name: opt.label || opt._id,
      value: opt._id,
      disabled: opt.disabled || opt._id === selectedOption?._id,
    };
  }

  let comboBoxWrapperElement: HTMLDivElement;
  let comboBoxOpen = false;
  let comboBoxValue = '';
  let searchValue = '';
</script>

{#if selectedOption && !showCurrentSelectionOnDropdown}
  <div class="selected-option-area">
    <SelectedOption
      _id="{selectedOption._id}"
      label="{selectedOption.label}"
      disabled="{disabled}"
      on:dismiss="{() => {
        handleUpdateOption(null);
      }}"
    />
  </div>
  <!-- When options are provided, we allow selecting from the provided options -->
{:else if options}
  {@const filteredItems = options
    .filter((opt) => (hideSelected ? opt._id !== selectedOption?._id : true))
    .map(toComboboxOption)}
  {#key filteredItems}
    <ComboBox
      class="combobox-cristata"
      items="{filteredItems}"
      placeholder="{showCurrentSelectionOnDropdown && selectedOption
        ? selectedOption.label
        : 'Select...'}"
      disabled="{disabled}"
      on:select="{(evt) => {
        if (!evt.detail) return;

        const { name, value, ...rest } = evt.detail;
        handleUpdateOption({ label: name, _id: value, ...rest });
      }}"
    />
    <div
      bind:this="{comboBoxWrapperElement}"
      on:focusin="{() => {
        const hasFocusedChild = comboBoxWrapperElement.matches(':focus-within:not(:focus)');
        if (hasFocusedChild) comboBoxOpen = true;
      }}"
      on:focusout="{() => {
        const hasFocusedChild = comboBoxWrapperElement.matches(':focus-within:not(:focus)');
        if (!hasFocusedChild) comboBoxOpen = false;
      }}"
    >
      <ComboBox
        bind:open="{comboBoxOpen}"
        bind:value="{comboBoxValue}"
        class="combobox-cristata"
        items="{filteredItems}"
        editable
        disableAutoSelectFromSearch
        disabled="{disabled}"
        noItemsMessage="{!!searchValue ? 'No matches were found' : 'Start typing to view options'}"
        bind:searchValue="{searchValue}"
        on:input="{() => {
          comboBoxOpen = true;
        }}"
        openOnFocus
        placeholder="Select..."
        on:select="{(evt) => {
          if (!evt.detail) return;

          // otherwise, add it to the list
          const { name, value, ...rest } = evt.detail;
          handleUpdateOption({ label: name, _id: value, ...rest });

          // clear the value of the combobox so that the most recently selected item can be removed from the list
          // (the component will re-select the best match based on the value)
          if (!showCurrentSelectionOnDropdown) {
            tick().then(() => {
              // we cannot use an empty string because the component does not act on falsy values
              comboBoxValue = '__internal_empty__';
              searchValue = '';
            });
          }
        }}"
      />
    </div>
  {/key}
{/if}

<style>
  :global(.combobox-cristata) {
    width: 100%;
  }

  .selected-option-area {
    position: relative;
    width: 100%;
  }
  .selected-option-area > :global(.loading-message) {
    position: absolute;
    inset: 6px 10px 0;
  }
  .selected-option-area:has(.loading-message) :global(.selected-item > *) {
    visibility: hidden;
  }
</style>
