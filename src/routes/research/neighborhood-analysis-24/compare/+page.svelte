<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PageTitle from '$lib/PageTitle.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { notEmpty } from '$utils/notEmpty';
  import { type Plot } from '@observablehq/plot';
  import { Button, ContentDialog, InfoBar } from 'fluent-svelte';
  import { html } from 'htl';
  import { queryParameters } from 'sveltekit-search-params';
  import { validatePublic } from '../matcher';
  import { blockPlotConfigs, plotConfigs } from '../plotConfigs';
  import FloatingSidebar from './FloatingSidebar.svelte';
  import { isPanelWrapperOpen } from './isPanelWrapperOpen';
  import { getParams, queryParamsOptions } from './params';
  import Sidebar from './Sidebar.svelte';

  export let data;

  const params = queryParameters(getParams($page.url), queryParamsOptions);
  $: orderedPlotIds = $params.plots.map((option) => option._id);

  let needsAuthentication = false;
  function clearNeedsAuthentication() {
    needsAuthentication = false;
  }
  $: if ($params) {
    clearNeedsAuthentication();
  }

  function withoutPrivate(key: string) {
    return (neighborhood: string) => {
      const isPublic = validatePublic(neighborhood.toLocaleLowerCase(), key);
      const allowed = isPublic || data.authenticated;
      if (!allowed) needsAuthentication = true;
      return allowed;
    };
  }

  $: tractPlots = Object.entries(plotConfigs)
    .filter(([key, config]) => orderedPlotIds.includes(key))
    .flatMap(([key, config]) => {
      return $params.neighborhoods.filter(withoutPrivate(key)).map((neighborhood) => {
        const isTract = !isNaN(parseInt(neighborhood));

        if (isTract) {
          const tract = parseInt(neighborhood);
          const plotData = data.tractsData.filter((d) => d.tract_id === tract) || [];
          if (plotData.length === 0) return null;
          return [key, neighborhood, config('Tract ' + tract, plotData, $page.url)] as const;
        }

        // if it's not a tract, it's a neighborhood (same data structure)
        const plotData =
          data.neighborhoodsData.filter(
            (d) => d.neighborhood_name.toLowerCase() === neighborhood.toLowerCase()
          ) || [];

        if (plotData.length === 0) {
          return null;
        }

        return [key, neighborhood, config(neighborhood, plotData, $page.url)] as const;
      });
    })
    .filter(notEmpty);

  $: blockPlots = Object.entries(blockPlotConfigs)
    .map(([key, config]) => ['decennial‾‾' + key, config] as const)
    .filter(([key, config]) => orderedPlotIds.map((id) => id.split('?')[0]).includes(key))
    .flatMap(([key, config]) => {
      return $params.neighborhoods.filter(withoutPrivate(key)).flatMap((neighborhood) => {
        const isTract = !isNaN(parseInt(neighborhood));
        const keysWithParams = orderedPlotIds.filter((id) => id.split('?')[0] === key);

        if (isTract) {
          return null;
        }

        const plotData =
          data.neighborhoodBlocksData.filter(
            (d) => d.neighborhood_name.toLowerCase() === neighborhood.toLowerCase()
          ) || [];

        if (plotData.length === 0) {
          return null;
        }

        return keysWithParams.map((keyWithParam) => {
          const [key, search] = keyWithParam.split('?');

          const url = new URL($page.url);
          url.search = search;

          return [keyWithParam, neighborhood, config(neighborhood, plotData, url)] as const;
        });
      });
    })
    .filter(notEmpty);

  $: plotsToShow = [...tractPlots, ...blockPlots];

  let plotNodes: Record<string, ((HTMLElement | SVGSVGElement) & Plot) | undefined> = {};

  // make sure all y-axes have the same domain when normalizeYAxisScale is true
  function matchYDomains() {
    const maximums = Object.entries(plotNodes)
      .map(([_key, node]) => {
        const [neighborhood, key] = _key.split('.');

        const domain = node?.scale('y')?.domain;
        if (!domain) return;

        const [min, max] = Array.from(domain) as [number, number];

        return [neighborhood, max] as const;
      })
      .filter(notEmpty)
      .reduce((acc, [neighborhood, max]) => {
        if (acc[neighborhood] === undefined || acc[neighborhood] < max) {
          acc[neighborhood] = max;
        }
        return acc;
      }, {} as Record<string, number>);

    plotsToShow = plotsToShow.map(([key, neighborhood, plot]) => {
      const max = maximums[key];
      if (!max) return [key, neighborhood, plot];

      const yDomain = [0, max];

      if (!plot.y) {
        plot.y = { domain: yDomain };
        return [key, neighborhood, plot];
      }

      plot.y.domain = yDomain;
      return [key, neighborhood, plot];
    });
  }
  $: plotNodesLength = Object.keys(plotNodes).length;
  $: if (plotNodesLength && $params.normalizeYAxisScale) {
    matchYDomains();
  }
