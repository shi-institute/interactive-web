<script lang="ts">
  import { notEmpty } from '$utils/notEmpty';
  import MapView from '@arcgis/core/views/MapView';
  import WebMap from '@arcgis/core/WebMap';
  import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
  import Bookmarks from '@arcgis/core/widgets/Bookmarks';
  import LayerList from '@arcgis/core/widgets/LayerList';
  import Legend from '@arcgis/core/widgets/Legend';
  import Print from '@arcgis/core/widgets/Print';
  import TimeSlider from '@arcgis/core/widgets/TimeSlider.js';
  import { error } from '@sveltejs/kit';
  import { createEventDispatcher, onMount } from 'svelte';

  import * as timeUtils from '@arcgis/core/support/timeUtils.js';

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
  let activeWidget: { left: string | null; right: string | null } = { left: null, right: null };

  let itemDescription = '';
  let itemThumbnailUrl = '';
  let itemRating = 0;
  let itemPageUrl = '';

  onMount(() => {
    map = new WebMap(webMapProps);
    view = new MapView({
      map,
      container: mapViewContainer,
      ...mapViewProps,
    });

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
        if (activeWidget[bar]) {
          const activeWidgetPanelElem = document.querySelector(
            `[data-panel-id=${activeWidget[bar]}]`
          ) as HTMLElement | undefined;
          const activeWidgetButtonElem = document.querySelector(
            `[data-action-id=${activeWidget[bar]}]`
          ) as (HTMLElement & { active?: boolean }) | undefined;
          if (activeWidgetPanelElem && activeWidgetButtonElem) {
            activeWidgetButtonElem.active = false;
            activeWidgetPanelElem.hidden = true;
          }
        }

        const nextWidget = target.dataset.actionId ?? null;
        // activate the clicked widget/panel
        if (nextWidget !== activeWidget[bar]) {
          const nextWidgetPanelElem = document.querySelector(`[data-panel-id=${nextWidget}]`) as
            | HTMLElement
            | undefined;
          const nextWidgetButtonElem = document.querySelector(`[data-action-id=${nextWidget}]`) as
            | (HTMLElement & { active?: boolean })
            | undefined;
          if (nextWidgetPanelElem && nextWidgetButtonElem) {
            nextWidgetButtonElem.active = true;
            nextWidgetPanelElem.hidden = false;
            activeWidget[bar] = nextWidget;
          } else {
            console.error(`Could not find the element with the data-action-id of ${nextWidget}`);
            activeWidget[bar] = null;
          }
        }
        // if the clicked widget was the one that was active, then there is no active widget
        // because we closed it earlier
        else {
          activeWidget[bar] = null;
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

    const print = new Print({
      view,
      container: 'print-container',
    });

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
  });
</script>

<svelte:head>
  <script src="https://js.arcgis.com/calcite-components/2.11.1/calcite.esm.js" type="module">
  </script>
  <link rel="stylesheet" href="https://js.arcgis.com/calcite-components/2.11.1/calcite.css" />
  <script src="https://js.arcgis.com/4.30/"></script>
  <link rel="stylesheet" href="https://js.arcgis.com/4.30/esri/themes/light/main.css" />
</svelte:head>

{#if shell}
  <calcite-shell>
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
        collapsed="{!activeWidget.left}"
      >
        <calcite-action-bar slot="action-bar" bind:this="{leftActionBar}" class="calcite-mode-dark">
          {#each allActions.filter(({ group, side }) => group !== 'end' && side !== 'right') as { id, icon, text }}
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
              {itemDescription || 'No description available'}
            </div>
            <calcite-label layout="inline">
              <b>Rating:</b>
              <calcite-rating id="item-rating" read-only>
                {itemRating}
              </calcite-rating>
            </calcite-label>
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
        collapsed="{!activeWidget.right}"
      >
        <calcite-action-bar slot="action-bar" bind:this="{rightActionBar}">
          {#each allActions.filter(({ group, side }) => group !== 'end' && side === 'right') as { id, icon, text }}
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
    height: calc(100vh - var(--headerVisibleHeight));
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
</style>
