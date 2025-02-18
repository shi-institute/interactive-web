<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import EmbedBar from '$lib/EmbedBar.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { notEmpty } from '$utils/notEmpty';
  import { measureHeight } from '$utils/use';
  import * as Plot from '@observablehq/plot';
  import { html } from 'htl';
  import { type ComponentProps } from 'svelte';

  export let plot: Plot.PlotOptions;
  export let plotContainer: Omit<
    ComponentProps<PlotContainer>,
    'plot' | 'plotNode' | 'boxSizing' | 'fullWidth'
  > = {};
  export let embedBar: ComponentProps<EmbedBar> = {};

  let plotRegionHeight = 0;
  export let openInPopupWindow: () => void = () => {};
</script>

<div class="component-container">
  <div class="plot-container" class:isEmbedded="{$page.data.isEmbedded}">
    <div class="plot-region-wrapper">
      <div
        class="height-calc"
        bind:clientHeight="{plotRegionHeight}"
        use:measureHeight="{{ callback: (height) => (plotRegionHeight = height) }}"
      ></div>

      <div class="plot-region">
        <PlotContainer
          plot="{{
            ...plot,
            height: plotRegionHeight,
            caption: plot.caption
              ? browser
                ? html({ raw: [plot.caption] })
                : plot.caption
              : undefined,
          }}"
          fullWidth
          bind:openInPopupWindow="{openInPopupWindow}"
          boxSizing="border-box"
          {...plotContainer}
          enablePopup="{plotContainer.enablePopup && !$page.data.isEmbedded}"
        />
      </div>
    </div>
  </div>

  {#if $page.data.isEmbedded}
    <EmbedBar
      {...embedBar}
      actions="{[
        plotContainer.enablePopup
          ? {
              label: 'Open in popup',
              onClick: openInPopupWindow,
            }
          : null,
        ...(embedBar?.actions || []),
      ].filter(notEmpty)}"
    />
    <style>
      html {
        overflow: hidden;
      }
    </style>
  {/if}
</div>

<style>
  .component-container {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: var(--content-height);
    display: flex;
    flex-direction: column;
  }

  .plot-container {
    max-height: var(--content-height);
    display: flex;
    flex-grow: 1;
    --padding: 20px;
    padding: var(--padding);
    box-sizing: border-box;
  }
  .plot-container.isEmbedded {
    padding-bottom: calc(var(--padding) + 26px);
  }

  .plot-region-wrapper {
    flex-grow: 1;
    position: relative;
    overflow: auto;
  }

  .height-calc {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - var(--padding) * 2);
    height: 100%;
    opacity: 0;
  }
</style>