</script>

<ContentDialog
  bind:open="{$params.wizard}"
  title="Create a collection"
  class="ns-plots-24-wizard"
  size="max"
>
  <Sidebar pageTitleElemVisibleHeight="{2}" inline />
  <svelte:fragment slot="footer">
    <Button
      on:click="{() => {
        $params.wizard = false;
      }}"
      variant="accent"
    >
      Create
    </Button>
  </svelte:fragment>
</ContentDialog>

<FloatingSidebar isEmbedded="{data.isEmbedded}" />

<PageTitle>
  {$params.title || '<title>'}
  <svelte:fragment slot="caption">
    {$params.subtitle}
  </svelte:fragment>
</PageTitle>

{#if needsAuthentication}
  <InfoBar
    title="Access restricted"
    closable="{false}"
    severity="caution"
    style="margin: 16px 16px 0;"
  >
    Some plots will be hidden until you authenticate
    <Button
      slot="action"
      style="margin-right: 10px;"
      on:click="{() => {
        const scope = 'application__neighborhood_analysis_24';
        const appName = 'Neighborhood Analysis 24';
        goto(
          `/research/authenticate?scope=${scope}${
            appName ? `&appName=${appName}` : ''
          }&from=${encodeURIComponent($page.url.href)}`
        );
      }}"
    >
      Sign in
    </Button>
  </InfoBar>
{/if}

{#if $params.plots.length === 0}
  <section>
    To begin comparing, click
    <Button variant="hyperlink" on:click="{() => ($isPanelWrapperOpen = true)}">Settings</Button>
    in the bottom-right corner of the screen and choose the figures and neighborhoods you would like
    to compare.
  </section>
{/if}

<div
  class="grid"
  class:wrap="{$params.neighborhoods.length === 1 || $params.plots.length === 1}"
  style="--columns: {$params.neighborhoods.length}; --plotWidth: {$params.plotWidth}px"
>
  {#each plotsToShow as [key, neighborhood, plot]}
    {@const keyOrder = orderedPlotIds.indexOf(key)}
    {@const neighborhoodOrder = $params.neighborhoods.indexOf(neighborhood)}
    <div
      class="grid-item"
      style="grid-column: {neighborhoodOrder + 1}; grid-row: {keyOrder + 1}; order: {keyOrder + 1};"
    >
      <div style="width: 100%;">
        <PlotContainer
          plot="{{
            ...plot,
            height: $params.plotHeight,
            caption: plot.caption
              ? browser
                ? html({ raw: [plot.caption] })
                : plot.caption
              : undefined,
          }}"
          enablePopup
          fullWidth
          bind:plotNode="{plotNodes[`${key}.${neighborhood}`]}"
        />
      </div>
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--columns), calc(min(90vw, var(--plotWidth, 600px)) + 32px));
    gap: 16px;
    padding: 16px;
    justify-content: start;
    align-items: start;
    overflow-x: auto;
  }

  .grid-item {
    display: flex;
    justify-content: center;
    border: 1px solid #80808040;
    padding: 16px;
  }

  section {
    padding: 10px;
  }

  /* single neighborhood mode should use the whole screen instead of a single column */
  .grid.wrap {
    grid-template-columns: repeat(auto-fill, calc(min(90vw, var(--plotWidth, 600px)) + 32px));
  }
  .grid.wrap .grid-item {
    grid-column: auto !important;
    grid-row: auto !important;
  }

  :global(.ns-plots-24-wizard .content-dialog-body) {
    max-height: calc(100vh - 80px - 80px);
    box-sizing: border-box;
    overflow: auto;
  }
  :global(.ns-plots-24-wizard h4) {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  :global(.ns-plots-24-wizard h4::before) {
    content: '';
    background-color: var(--fds-solid-background-base);
    position: absolute;
    inset: -24px 0 -12px 0;
    z-index: -1;
  }

  :global(.ns-plots-24-wizard h4::after) {
    content: '';
    background-color: var(--fds-layer-background-default);
    position: absolute;
    inset: -24px 0 -12px 0;
    z-index: -1;
  }
</style>
