<script lang="ts">
  import { browser } from '$app/environment';
  import { assets } from '$app/paths';
  import selectedThemeMode from '$stores/selectedThemeMode';
  import * as Plot from '@observablehq/plot';
  import { ProgressRing } from 'fluent-svelte';
  import Popout from 'svelte-popout';
  import { get } from 'svelte/store';
  import { type PlotNode, PlotNodeManager } from './PlotNodeManager';

  export let plot: Plot.PlotOptions | ((width: number) => Plot.PlotOptions);
  export let fullWidth = false;
  export let enablePopup = false;
  export let plotClass = '';
  export let popupWidth = 900;
  export let popupHeight = 500;
  export let plotNode: PlotNode | undefined = undefined;
  export let boxSizing: 'border-box' | 'content-box' = 'content-box';

  $: randomClass = 'c' + Math.random().toString(36).substring(7);
  $: customPlotCss = (async () => {
    return `
      .${randomClass} figure {
        ${(typeof plot === 'function' ? plot(0) : plot).style}
      }
    `;
  })();

  let slotBeforeHeight = 0;
  let slotAfterHeight = 0;

  let clientWidth: number | undefined;
  let div: HTMLDivElement;
  $: plotOptions = typeof plot === 'function' ? plot(clientWidth || 640) : plot;
  $: {
    if (browser && div) {
      const plotHeight =
        boxSizing === 'border-box'
          ? calculatePlotHeightInBorderBoxMode(slotBeforeHeight, slotAfterHeight, plotOptions)
          : plotOptions.height;

      plotNode = new PlotNodeManager()
        .setOptions({
          ...plotOptions,
          width: fullWidth ? clientWidth : plotOptions.width || 640,
          height: plotHeight,
        })
        .render(div).node;
    }
  }

  function calculatePlotHeightInBorderBoxMode(
    slotBeforeHeight: number,
    slotAfterHeight: number,
    plotOptions: Plot.PlotOptions
  ) {
    if (!plotOptions.height) {
      return undefined;
    }

    // read the height of slots before and after the plot
    const slotsHeight = slotBeforeHeight + slotAfterHeight;

    // create a version of the plot that has no height so we can measure
    // the height over everything besides the plot (captions, titles, etc.)
    const tempPlotManager = new PlotNodeManager()
      .setOptions({
        ...plotOptions,
        width: 0,
        height: 0,
      })
      .render(div);
    tempPlotManager.node.style.visibility = 'hidden';
    const metaHeight = tempPlotManager.node.clientHeight;

    return plotOptions.height - metaHeight - slotsHeight;
  }

  let popupOpen = false;
  let popupClientWidth: number | undefined;
  let popupClientHeight: number | undefined;
  let popopPlotDestinationNode: HTMLDivElement;
  $: {
    if (
      browser &&
      popupOpen &&
      popopPlotDestinationNode &&
      popupClientWidth !== undefined &&
      popupClientHeight !== undefined
    ) {
      // read the height of any nodes in slots in the popup
      const nodes = popopPlotDestinationNode.ownerDocument.body.firstElementChild?.childNodes;
      let slotsHeight = 0;
      for (const node of nodes || []) {
        if (node instanceof HTMLElement && !node.classList.contains('plot-container')) {
          const style = node.computedStyleMap();
          const clientHeight = node.clientHeight;
          const marginTop = Math.ceil(
            (style.get('margin-top') as CSSUnitValue | undefined)?.value || 0
          );
          const marginBottom = Math.ceil(
            (style.get('margin-bottom') as CSSUnitValue | undefined)?.value || 0
          );
          slotsHeight += clientHeight + marginTop + marginBottom;
        }
      }

      // create a version of the plot that has no height so we can measure
      // the height over everything besides the plot (captions, titles, etc.)
      const tempPlotManager = new PlotNodeManager()
        .setOptions({
          ...plotOptions,
          width: 0,
          height: 0,
        })
        .render(popopPlotDestinationNode);
      tempPlotManager.node.style.visibility = 'hidden';
      const metaHeight = tempPlotManager.node.clientHeight;

      // create the version to be displayed in the popup
      // that has the correct height
      new PlotNodeManager()
        .setOptions({
          ...plotOptions,
          width: popupClientWidth,
          height: popupClientHeight - metaHeight - slotsHeight,
        })
        .render(popopPlotDestinationNode);
    }
  }

  let popupWindow: Window | null = null;
  let allPopupStyleSheetsLoaded = false;
  function windowInitialised(_popupWindow: Window | null) {
    allPopupStyleSheetsLoaded = false;
    popupWindow = _popupWindow;

    if (popupWindow) {
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

      // once the resources are loaded, we can set the color scheme
      let loadedCount = 0;
      function updateLoadedCount() {
        loadedCount++;
        if (loadedCount === 3) {
          allPopupStyleSheetsLoaded = true;
          popupWindow?.forceColorScheme?.(get(selectedThemeMode));

          // force the initial plot height to be correct
          if (plotIsInIframe) {
            popupWindow?.requestAnimationFrame(() => {
              const plotContainerElem = popupWindow?.document?.querySelector('.plot-container');
              if (plotContainerElem) {
                popupClientWidth = plotContainerElem.clientWidth;
                popupClientHeight = plotContainerElem.clientHeight;
              }
            });
          }
        }
      }
    }
  }

  $: plotIsInIframe = browser && window.self !== window.top;
  $: {
    // if the webpage containing the PlotContainer element is in an iframe,
    // we need to listen for resizes on the iframe window because
    // svelte's bind syntax does not work within iframes for some reason
    // (as of 2025-02-10, version 4.2.18)
    if (plotIsInIframe && popupWindow && popopPlotDestinationNode) {
      const frameDocument = popopPlotDestinationNode.ownerDocument;
      const plotContainerElem = frameDocument.querySelector('.plot-container');
      popupWindow.addEventListener('resize', () => {
        if (plotContainerElem) {
          popupClientWidth = plotContainerElem.clientWidth;
          popupClientHeight = plotContainerElem.clientHeight;
        }
      });
    }
  }

  export function openInPopupWindow() {
    popupOpen = true;
  }
  function handlePopupClose() {
    popupOpen = false;
  }
