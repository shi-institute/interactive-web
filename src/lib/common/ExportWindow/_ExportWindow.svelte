<script lang="ts">
  import { assets } from '$app/paths';
  import {
    Button,
    Checkbox,
    ComboBox,
    IconButton,
    MenuFlyout,
    MenuFlyoutItem,
    ProgressRing,
    TextBox,
    Tooltip,
  } from 'fluent-svelte';
  import ComboBoxItem from 'fluent-svelte/ComboBox/ComboBoxItem.svelte';
  import { createEventDispatcher } from 'svelte';
  import Popout from 'svelte-popout';
  import Export from './_Export.svelte';

  export let open = false;
  export let width = 858;
  export let height = 754;
  export let application = 'Shi Applied Research';
  export let fileName = 'file';
  export let exportWidth: number;
  export let exportHeight: number;
  export let exportPadding: number;

  const dispatch = createEventDispatcher<{
    close: { evt: Event; popupWindow: Window };
    init: Window | null;
    ready: Window | null;
  }>();

  let popupWindow: Window | null = null;
  let showSpinner = false;
  let allPopupStyleSheetsLoaded = false;

  function handleClose(evt: CustomEvent<{ evt: Event; popupWindow: Window }>) {
    open = false;
    dispatch('close', evt.detail);
  }

  function windowInitialised(window: Window | null) {
    dispatch('init', window);

    allPopupStyleSheetsLoaded = false;
    setTimeout(() => {
      // show the loading spinner only if the popup is not ready after 1 second
      if (!allPopupStyleSheetsLoaded) {
        showSpinner = true;
      }
    }, 1000);

    popupWindow = window;

    if (popupWindow) {
      // disable right click since refreshing or attempting to navigate
      // will close the popup, which is likely unexpected to the user
      popupWindow.addEventListener('contextmenu', (event) => event.preventDefault());

      // copy all stylesheets from the parent window to the popup window
      const parentStylesheets = document.styleSheets;
      const cssRules = Array.from(parentStylesheets).flatMap((stylesheet) =>
        Array.from(stylesheet.cssRules)
      );
      const parentWindowRules = cssRules.reduce((acc, rule) => acc + rule.cssText, '');
      const parentWindowStyleElem = popupWindow.document.createElement('style');
      parentWindowStyleElem.textContent = parentWindowRules;
      parentWindowStyleElem.onload = updateLoadedCount;
      popupWindow.document.head.appendChild(parentWindowStyleElem);

      // load the fonts  into the popup window
      const fontsCssLink = popupWindow.document.createElement('link');
      fontsCssLink.rel = 'stylesheet';
      fontsCssLink.href = `${assets}/fonts.css`;
      fontsCssLink.onload = updateLoadedCount;
      popupWindow.document.head.appendChild(fontsCssLink);

      // load the force-color-scheme script into the popup window so we can
      // se the color scheme to match the parent window
      const colorSchemeScript = popupWindow.document.createElement('script');
      colorSchemeScript.src = `${assets}/force-color-scheme.js`;
      colorSchemeScript.onload = updateLoadedCount;
      popupWindow.document.head.appendChild(colorSchemeScript);

      // load the script that allows panning and zooming the preview
      const panzoomScript = popupWindow.document.createElement('script');
      panzoomScript.src = 'https://unpkg.com/@panzoom/panzoom@4.6.0/dist/panzoom.min.js';
      panzoomScript.onload = updateLoadedCount;
      popupWindow.document.head.appendChild(panzoomScript);

      // load the favicon
      const faviconLink = popupWindow.document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.href = `${assets}/export-favicon.ico`;
      popupWindow.document.head.appendChild(faviconLink);

      // once the resources are loaded, we can set the color scheme
      let loadedCount = 0;
      function updateLoadedCount(evt) {
        loadedCount++;
        if (loadedCount === 4) {
          setTimeout(() => {
            allPopupStyleSheetsLoaded = true;
          }, 1);
          // popupWindow?.forceColorScheme?.(get(selectedThemeMode));
          dispatch('ready', popupWindow);
        }
      }
    }
  }
</script>

{#if open}
  <Popout
    on:close="{handleClose}"
    width="{width}"
    height="{height}"
    copyStyles="{false}"
    windowInitialised="{windowInitialised}"
  >
    <title>{application} - Export</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: var(--fds-solid-background-base);
        overflow: hidden;
      }
      * {
        user-select: none;
      }
    </style>
    {#if allPopupStyleSheetsLoaded}
      <Export
        application="{application}"
        fileName="{fileName}"
        on:close="{() => (open = false)}"
        bind:width="{exportWidth}"
        bind:height="{exportHeight}"
        bind:padding="{exportPadding}"
        popupWindow="{popupWindow}"
      >
        {#if $$slots.default}
          <slot />
        {/if}
      </Export>
    {:else if showSpinner}
      <div class="wait">
        <ProgressRing style="--fds-accent-default: currentColor;" />
        Please wait
      </div>
    {/if}
  </Popout>
{/if}

<!-- Load these components so their styles exist.
 They are used in the popup. The styles need to exist before
 the popup copies the loaded styles. -->
<div style="visiblity: hidden; height: 0; width: 0; overflow: hidden;">
  <Button />
  <Checkbox />
  <ComboBox />
  <ComboBoxItem />
  <IconButton />
  <MenuFlyout />
  <MenuFlyoutItem />
  <TextBox />
  <Tooltip />
</div>

<style>
  .wait {
    position: fixed;
    inset: 0;
    height: 100vh;
    backdrop-filter: blur(6px);
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }
</style>
