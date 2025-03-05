<script lang="ts">
  import { browser } from '$app/environment';
  import { debounce, hasKey } from '$utils';
  import { downloadCanvas, getElementCanvas } from '$utils/downloadElement';
  import Panzoom, { type PanzoomObject } from '@panzoom/panzoom';
  import {
    Button,
    Checkbox,
    IconButton,
    MenuFlyout,
    MenuFlyoutItem,
    ProgressRing,
    TextBox,
    Tooltip,
  } from 'fluent-svelte';
  import { isNumber, isObjectLike } from 'is-what';
  import { type ComponentEvents, createEventDispatcher } from 'svelte';
  import { FieldWrapper } from '../FieldWrapper';
  import SelectOne from '../Select/SelectOne.svelte';

  const dispatch = createEventDispatcher<{ close: void }>();

  const formatOptions = [
    { _id: 'image/png', label: 'Image - PNG' },
    { _id: 'image/jpeg', label: 'Image - JPEG' },
    { _id: 'image/webp', label: 'Image - WebP' },
  ] as const;
  type Format = (typeof formatOptions)[number]['_id'];

  export let application: string;
  export let fileName: string;
  export let popupWindow: Window | null;

  let format: Format | undefined = 'image/png';
  export let width = 800;
  export let height = 500;
  export let padding = 20;
  let dpiMultiplier = 4;

  let slotElem: HTMLDivElement | undefined = undefined;
  let renderedPreviewContainerElem: HTMLDivElement | undefined = undefined;
  let canvas: HTMLCanvasElement | undefined = undefined;
  let panzoom: PanzoomObject | undefined = undefined;
  let previewLoading = false;
  let panning = false;
  let panX = 0;
  let panY = 0;
  let scale = 1;
  async function renderPreview(element: HTMLElement, width: number, dpiMultiplier: number) {
    if (!browser) return;

    previewLoading = true;

    canvas = await getElementCanvas(element, width, dpiMultiplier);
    if (renderedPreviewContainerElem) {
      renderedPreviewContainerElem.innerHTML = '';
      renderedPreviewContainerElem.appendChild(canvas);
    }

    previewLoading = false;

    if (renderedPreviewContainerElem && canvas) {
      // add panning and zooming capabilities
      let PanZoom = Panzoom;
      if (popupWindow && hasKey(popupWindow, 'Panzoom')) {
        PanZoom = popupWindow.Panzoom as typeof Panzoom;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      panzoom = PanZoom(canvas, { canvas: true, maxScale: 20, minScale: 0.5 });
      renderedPreviewContainerElem.addEventListener('wheel', panzoom.zoomWithWheel);

      // track panning state
      renderedPreviewContainerElem.addEventListener('pointerdown', () => (panning = true));
      renderedPreviewContainerElem.ownerDocument.addEventListener(
        'pointerup',
        () => (panning = false)
      );

      // track panning offset scale
      canvas.addEventListener('panzoomchange', (evt) => {
        if (evt && hasKey(evt, 'detail') && isObjectLike(evt.detail)) {
          if (isNumber(evt.detail.x)) panX = evt.detail.x;
          if (isNumber(evt.detail.y)) panY = evt.detail.y;
          if (isNumber(evt.detail.scale)) scale = evt.detail.scale;
        }
      });
    }
  }
  const renderPreviewDebounced = debounce(renderPreview, 1000);

  $: if (browser && slotElem && $$slots.default) {
    height;
    padding;
    renderPreviewDebounced(slotElem, width, dpiMultiplier);
  }

  let saveOptionsOpen = false;

  let downloading = false;
  function download() {
    if (canvas) {
      downloading = true;
      downloadCanvas(canvas, fileName, format).finally(() => {
        999;
        downloading = false;
        close();
      });
    }
  }

  let copying = false;
  function copyToClipboard() {
    if (canvas && popupWindow) {
      copying = true;
      canvas.toBlob((blob) => {
        if (blob) {
          popupWindow.navigator.clipboard
            .write([
              new ClipboardItem({
                'image/png': blob,
              }),
            ])
            .finally(() => {
              copying = false;
            });
        }
      });
    }
  }

  function handleSelectFormat(evt: ComponentEvents<SelectOne>['change']) {
    const validFormats: string[] = formatOptions.map((f) => f._id);
    const newFormat = evt.detail?._id;
    if (newFormat) {
      const isValidFormat = validFormats.includes(newFormat);
      if (isValidFormat) format = newFormat as Format;
    }
  }

  function close() {
    dispatch('close');
  }
</script>

<main>
  <h1>{application} - Export</h1>

  <div class="settings">
    <FieldWrapper label="Format" forId="format">
      <SelectOne
        selectedOption="{formatOptions.find((f) => f._id === format)}"
        options="{JSON.parse(JSON.stringify(formatOptions))}"
        showCurrentSelectionOnDropdown
        hideSelected="{false}"
        on:change="{handleSelectFormat}"
      />
    </FieldWrapper>

    <FieldWrapper label="Width" forId="width">
      <TextBox forId="width" type="number" bind:value="{width}" />
    </FieldWrapper>

    <FieldWrapper label="Height" forId="height">
      <TextBox forId="height" type="number" bind:value="{height}" />
    </FieldWrapper>

    <FieldWrapper label="Margins" forId="padding">
      <TextBox forId="padding" type="number" bind:value="{padding}" clearButton="{false}" />
    </FieldWrapper>

    <FieldWrapper label="DPI multiplier" forId="dpiMultiplier">
      <TextBox forId="dpiMultiplier" type="number" bind:value="{dpiMultiplier}" />
    </FieldWrapper>
  </div>

  <div class="preview-tools">
    <div style="display: flex; gap: 6px; margin-right: 30px;">
      <Tooltip text="Zoom out" placement="top" alignment="center" offset="{0}">
        <IconButton
          on:click="{() => panzoom?.zoom(scale - 0.25, { animate: true })}"
          aria-label="Reset zoom"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.75 9.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5h5.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10Zm-13 0a5.75 5.75 0 1 1 11.5 0 5.75 5.75 0 0 1-11.5 0Z"
              fill="currentColor"
            ></path>
          </svg>
        </IconButton>
      </Tooltip>
      <div class="text-box-container" style="width: 64px; height: 30px;">
        <input
          type="text"
          class="text-box"
          value="{parseInt(`${scale * 100}`)}%"
          style="text-align: center;"
          on:blur="{(evt) => {
            if (panzoom) {
              const scaleInputNumber = parseFloat(evt.currentTarget.value.replace('%', ''));
              if (!isNaN(scaleInputNumber) && scaleInputNumber !== scale) {
                panzoom.zoom(scaleInputNumber / 100, { animate: true });
              }
            }
          }}"
        />
        <div class="text-box-underline"></div>
      </div>
      <Tooltip text="Zoom in" placement="top" alignment="center" offset="{0}">
        <IconButton
          on:click="{() => panzoom?.zoom(scale + 0.25, { animate: true })}"
          aria-label="Reset zoom"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 10a.75.75 0 0 0-.75-.75h-2v-2a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 1 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 .75-.75Z"
              fill="currentColor"
            ></path>
            <path
              d="M10 2.75a7.25 7.25 0 0 1 5.63 11.819l4.9 4.9a.75.75 0 0 1-.976 1.134l-.084-.073-4.901-4.9A7.25 7.25 0 1 1 10 2.75Zm0 1.5a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5Z"
              fill="currentColor"
            ></path>
          </svg>
        </IconButton>
      </Tooltip>
    </div>
    <Tooltip text="Reset preview zoom" placement="top" alignment="center" offset="{0}">
      <IconButton on:click="{() => panzoom?.reset()}" aria-label="Reset zoom">
        <svg
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.25 4A3.75 3.75 0 0 1 22 7.75v8.5A3.75 3.75 0 0 1 18.25 20H5.75A3.75 3.75 0 0 1 2 16.25v-8.5A3.75 3.75 0 0 1 5.75 4h12.5Zm0 1.5H5.75A2.25 2.25 0 0 0 3.5 7.75v8.5a2.25 2.25 0 0 0 2.25 2.25h12.5a2.25 2.25 0 0 0 2.25-2.25v-8.5a2.25 2.25 0 0 0-2.25-2.25Zm0 7.5a.75.75 0 0 1 .75.75V15a2 2 0 0 1-2 2h-1.25a.75.75 0 0 1 0-1.5H17a.5.5 0 0 0 .5-.5v-1.25a.75.75 0 0 1 .75-.75Zm-12.5 0a.75.75 0 0 1 .75.75V15a.5.5 0 0 0 .5.5h1.25a.75.75 0 0 1 0 1.5H7a2 2 0 0 1-2-2v-1.25a.75.75 0 0 1 .75-.75ZM7 7h1.25a.75.75 0 0 1 .102 1.493L8.25 8.5H7a.5.5 0 0 0-.492.41L6.5 9v1.25a.75.75 0 0 1-1.493.102L5 10.25V9a2 2 0 0 1 1.85-1.995L7 7Zm10 0a2 2 0 0 1 2 2v1.25a.75.75 0 0 1-1.5 0V9a.5.5 0 0 0-.5-.5h-1.25a.75.75 0 0 1 0-1.5H17Z"
            fill="currentColor"
          ></path>
        </svg>
      </IconButton>
    </Tooltip>
  </div>

  <div class="preview">
    {#if $$slots.default}
      <div
        class="rendered-preview"
        bind:this="{renderedPreviewContainerElem}"
        class:panning="{panning}"
      ></div>
      {#if previewLoading || !canvas}
        <div class="loading">
          <ProgressRing style="--fds-accent-default: currentColor;" />
          Please wait
        </div>
      {/if}
    {:else}
      This page or element does not support print preview
    {/if}
  </div>
</main>

<div class="footer">
  <div>
    <!-- <Checkbox>Remember my preferences</Checkbox> -->
  </div>
  <div class="buttons">
    <div class="save-and-more-button button style-standard">
      <Button
        on:click="{download}"
        disabled="{downloading || copying || previewLoading || !canvas}"
        class="save-button"
      >
        {#if downloading || copying}
          <ProgressRing style="--fds-accent-default: currentColor;" size="{16}" />
        {:else}
          Save
        {/if}
      </Button>
      <Button class="chevron-button" on:click="{() => (saveOptionsOpen = !saveOptionsOpen)}">
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.22 8.47a.75.75 0 0 1 1.06 0L12 15.19l6.72-6.72a.75.75 0 1 1 1.06 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L4.22 9.53a.75.75 0 0 1 0-1.06Z"
            fill="currentColor"
          ></path>
        </svg>
      </Button>
      <MenuFlyout bind:open="{saveOptionsOpen}" offset="{14}" alignment="end">
        <svelte:fragment slot="flyout">
          <MenuFlyoutItem
            on:click="{download}"
            disabled="{downloading || copying || previewLoading || !canvas}"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              slot="icon"
            >
              <path
                d="M5.75 3A2.75 2.75 0 0 0 3 5.75v12.5A2.75 2.75 0 0 0 5.75 21h4.249a2.112 2.112 0 0 1 .062-.593l.227-.907H7.5v-5.25a.75.75 0 0 1 .75-.75h6.603l1.435-1.435A2.258 2.258 0 0 0 15.75 12h-7.5A2.25 2.25 0 0 0 6 14.25v5.25h-.25c-.69 0-1.25-.56-1.25-1.25V5.75c0-.69.56-1.25 1.25-1.25H7v2.75A2.25 2.25 0 0 0 9.25 9.5h4.5A2.25 2.25 0 0 0 16 7.25V4.523c.358.06.692.23.952.49l2.035 2.035c.329.328.513.773.513 1.238v1.721c.07-.005.142-.007.213-.007h.002c.437 0 .875.087 1.285.261V8.287a3.25 3.25 0 0 0-.952-2.299l-2.035-2.035A3.25 3.25 0 0 0 15.714 3H5.75ZM8.5 7.25V4.5h6v2.75a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75Z"
                fill="currentColor"
              ></path>
              <path
                d="M19.715 11h-.002c-.585 0-1.17.223-1.615.67l-5.902 5.902a2.684 2.684 0 0 0-.707 1.247l-.458 1.831a1.087 1.087 0 0 0 1.319 1.318l1.83-.457a2.684 2.684 0 0 0 1.248-.707l5.902-5.902A2.285 2.285 0 0 0 19.715 11Z"
                fill="currentColor"
              ></path>
            </svg>

            Save as
          </MenuFlyoutItem>
          <MenuFlyoutItem
            on:click="{copyToClipboard}"
            disabled="{downloading || copying || previewLoading || !canvas}"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              slot="icon"
            >
              <path
                d="M4.507 6.008A3.243 3.243 0 0 0 3 8.75v6.5c0 2.9 2.35 5.25 5.25 5.25h6.5a3.247 3.247 0 0 0 2.744-1.508l-.122.006-.122.002h-9a3.75 3.75 0 0 1-3.75-3.75v-9c0-.081.002-.162.007-.242ZM8.75 3A3.25 3.25 0 0 0 5.5 6.25v8.5A3.25 3.25 0 0 0 8.75 18h8.5a3.25 3.25 0 0 0 3.25-3.25v-8.5A3.25 3.25 0 0 0 17.25 3h-8.5Zm4.68 9.137.093.077 4.306 4.188a1.748 1.748 0 0 1-.579.098h-8.5c-.203 0-.398-.035-.58-.098l4.307-4.188a.75.75 0 0 1 .954-.077ZM8.75 4.5h8.5c.966 0 1.75.784 1.75 1.75v8.5c0 .209-.037.409-.104.595l-4.327-4.207a2.25 2.25 0 0 0-3.003-.12l-.134.12-4.328 4.208A1.747 1.747 0 0 1 7 14.75v-8.5c0-.966.784-1.75 1.75-1.75Zm1.75 2.251a1.25 1.25 0 1 0 0 2.499 1.25 1.25 0 0 0 0-2.499Z"
                fill="currentColor"
              ></path>
            </svg>
            Copy to clipboard
          </MenuFlyoutItem>
        </svelte:fragment>
      </MenuFlyout>
    </div>
    <Button on:click="{close}">Cancel</Button>
  </div>
</div>

<div
  class="slot"
  style="--width: {width}px; --height: {height}px; --padding: {padding}px;"
  bind:this="{slotElem}"
>
  <slot />
</div>

<style>
  main {
    display: grid;
    grid-template-columns: 28fr 50fr;
    grid-template-rows: 24px 34px auto 24px;
    grid-template-areas:
      'title preview-tools'
      'none preview-tools'
      'settings preview'
      'gap gap';
    height: calc(100% - 80px);
    padding: 24px;
    box-sizing: border-box;
    background-color: var(--fds-layer-background-default);
    overflow: hidden auto;
  }

  h1 {
    font-family: var(--fds-font-family-text);
    font-size: 14px;
    margin: 0;
    grid-area: title;
  }

  .settings {
    grid-area: settings;
    padding-right: 24px;
  }

  .preview-tools {
    grid-area: preview-tools;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview {
    grid-area: preview;
    border: 1px solid var(--fds-surface-stroke-default);
    font-family: var(--fds-font-family-text);
    font-size: 14px;
    overflow: auto;
    display: flex;
    position: relative;
  }

  .preview:not(:has(> .rendered-preview)) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview > .loading {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(6px);
    background-color: hsla(0, 0, 23%, 0.1);
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }

  .rendered-preview {
    width: 100%;
    cursor: grab !important;
  }
  .rendered-preview.panning {
    cursor: grabbing !important;
  }

  .rendered-preview > :global(canvas) {
    max-width: 100%;
    min-width: 100%;
    max-height: 100%;
    min-height: 100%;
    object-fit: contain;
  }

  .footer {
    height: 80px;
    box-sizing: border-box;
    padding: 24px;
    grid-gap: 16px;
    -webkit-border-before: 1px solid var(--fds-card-stroke-default);
    border-block-start: 1px solid var(--fds-card-stroke-default);
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .footer > .buttons {
    gap: 8px;
    display: flex;
    white-space: nowrap;
    grid-column: 2 / 3;
  }

  .footer > .buttons > :global(*) {
    height: 30px;
    flex: 1;
  }
  .footer > .buttons > :global(*):only-child {
    inline-size: 50%;
    justify-self: end;
  }

  .save-and-more-button {
    display: flex;
    gap: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: var(--fds-control-corner-radius);
    box-shadow: inset 0 0 0 1px var(--fds-control-stroke-default),
      inset 0 -1px 0 0 var(--fds-control-stroke-secondary-overlay);
  }

  .save-and-more-button > :global(.save-button):not(:hover):not(:active) {
    box-shadow: none;
  }
  .save-and-more-button > :global(.save-button) {
    flex-grow: 1;
    height: 30px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .save-and-more-button > :global(.chevron-button) {
    flex-grow: 0;
    height: 30px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    box-shadow: inset 1px 0px 0 0px var(--fds-control-stroke-default);
  }

  .slot {
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    overflow: hidden;
    box-sizing: border-box;
  }

  .text-box-container {
    align-items: center;
    background-clip: padding-box;
    /* background-color: var(--fds-control-fill-default); */
    border: 1px solid var(--fds-control-stroke-default);
    border-radius: var(--fds-control-corner-radius);
    cursor: text;
    display: flex;
    inline-size: 100%;
    position: relative;
  }
  .text-box-container:hover {
    background-color: var(--fds-control-fill-secondary);
  }
  .text-box-container:focus-within {
    background-color: var(--fds-control-fill-input-active);
  }

  .text-box {
    background-color: transparent;
    border: none;
    border-radius: var(--fds-control-corner-radius);
    box-sizing: border-box;
    color: var(--fds-text-primary);
    cursor: unset;
    flex: 1 1 auto;
    font-family: var(--fds-font-family-text);
    font-size: var(--fds-body-font-size);
    font-weight: 400;
    inline-size: 100%;
    line-height: 20px;
    margin: 0;
    min-block-size: 30px;
    outline: none;
    padding-inline: 10px;
    user-select: none;
  }

  .text-box-underline {
    block-size: calc(100% + 2px);
    border-radius: var(--fds-control-corner-radius);
    inline-size: calc(100% + 2px);
    inset-block-start: -1px;
    inset-inline-start: -1px;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
  }
  .text-box-underline::after {
    block-size: 100%;
    box-sizing: border-box;
    content: '';
    inline-size: 100%;
    inset-block-end: 0px;
    inset-inline-start: 0px;
    position: absolute;
    box-shadow: none;
  }
</style>
