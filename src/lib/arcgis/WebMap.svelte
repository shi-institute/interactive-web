<script lang="ts">
  import { notEmpty } from '$utils/notEmpty';
  import esriConfig from '@arcgis/core/config.js';
  import * as timeUtils from '@arcgis/core/support/timeUtils.js';
  import MapView from '@arcgis/core/views/MapView';
  import WebMap from '@arcgis/core/WebMap';
  import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
  import Bookmarks from '@arcgis/core/widgets/Bookmarks';
  import LayerList from '@arcgis/core/widgets/LayerList';
  import Legend from '@arcgis/core/widgets/Legend';
  import Print from '@arcgis/core/widgets/Print';
  import TimeSlider from '@arcgis/core/widgets/TimeSlider.js';
  import sanitizeHtml from 'sanitize-html';
  import { createEventDispatcher, onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import type { WebMapOptions } from './WebMap';

  /**
   * Props for the WebMap component.
   *
   * Read about the WebMap properties here:
   * https://developers.arcgis.com/javascript/latest/api-reference/esri-WebMap.html#properties-summary
   *
   * Every web map props should include the `portalItem` property.
   * THis property is an object with an `id` property that is a string that
   * represents the web map id from the portal.
   * If the item is not on ArcGIS Online, the `portal` property shoul
   *  be included as an object. Specify the portal URL inside the `portal`
   * object on the `url` property.
   */
  export let webMapProps: __esri.WebMapProperties;

  /**
   * Props for the MapView component.
   *
   * Read about the MapView properties. methods, and events here: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
   *
   * The `map` and `container` properties are automatically handled by this svelte component and cannot be manually specified..
   */
  export let mapViewProps: Omit<Omit<__esri.MapViewProperties, 'map'>, 'container'> = {};

  /**
   * The WebMap instance. You should not set this prop manually.
   *
   * Access the contents of the WebMap instance using this prop with
   * `bind:map={yourWebMapVariable}`.
   */
  export let map: WebMap | undefined = undefined;

  /**
   * The MapView instance. You should not set this prop manually.
   *
   * Access the contents of the MapView instance using this prop with
   * `bind:view={yourMapViewVariable}`.
   */
  export let view: MapView | undefined = undefined;

  export let options: Writable<WebMapOptions> = writable({
    expanded: { left: false, right: false },
    activeWidget: { left: null, right: null },
  });

  export let actions: {
    id: string;
    icon: string;
    text: string;
    group?: 'start' | 'end';
    side?: 'left' | 'right';
  }[] = [];

  interface ShellConfig {
    header?: false | { heading: string; description?: string };
    actions?: {
      layers?: false;
      basemaps?: false;
      legend?: false;
      bookmarks?: false;
      print?: false;
      information?: false;
    };
    timeSlider?:
      | false
      | (Omit<Omit<__esri.widgetsTimeSliderProperties, 'map'>, 'container'> & {
          inheritPropertiesFromWebMap?: boolean;
        });
  }
  export let shell: ShellConfig | false = {};

  const dispatch = createEventDispatcher<{
    ready: { map: WebMap; view: MapView };
    error: unknown;
  }>();

  const allActions = [
    ...actions,
    shell && shell.actions?.layers !== false
      ? { id: 'layers', icon: 'layers', text: 'Layers' }
      : null,
    shell && shell.actions?.basemaps !== false
      ? { id: 'basemaps', icon: 'basemap', text: 'Basemaps' }
      : null,
    shell && shell.actions?.legend !== false
      ? { id: 'legend', icon: 'legend', text: 'Legend' }
      : null,
    shell && shell.actions?.bookmarks !== false
      ? { id: 'bookmarks', icon: 'bookmark', text: 'Bookmarks' }
      : null,
    shell && shell.actions?.print !== false ? { id: 'print', icon: 'print', text: 'Print' } : null,
    shell && shell.actions?.information !== false
      ? { id: 'information', icon: 'information', text: 'Information', group: 'end' }
      : null,
  ].filter(notEmpty) as typeof actions;

  let mapViewContainer: HTMLDivElement;
  let leftActionBar: HTMLElement;
  let rightActionBar: HTMLElement;

  let itemDescription = '';
  let itemThumbnailUrl = '';
  let itemRating = 0;
  let itemPageUrl = '';

  onMount(() => {
    if (webMapProps.portalItem?.portal?.url) {
      esriConfig.portalUrl = webMapProps.portalItem.portal.url;
    }

    map = new WebMap(webMapProps);
    view = new MapView({
      map,
      container: mapViewContainer,
      ...mapViewProps,
    });

    if (webMapProps.portalItem?.apiKey) {
      const apiKey = webMapProps.portalItem.apiKey;
      const apiKeyPortal = new URL(esriConfig.portalUrl).origin;
      map.when(() => {
        // set the apiKey on all layers that are from the same portal
        map?.allLayers.forEach((layer) => {
          if (typeof layer.url === 'string' && layer.url.startsWith(apiKeyPortal)) {
            layer.apiKey = apiKey;
          }
        });
      });
    }

    view.when(() => {
      /**
       * Handles the click event on the action bar.
       * This function will show/hide the panel associated with the clicked action.
       */
      const handleActionBarClick = (evt: MouseEvent, bar: 'left' | 'right') => {
        if (!evt.target) return;
        const target = evt.target as HTMLElement;

        if (target.tagName !== 'CALCITE-ACTION') return;

        // hide the currently active widget/panel
        if ($options.activeWidget[bar]) {
          const activeWidgetPanelElem = document.querySelector(
            `[data-panel-id=${$options.activeWidget[bar]}]`
          ) as HTMLElement | undefined;
          const activeWidgetButtonElem = document.querySelector(
            `[data-action-id=${$options.activeWidget[bar]}]`
          ) as (HTMLElement & { active?: boolean }) | undefined;
          if (activeWidgetPanelElem && activeWidgetButtonElem) {
            activeWidgetButtonElem.active = false;
            activeWidgetPanelElem.hidden = true;
          }
        }

        const nextWidget = target.dataset.actionId ?? null;
        // activate the clicked widget/panel
        if (nextWidget !== $options.activeWidget[bar]) {
          const nextWidgetPanelElem = document.querySelector(`[data-panel-id=${nextWidget}]`) as
            | HTMLElement
            | undefined;
          const nextWidgetButtonElem = document.querySelector(`[data-action-id=${nextWidget}]`) as
            | (HTMLElement & { active?: boolean })
            | undefined;
          if (nextWidgetPanelElem && nextWidgetButtonElem) {
            nextWidgetButtonElem.active = true;
            nextWidgetPanelElem.hidden = false;
            $options.activeWidget[bar] = nextWidget;
          } else {
            console.error(`Could not find the element with the data-action-id of ${nextWidget}`);
            $options.activeWidget[bar] = null;
          }
        }
        // if the clicked widget was the one that was active, then there is no active widget
        // because we closed it earlier
        else {
          $options.activeWidget[bar] = null;
        }
      };

      leftActionBar?.addEventListener('click', (evt) => handleActionBarClick(evt, 'left'));
      rightActionBar?.addEventListener('click', (evt) => handleActionBarClick(evt, 'right'));
    });

    view.when(
      () => {
        if (map !== undefined && view !== undefined) {
          dispatch('ready', { map, view });
        }
      },
      (error: unknown) => {
        console.error(error);
        dispatch('error', error);
      }
    );

    view.when(() => {
      if (map) {
        const {
          title,
          description,
          thumbnailUrl,
          avgRating,
          itemPageUrl: _itemPageUrl,
        } = map.portalItem;
        itemDescription = description;
        itemThumbnailUrl = thumbnailUrl;
        itemRating = avgRating;
        itemPageUrl = _itemPageUrl;
      }
    });

    const basemaps = new BasemapGallery({
      view,
      container: 'basemaps-container',
    });

    const bookmarks = new Bookmarks({
      view,
      container: 'bookmarks-container',
    });

    const layerList = new LayerList({
      view,
      dragEnabled: true,
      visibilityAppearance: 'checkbox',
      container: 'layers-container',
    });

    const legend = new Legend({
      view,
      container: 'legend-container',
    });

    if (shell && shell.actions?.print !== false) {
      new Print({
        view,
        container: 'print-container',
      });
    }

    (async () => {
      if (shell && shell.timeSlider) {
        const { inheritPropertiesFromWebMap, ...timeSliderProps } = shell.timeSlider;

        let webDocumentTimeSliderSettings = null;
        if (inheritPropertiesFromWebMap) {
          webDocumentTimeSliderSettings = await timeUtils.getTimeSliderSettingsFromWebDocument(map);
        }

        const timeSlider = new TimeSlider({
          view: view,
          container: 'timeSlider',
          ...(webDocumentTimeSliderSettings || {}),
          ...timeSliderProps,
        });
        view.ui.add(timeSlider, 'manual');
      }
    })();

    view.when(() => {
      // unhide the shell panels if their ids are in $options.activeWidget.left/right
      if ($options.activeWidget.left) {
        customElements.whenDefined('calcite-shell-panel').then(() => {
          customElements.whenDefined('calcite-shell-panel').then(() => {
            const shellPanels = document.querySelectorAll(
              'calcite-shell-panel'
            ) as NodeListOf<HTMLElement>;

            shellPanels.forEach((shellPanel) => {
              if (shellPanel) {
                const panels = shellPanel.querySelectorAll(
                  'calcite-panel'
                ) as NodeListOf<HTMLElement>;

                panels.forEach((panel) => {
                  if (
                    panel.getAttribute('data-panel-id') === $options.activeWidget.left ||
                    panel.getAttribute('data-panel-id') === $options.activeWidget.right
                  ) {
                    panel.hidden = false;
                  }
                });
              }
            });
          });
        });
      }
    });
  });

  let prefersDarkMode = false;
  onMount(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModePreference.matches) prefersDarkMode = true;
    else prefersDarkMode = false;

    const listener = (e: MediaQueryListEvent) => {
      if (e.matches) prefersDarkMode = true;
      else prefersDarkMode = false;
    };

    darkModePreference.addEventListener('change', listener);

    return () => {
      darkModePreference.removeEventListener('change', listener);
    };
  });

  // remove the light mode class from the esri-ui div
  // and set it to auto theme mode
  onMount(() => {
    const esriUI = mapViewContainer.querySelector('.calcite-mode-light');
    if (esriUI) {
      esriUI.classList.remove('calcite-mode-light');
      esriUI.classList.add('calcite-mode-auto');
    }
  });