</script>

{#if popupOpen}
  <Popout
    on:close="{handlePopupClose}"
    width="{popupWidth}"
    height="{popupHeight}"
    copyStyles="{false}"
    windowInitialised="{windowInitialised}"
  >
    <style>
      body {
        margin: 0;
        padding: 20px;
        overflow: hidden;
      }
      body > div:first-child,
      .plot-container {
        height: 100%;
      }
    </style>
    {#if allPopupStyleSheetsLoaded}
      <slot name="popup-before" />
      <slot name="before" />
      <div
        bind:clientWidth="{popupClientWidth}"
        bind:clientHeight="{popupClientHeight}"
        class="plot-container {randomClass}"
      >
        <div bind:this="{popopPlotDestinationNode}" role="img" class="{plotClass}">
          <div class="wait">
            <ProgressRing style="--fds-accent-default: currentColor;" />
            Please wait
          </div>
        </div>
      </div>
      {#await customPlotCss then css}
        {@html `<` + `style>${css}</style>`}
      {/await}
      <slot name="after" />
      <slot name="popup-after" />
    {:else}
      <div class="wait nobackground">
        <ProgressRing style="--fds-accent-default: currentColor;" />
        Please wait
      </div>
    {/if}
  </Popout>
{/if}

<div class="plot-container {randomClass}">
  <div class="slots" bind:clientHeight="{slotBeforeHeight}">
    <slot name="main-before" />
    <slot name="before" />
  </div>
  <div bind:clientWidth="{clientWidth}">
    <div bind:this="{div}" role="img" class="{plotClass}">
      <div
        style="height: {(typeof plot === 'function' ? plot(clientWidth || 640) : plot).height ||
          300}px;"
      ></div>
    </div>
  </div>
  {#await customPlotCss then css}
    {@html `<` + `style>${css}</style>`}
  {/await}
  <div class="slots" bind:clientHeight="{slotAfterHeight}">
    {#if enablePopup}
      <button class="popup-button" on:click="{openInPopupWindow}">Open in popup</button>
    {/if}
    <slot name="after" />
    <slot name="main-after" />
  </div>
</div>

<style>
  .popup-button {
    all: unset;
    cursor: pointer;
    font-size: 12px;
    color: var(--color-neutral-dark);
    box-shadow: 0 0.5px 0 0 var(--color-neutral-lightest);
    text-decoration: none;
    transition: background-color 0.2s, box-shadow 0.1s;
  }
  .popup-button:hover {
    color: var(--fds-accent-default);
    background-color: hsla(var(--fds-accent-light-2), 0.06);
    box-shadow: 0 2px 0 0 var(--fds-accent-default);
  }
  .popup-button:active {
    background-color: hsla(var(--fds-accent-light-2), 0.04);
    color: var(--fds-accent-secondary);
  }
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
  .wait.nobackground {
    backdrop-filter: none;
    background-color: transparent;
  }
</style>
