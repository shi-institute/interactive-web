<script lang="ts">
  import { diffArray } from 'array-differences';
  import { ComboBox, TextBox, TextBoxButton } from 'fluent-svelte';
  import { createEventDispatcher, tick } from 'svelte';
  import type { Option } from '.';
  import SelectedOptions from './SelectedOptions.svelte';

  export let options: Option[] | undefined = undefined;
  export let hideIds = false;

  /**
   * Disables the field.
   */
  export let disabled = false;

  /**
   * The current values that are selected.
   *
   * If a value is provided without a label or it is missing fields are
   * are included in `reference.forceLoadFields` and there is a reference
   * definition provided, the component will attempt to populate the label
   * when a drag operation is not in progess.
   */
  export let selectedOptions: Option[] = [];
  $: if (!Array.isArray(selectedOptions)) selectedOptions = [];

  const dispatch = createEventDispatcher<{
    change: Omit<Option, 'disabled' | 'errorMessage' | 'identifier'>[];
  }>();

  let oldSelectedOptions = selectedOptions;
  function handleDragFinalize(evt: CustomEvent<Option[]> | Option[]) {
    const newOptions = Array.isArray(evt) ? evt : evt.detail;
    selectedOptions = newOptions;

    // calculate the difference between the old options and the new options
    // so that a ydoc transaction can be created that only contains
    // the exact differences
    const diff = diffArray(oldSelectedOptions, newOptions || selectedOptions);
    if (diff.length === 0) return;

    // expose changes to selected options via change event
    if (!newOptions.some((opt) => opt.isDndShadowItem)) {
      const dispatchableNewOptions = newOptions.map((newOption) => {
        const { disabled, errorMessage, identifier, ...propsToDispatch } = newOption;
        return propsToDispatch;
      });
      dispatch('change', dispatchableNewOptions);
    }

    // finally, update the old selected options
    oldSelectedOptions = newOptions || selectedOptions;
  }

  /**
   * The value inside the textbox that is displayed
   * when any value is allowed (instead of a set of options)
   */
  let textBoxValue = '';
  function handleTextKeyDown(evt: KeyboardEvent) {
    if (evt.key === 'Enter') {
      addTextValues(textBoxValue);
      textBoxValue = '';
    }
    if (evt.key === 'Esc') {
      textBoxValue = '';
    }
  }
  function addTextValues(textValue: string) {
    if (textValue.includes(';')) {
      const currentKeys = selectedOptions.map((val) => val._id);
      const newKeys = Array.from(
        // put in set so duplicates are removed
        new Set(
          textValue
            .split(';')
            .map((value) => value.trim())
            // prevent keys that already exist in `currentKeys`
            .filter((newKey) => currentKeys.every((currentKey) => currentKey !== newKey))
        )
      );

      handleDragFinalize([
        ...selectedOptions,
        ...newKeys.map((value) => ({ label: value, _id: value })),
      ]);
    } else if (textValue.includes(',')) {
      const currentKeys = selectedOptions.map((val) => val._id);
      const newKeys = Array.from(
        // put in set so duplicates are removed
        new Set(
          textValue
            .split(',')
            .map((value) => value.trim())
            // prevent keys that already exist in `currentKeys`
            .filter((newKey) => currentKeys.every((currentKey) => currentKey !== newKey))
        )
      );

      handleDragFinalize([
        ...selectedOptions,
        ...newKeys.map((value) => ({ label: value, _id: value })),
      ]);
    } else {
      handleDragFinalize([...selectedOptions, { label: textValue, _id: textValue }]);
    }

    // also update the shared type value
    handleDragFinalize(selectedOptions);
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
      disabled: opt.disabled,
    };
  }

  let comboBoxWrapperElement: HTMLDivElement;
  let comboBoxOpen = false;
  let comboBoxValue = '';
  let searchValue = '';
</script>

<!--
@component
Creates a multi-select dropdown/combobox.

The `on:change` event occurs when the text input changes.
The `on:select` event occurs when the selected values change. It fires upon selection and deselection.
-->

<!-- When a reference is provided, we search from reference docs to generate the options -->
{#if options}
  {@const filteredItems = options
    .filter((opt) => !selectedOptions.map(({ _id }) => _id).includes(opt._id))
    .filter(
      (opt) =>
        opt.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
        opt._id.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map(toComboboxOption)}
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

        // if the value is already selected, do not add it to the list of selected values
        if (selectedOptions.find(({ _id }) => evt.detail.value === _id)) return;

        // otherwise, add it to the list
        const { name, value, ...rest } = evt.detail;

        // and update the shared type value
        handleDragFinalize([
          ...selectedOptions,
          {
            _id: value,
            ...rest,
            label: name,
            disabled: evt.detail.disabled,
          },
        ]);

        // clear the value of the combobox so that the most recently selected item can be removed from the list
        // (the component will re-select the best match based on the value)
        tick().then(() => {
          // we cannot use an empty string because the component does not act on falsy values
          comboBoxValue = '__internal_empty__';
          searchValue = '';
        });
      }}"
    />
  </div>
{:else}
  <TextBox
    placeholder="Type a value and then click the arrow"
    bind:value="{textBoxValue}"
    on:keydown="{handleTextKeyDown}"
    disabled="{disabled}"
  >
    <svelte:fragment slot="buttons">
      <TextBoxButton
        on:click="{() => {
          addTextValues(textBoxValue);
          textBoxValue = '';
        }}"
      >
        <svg
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.704 4.284a1 1 0 1 0-1.403 1.424L17.67 11H4a1 1 0 1 0 0 2h13.665L12.3 18.285a1 1 0 0 0 1.403 1.424l6.925-6.822a1.25 1.25 0 0 0 0-1.78l-6.925-6.823Z"
            fill="currentColor"
          ></path>
        </svg>
      </TextBoxButton>
    </svelte:fragment>
  </TextBox>
{/if}

<SelectedOptions
  bind:selectedOptions="{selectedOptions}"
  disabled="{disabled}"
  options="{options}"
  on:dragfinalize="{handleDragFinalize}"
  on:dismiss="{handleDragFinalize}"
  on:dismissall="{handleDragFinalize}"
  hideIds="{hideIds}"
/>

<style>
  :global(.combobox-cristata) {
    width: 100%;
  }

  /* :global(.combobox-cristata > ul) {
    --fds-menu-offset: 0 !important;
  } */
</style>