</script>

<svelte:head>
  <script src="https://js.arcgis.com/4.30/"></script>
  <link
    rel="stylesheet"
    href="https://js.arcgis.com/4.30/esri/themes/{prefersDarkMode ? 'dark' : 'light'}/main.css"
  />
</svelte:head>

{#if shell}
  <calcite-shell class="calcite-mode-auto">
    {#if shell.header}
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          id="header-title"
          slot="logo"
          heading="{shell.header.heading}"
          description="{shell.header.description}"
        ></calcite-navigation-logo>
      </calcite-navigation>
    {/if}

    {#if allActions.filter(({ side }) => side !== 'right').length > 0}
      <calcite-shell-panel
        slot="panel-start"
        position="start"
        display-mode="docked"
        resizable
        collapsed="{!$options.activeWidget.left}"
      >
        <calcite-action-bar
          slot="action-bar"
          bind:this="{leftActionBar}"
          class="calcite-mode-dark"
          expanded="{$options.expanded.left}"
          on:calciteActionBarToggle="{() => ($options.expanded.left = !$options.expanded.left)}"
        >
          {#each allActions.filter(({ group, side }) => group !== 'end' && side !== 'right') as { id, icon, text }}
            <calcite-action
              data-action-id="{id}"
              icon="{icon}"
              text="{text}"
              id="{id}-action-button"
            ></calcite-action>
            {#if !$options.expanded.left}
              <calcite-tooltip reference-element="{id}-action-button" placement="right-middle">
                <span>{text}</span>
              </calcite-tooltip>
            {/if}
          {/each}
          <calcite-action-group slot="actions-end">
            {#each allActions.filter(({ group, side }) => group === 'end' && side !== 'right') as { id, icon, text }}
              <calcite-action
                data-action-id="{id}"
                icon="{icon}"
                text="{text}"
                id="{id}-action-button"
              ></calcite-action>
              <calcite-tooltip reference-element="{id}-action-button" placement="right-middle">
                <span>{text}</span>
              </calcite-tooltip>
            {/each}
          </calcite-action-group>
        </calcite-action-bar>
        <calcite-panel heading="Layers" height-scale="l" data-panel-id="layers" hidden>
          <div id="layers-container"></div>
        </calcite-panel>
        <calcite-panel heading="Basemaps" height-scale="l" data-panel-id="basemaps" hidden>
          <div id="basemaps-container"></div>
        </calcite-panel>
        <calcite-panel heading="Legend" height-scale="l" data-panel-id="legend" hidden>
          <div id="legend-container"></div>
        </calcite-panel>
        <calcite-panel heading="Bookmarks" height-scale="l" data-panel-id="bookmarks" hidden>
          <div id="bookmarks-container"></div>
        </calcite-panel>
        <calcite-panel heading="Print" height-scale="l" data-panel-id="print" hidden>
          <div id="print-container"></div>
        </calcite-panel>
        <calcite-panel heading="Details" data-panel-id="information" hidden>
          <div id="info-content">
            <img id="item-thumbnail" alt="webmap thumbnail" src="{itemThumbnailUrl}" />
            <div id="item-description">
              {@html sanitizeHtml(itemDescription, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'font']),
                allowedAttributes: {
                  a: ['href', 'name', 'target'],
                  font: ['style', 'color', 'face', 'size'],
                  div: ['style'],
                },
              }) || 'No description available'}
            </div>
            <calcite-button
              href="{itemPageUrl}"
              target="_blank"
              id="openInPortalButton"
              icon-end="launch"
            >
              View in Portal
            </calcite-button>
            <calcite-button
              href="{itemPageUrl.replace(
                'home/item.html?id=',
                'apps/mapviewer/index.html?webmap='
              )}"
              target="_blank"
              id="openInMapViewerButton"
              icon-end="launch"
              style="margin-top: 6px;"
            >
              Open in Map Viewer
            </calcite-button>
          </div>
        </calcite-panel>
        <slot name="sidebar--left-panels" />
      </calcite-shell-panel>
    {/if}

    {#if allActions.filter(({ side }) => side === 'right').length > 0}
      <calcite-shell-panel
        slot="panel-end"
        position="end"
        display-mode="docked"
        resizable
        collapsed="{!$options.activeWidget.right}"
      >
        <calcite-action-bar
          slot="action-bar"
          bind:this="{rightActionBar}"
          expanded="{$options.expanded.right}"
          on:calciteActionBarToggle="{() => ($options.expanded.right = !$options.expanded.right)}"
        >
          {#each allActions.filter(({ group, side }) => group !== 'end' && side === 'right') as { id, icon, text }}
            <calcite-action
              data-action-id="{id}"
              icon="{icon}"
              text="{text}"
              id="{id}-action-button"
            ></calcite-action>
            {#if !$options.expanded.right}
              <calcite-tooltip reference-element="{id}-action-button" placement="left-middle">
                <span>{text}</span>
              </calcite-tooltip>
            {/if}
          {/each}
          <calcite-action-group slot="actions-end">
            {#each allActions.filter(({ group, side }) => group === 'end' && side === 'right') as { id, icon, text }}
              <calcite-action
                data-action-id="{id}"
                icon="{icon}"
                text="{text}"
                id="{id}-action-button"
              ></calcite-action>
              <calcite-tooltip reference-element="{id}-action-button" placement="left-middle">
                <span>{text}</span>
              </calcite-tooltip>
            {/each}
          </calcite-action-group>
        </calcite-action-bar>
        <slot name="sidebar--right-panels" />
      </calcite-shell-panel>
    {/if}

    <calcite-panel>
      <div class="web-map" bind:this="{mapViewContainer}"></div>
      <div id="timeSlider"></div>
    </calcite-panel>
  </calcite-shell>
{:else}
  <div class="web-map" bind:this="{mapViewContainer}"></div>
  <div id="timeSlider"></div>
{/if}

<style>
  calcite-shell {
    position: relative;
    /* height: calc(100vh - var(--headerVisibleHeight)); */
  }

  div.web-map {
    height: 100%;
    width: 100%;
  }

  #info-content {
    padding: 10px;
  }

  #timeSlider {
    position: absolute;
    left: 5%;
    right: 5%;
    bottom: 20px;
  }

  /* force docked popup to be larger */
  .web-map :global(.esri-popup--is-docked .esri-popup__main-container) {
    width: 480px;
  }
</style>
