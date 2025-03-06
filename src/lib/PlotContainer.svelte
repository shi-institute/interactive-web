<script lang="ts">
  import { browser } from '$app/environment';
  import { assets } from '$app/paths';
  import { page } from '$app/stores';
  import selectedThemeMode from '$stores/selectedThemeMode';
  import { measureWidth } from '$utils/use';
  import * as Plot from '@observablehq/plot';
  import { ContextMenu, MenuFlyoutItem, ProgressRing } from 'fluent-svelte';
  import Popout from 'svelte-popout';
  import { get } from 'svelte/store';
  import { ExportWindow } from './common/ExportWindow';
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
    counter;
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

  let exportWidth = 800;
  let exportHeight = 500;
  let exportPadding = 20;
  let slotBeforeExportHeight = 0;
  let slotAfterExportHeight = 0;
  let exportDiv: HTMLDivElement;
  $: {
    counter;
    if (browser && exportDiv) {
      const plotHeight = calculatePlotHeightInBorderBoxMode(
        slotBeforeExportHeight,
        slotAfterExportHeight,
        {
          ...plotOptions,
          height: exportHeight - 2 * exportPadding,
        },
        exportDiv
      );

      plotNode = new PlotNodeManager()
        .setOptions({
          ...plotOptions,
          width: exportWidth - 2 * exportPadding,
          height: plotHeight,
        })
        .render(exportDiv).node;
    }
  }

  function calculatePlotHeightInBorderBoxMode(
    slotBeforeHeight: number,
    slotAfterHeight: number,
    plotOptions: Plot.PlotOptions,
    node = div
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
      .render(node);
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

  let exportWindowOpen = false;
  function exportWindowInitialized(_exportWindow: Window | null) {}

  export function openInPopupWindow() {
    popupOpen = true;
  }
  function handlePopupClose() {
    popupOpen = false;
  }

  function openExportWindow() {
    exportWindowOpen = true;
  }

  let counter = 0;
  function refresh() {
    counter = counter + 1;
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
        class="plot-container"
      >
        <div bind:this="{popopPlotDestinationNode}" role="img" class="{plotClass}">
          <div class="wait">
            <ProgressRing style="--fds-accent-default: currentColor;" />
            Please wait
          </div>
        </div>
      </div>
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

<ExportWindow
  bind:open="{exportWindowOpen}"
  fileName="{plotOptions.title?.toString()}"
  bind:exportWidth="{exportWidth}"
  bind:exportHeight="{exportHeight}"
  bind:exportPadding="{exportPadding}"
>
  <div class="plot-container {randomClass}">
    <div class="slots" bind:clientHeight="{slotBeforeExportHeight}">
      <slot name="print-before" />
      <slot name="before" />
    </div>
    <div bind:this="{exportDiv}" role="img" class="{plotClass}">
      <div class="wait">
        <ProgressRing style="--fds-accent-default: currentColor;" />
        Please wait
      </div>
    </div>
    {#await customPlotCss then css}
      {@html `<` + `style>${css}</style>`}
    {/await}
    <div class="slots" bind:clientHeight="{slotAfterExportHeight}">
      <slot name="after" />
      <slot name="print-after" />
    </div>
  </div>
</ExportWindow>

<ContextMenu>
  <div class="plot-container {randomClass}">
    <div class="slots" bind:clientHeight="{slotBeforeHeight}">
      <slot name="main-before" />
      <slot name="before" />
    </div>
    <div
      bind:clientWidth="{clientWidth}"
      use:measureWidth="{{ callback: (width) => (clientWidth = width) }}"
    >
      <div bind:this="{div}" role="img" class="{plotClass}">
        <div
          style="height: {(typeof plot === 'function' ? plot(clientWidth || 640) : plot).height ||
            300}px;"
        >
          <div
            class="wait"
            class:nobackground="{!$page.data.isEmbedded}"
            class:contained="{!$page.data.isEmbedded}"
          >
            <ProgressRing style="--fds-accent-default: currentColor;" />
            Please wait
          </div>
        </div>
      </div>
    </div>
    {#await customPlotCss then css}
      {@html `<` + `style>${css}</style>`}
    {/await}
    <div class="slots" bind:clientHeight="{slotAfterHeight}">
      {#if enablePopup && div && div.childElementCount > 0}
        <button class="popup-button" on:click="{openInPopupWindow}">Open in popup</button>
      {/if}
      <slot name="after" />
      <slot name="main-after" />
    </div>
  </div>

  <svelte:fragment slot="flyout">
    <MenuFlyoutItem on:click="{refresh}">
      Refresh
      <svg
        slot="icon"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z"
          fill="currentColor"
        ></path>
      </svg>
    </MenuFlyoutItem>
    <MenuFlyoutItem on:click="{openExportWindow}" disabled="{exportWindowOpen}">
      Export
      <svg
        slot="icon"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.752 4.5a.75.75 0 0 1 .744.648l.006.102L3.5 18.254a.75.75 0 0 1-1.493.102L2 18.254 2.002 5.25a.75.75 0 0 1 .75-.75Zm12.895 1.804.073-.084a.75.75 0 0 1 .976-.073l.084.073 4.997 4.997a.75.75 0 0 1 .073.976l-.073.085-4.996 5.003a.75.75 0 0 1-1.134-.976l.072-.084 3.711-3.717H5.753a.75.75 0 0 1-.743-.647l-.007-.102a.75.75 0 0 1 .648-.743l.102-.007 13.69-.001L15.72 7.28a.75.75 0 0 1-.073-.976l.073-.084-.073.084Z"
          fill="currentColor"
        ></path>
      </svg>
    </MenuFlyoutItem>
    <MenuFlyoutItem on:click="{openInPopupWindow}">
      Open in popup window
      <svg
        slot="icon"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.272 7.25a.75.75 0 0 1 .75-.75h4.728a.75.75 0 0 1 .75.75v4.729a.75.75 0 0 1-1.5 0V9.06l-5.22 5.22a.75.75 0 1 1-1.06-1.061L14.94 8h-2.918a.75.75 0 0 1-.75-.75Z"
          fill="currentColor"
        ></path>
        <path
          d="M6.157 5.25A3.251 3.251 0 0 1 9.25 3h8.5A3.25 3.25 0 0 1 21 6.25v8.588a3.251 3.251 0 0 1-2 3.001v.136c0 1.05-.53 1.845-1.309 2.344-.75.48-1.717.686-2.693.68h-.002l-4.077-.004H7c-1.157 0-2.164-.362-2.89-1.045-.727-.686-1.11-1.64-1.11-2.7V8.5c0-.865.216-1.683.734-2.296.534-.633 1.31-.954 2.222-.954h.2ZM6 6.75h-.044c-.544 0-.871.179-1.076.421-.22.262-.38.694-.38 1.329v8.75c0 .69.242 1.234.64 1.608.4.377 1.017.637 1.86.637h3.92L15 19.5h.004c.788.004 1.445-.166 1.878-.444.372-.238.582-.55.614-.968H9.25A3.25 3.25 0 0 1 6 14.838V6.75ZM9.25 4.5A1.75 1.75 0 0 0 7.5 6.25v8.588c0 .967.784 1.75 1.75 1.75h8.5a1.75 1.75 0 0 0 1.75-1.75V6.25a1.75 1.75 0 0 0-1.75-1.75h-8.5Z"
          fill="currentColor"
        ></path>
      </svg>
    </MenuFlyoutItem>
  </svelte:fragment>
</ContextMenu>

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
  .wait.contained {
    position: relative;
    inset: unset;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: 1px dotted #80808040;
  }
</style>
