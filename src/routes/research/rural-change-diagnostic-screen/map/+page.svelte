<script lang="ts">
  import WebMap from '$lib/arcgis/WebMap.svelte';
  import { sageDSTOptionsStore } from '$stores/sageDstOptionsStore';
  import { isEsriFeatureLayer } from '$utils/isEsriFeatureLayer';
  import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
  import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter.js';
  import CustomContent from '@arcgis/core/popup/content/CustomContent.js';
  import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
  import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
  import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
  import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
  import ComparePanel from './ComparePanel.svelte';
  import orangeburgCityLimitsGeoJSON from './orangeburg_sc_city_limits.geo.json';
  import PopupZCTAs from './PopupZCTAs.svelte';

  export let data;

  const ZCTA_TIME_SERIES_LAYER_ID = 'zcta_time_series';
  const ZCTA_LAYER_IDS = [
    'zcta_2014',
    'zcta_2015',
    'zcta_2016',
    'zcta_2017',
    'zcta_2018',
    'zcta_2019',
    'zcta_2020',
    'zcta_2021',
  ];

  const TRACT_TIME_SERIES_LAYER_ID = 'tract_time_series';
  const TRACT_LAYER_IDS = [
    'tract_2021',
    'tract_2020',
    'tract_2019',
    'tract_2018',
    'tract_2017',
    'tract_2016',
    'tract_2015',
    'tract_2014',
  ];

  let quantileDiffAtLeast = 10;
  let zctaTimeSeriesLayerView: __esri.FeatureLayerView | undefined = undefined;
  let tractTimeSeriesLayerView: __esri.FeatureLayerView | undefined = undefined;
  let originalZctaTimeSeriesRenderer: __esri.Renderer | undefined = undefined;
  let originalTractTimeSeriesRenderer: __esri.Renderer | undefined = undefined;
  let zctaLayersViews: __esri.FeatureLayerView[] = [];
  let tractLayersViews: __esri.FeatureLayerView[] = [];
  let zctaList: (string | number)[] = [];
  let tractList: (string | number)[] = [];
  let zctaGroup: __esri.GroupLayer | undefined = undefined;
  let tractGroup: __esri.GroupLayer | undefined = undefined;

  function getSelection(arr: [string, string][], mode: 'ZCTA' | 'Tract') {
    return arr
      .filter(([name]) => name.endsWith(`(${mode})`))
      .map(([name, hexColor]) => [name.replace(` (${mode})`, ''), hexColor]);
  }

  let selection: [string, string][] = [];
  $: zctaHighlightFilterWhere =
    $sageDSTOptionsStore.activeWidget.right === 'compare' && selection.length > 0
      ? getSelection(selection, 'ZCTA')
          .map(([zcta]) => `zcta5 = '${zcta}'`)
          .join(' OR ')
      : '';
  $: tractHighlightFilterWhere =
    $sageDSTOptionsStore.activeWidget.right === 'compare' && selection.length > 0
      ? getSelection(selection, 'Tract')
          .map(([tract]) => `gisjoin = 'G${tract}'`)
          .join(' OR ')
      : '';

  // if there is a selection, show the ZCTA and Tract groups
  // and revert back to the previous visilibity when the selection is cleared
  $: selectionExists = selection.length > 0;
  let previousZctaGroupVisible = false;
  let previousTractGroupVisible = true;
  function triggerGroupVisibilityForSelection(selectionExists: boolean) {
    if (tractGroup) {
      tractGroup.set('visible', true);
    }
    if (zctaGroup && tractGroup) {
      previousZctaGroupVisible = zctaGroup.visible || false;
      previousTractGroupVisible = tractGroup.visible || false;
      if (selectionExists) {
        zctaGroup.set('visible', true);
        tractGroup.set('visible', true);
      } else {
        zctaGroup.set('visible', previousZctaGroupVisible);
        tractGroup.set('visible', previousTractGroupVisible);
      }
    }
  }
  $: triggerGroupVisibilityForSelection(selectionExists);

  $: if (zctaTimeSeriesLayerView) {
    // filter the visible layer
    // if there is a comparison filter, use it; otherwise, use the quantile difference threshold
    const quantileFilterWhere = `q_diff >= ${quantileDiffAtLeast}`;
    const filter = new FeatureFilter({
      where: zctaHighlightFilterWhere || quantileFilterWhere,
    });
    zctaTimeSeriesLayerView.filter = filter;
    zctaLayersViews.forEach((layerView) => {
      layerView.filter = filter;
    });

    // get a list of zip codes
    zctaTimeSeriesLayerView.layer
      .queryFeatures({
        where: quantileFilterWhere,
        outFields: ['zcta5'],
        returnGeometry: false,
      })
      .then((featureSet) => featureSet.features.map((graphic) => graphic.attributes.zcta5))
      .then((data) => (zctaList = Array.from(new Set(data))));

    // if there is a comparison filter, highlight the selected ZCTAs
    if (originalZctaTimeSeriesRenderer) {
      if (zctaHighlightFilterWhere || tractHighlightFilterWhere) {
        zctaTimeSeriesLayerView.layer.renderer = new UniqueValueRenderer({
          field: 'zcta5',
          uniqueValueInfos: getSelection(selection, 'ZCTA').map(([zcta, color]) => ({
            value: zcta,
            symbol: {
              type: 'simple-fill',
              color: color + '80',
              outline: {
                color: color,
                width: 2,
              },
            },
          })),
        });
      } else {
        zctaTimeSeriesLayerView.layer.renderer = originalZctaTimeSeriesRenderer;
      }
    }
  }

  $: if (tractTimeSeriesLayerView) {
    // filter the visible layer
    // if there is a comparison filter, use it; otherwise, use the quantile difference threshold
    const quantileFilterWhere = `quantile__difference >= ${quantileDiffAtLeast / 100}`;
    const filter = new FeatureFilter({
      where: tractHighlightFilterWhere || quantileFilterWhere,
    });
    tractTimeSeriesLayerView.filter = filter;
    tractLayersViews.forEach((layerView) => {
      layerView.filter = filter;
    });

    // get a list of tracts
    tractTimeSeriesLayerView.layer
      .queryFeatures({
        where: quantileFilterWhere,
        outFields: ['gisjoin'],
        returnGeometry: false,
      })
      .then((featureSet) =>
        featureSet.features.map((graphic) => graphic.attributes.gisjoin.slice(1))
      )
      .then((data) => (tractList = Array.from(new Set(data))));

    // if there is a comparison filter, highlight the selected tracts
    if (originalTractTimeSeriesRenderer) {
      if (zctaHighlightFilterWhere || tractHighlightFilterWhere) {
        tractTimeSeriesLayerView.layer.renderer = new UniqueValueRenderer({
          field: 'gisjoin',
          uniqueValueInfos: getSelection(selection, 'Tract').map(([tract, color]) => ({
            value: `G${tract}`,
            symbol: {
              type: 'simple-fill',
              color: color + '80',
              outline: {
                color: color,
                width: 2,
              },
            },
          })),
        });
      } else {
        tractTimeSeriesLayerView.layer.renderer = originalTractTimeSeriesRenderer;
      }
    }
  }

  async function handleMapReadyForZCTAs(
    evt: CustomEvent<{ map: __esri.WebMap; view: __esri.MapView }>
  ) {
    const zctaTimeSeriesLayer = evt.detail.map.allLayers.find(
      (layer) => layer.id === ZCTA_TIME_SERIES_LAYER_ID
    );
    if (!isEsriFeatureLayer(zctaTimeSeriesLayer)) return;
    originalZctaTimeSeriesRenderer = zctaTimeSeriesLayer.renderer;

    const zctaLayers = evt.detail.map.allLayers.filter(
      (layer) => ZCTA_LAYER_IDS.includes(layer.id) && isEsriFeatureLayer(layer)
    ) as __esri.Collection<__esri.FeatureLayer>;

    // ignore the filter set on the layer on the server side
    // (likely inherited from the web map filter)
    // so that we can control the filter in this app
    // read about filtering at https://developers.arcgis.com/javascript/latest/query-filter/
    zctaTimeSeriesLayer.definitionExpression = '';
    zctaLayers.forEach((layer) => {
      layer.definitionExpression = '';
    });

    // get the layers' views
    zctaTimeSeriesLayerView = await evt.detail.view.whenLayerView(zctaTimeSeriesLayer);
    zctaLayersViews = await Promise.all(
      zctaLayers.map((layer) => evt.detail.view.whenLayerView(layer))
    );

    // customize the popup title
    zctaTimeSeriesLayer.popupTemplate.title = 'ZCTA: {BASENAME}';

    // add custom content in front of the existing popup content
    const customContentWidget = new CustomContent({
      outFields: ['*'],
      creator: async (evt) => {
        if (!evt) return '';
        const attrs: Record<string, never> = evt.graphic.attributes || {};
        const div = document.createElement('div');

        const migrationAndServiceWorkerData = data.migrationAndServiceWorkerData.zcta.filter(
          (zcta) => zcta.ZCTA5 === attrs.zcta5 || zcta.ZCTA5 === 'MEDIAN'
        );

        new PopupZCTAs({
          target: div,
          props: {
            ...attrs,
            q_diff: parseFloat(attrs.q_diff) / 100,
            year: new Date(attrs.year_two_converted).getUTCFullYear(),
            series: await zctaTimeSeriesLayer
              .queryFeatures({
                where: `zcta5 = '${attrs.zcta5}'`,
                outFields: [
                  'hvalue_quantile',
                  'income_quantile',
                  'avg_hh_inc',
                  'median_house_value',
                  'q_diff',
                  'year_two_converted',
                ],
              })
              .then((featureSet) =>
                featureSet.features.map((graphic) => ({ ...graphic.attributes }))
              ),
            migrationAndServiceWorkerData: (migrationAndServiceWorkerData || []).map(
              ({
                migration__different_county_fraction,
                migration__different_state_fraction,
                service_worker_fraction,
                year,
                ZCTA5,
              }) => {
                return {
                  migration__different_county_fraction:
                    migration__different_county_fraction || undefined,
                  migration__different_state_fraction:
                    migration__different_state_fraction || undefined,
                  service_worker_fraction: service_worker_fraction || undefined,
                  year,
                  id: ZCTA5 === 'MEDIAN' ? 'Median\n(all ZCTAs)' : 'This ZCTA',
                };
              }
            ),
          },
        });
        return div;
      },
    });
    zctaTimeSeriesLayer.popupTemplate.content = [customContentWidget];
  }

  async function handleMapReadyForTracts(
    evt: CustomEvent<{ map: __esri.WebMap; view: __esri.MapView }>
  ) {
    const tractTimeSeriesLayer = evt.detail.map.allLayers.find(
      (layer) => layer.id === TRACT_TIME_SERIES_LAYER_ID
    );
    if (!isEsriFeatureLayer(tractTimeSeriesLayer)) return;
    originalTractTimeSeriesRenderer = tractTimeSeriesLayer.renderer;

    const tractLayers = evt.detail.map.allLayers.filter(
      (layer) => TRACT_LAYER_IDS.includes(layer.id) && isEsriFeatureLayer(layer)
    ) as __esri.Collection<__esri.FeatureLayer>;

    // ignore the filter set on the layer on the server side
    // (likely inherited from the web map filter)
    // so that we can control the filter in this app
    // read about filtering at https://developers.arcgis.com/javascript/latest/query-filter/
    tractTimeSeriesLayer.definitionExpression = '';
    tractLayers.forEach((layer) => {
      layer.definitionExpression = '';
    });

    // get the layers' views
    tractTimeSeriesLayerView = await evt.detail.view.whenLayerView(tractTimeSeriesLayer);
    tractLayersViews = await Promise.all(
      tractLayers.map((layer) => evt.detail.view.whenLayerView(layer))
    );

    // customize the popup title
    // tractTimeSeriesLayer.popupTemplate.title = 'Tract: {geoid_y}';

    // add custom content in front of the existing popup content
    const customContentWidget = new CustomContent({
      outFields: ['*'],
      creator: async (evt) => {
        if (!evt) return '';
        const attrs: Record<string, never> = evt.graphic.attributes || {};
        const div = document.createElement('div');

        const migrationAndServiceWorkerData = data.migrationAndServiceWorkerData.tract.filter(
          (tract) => tract.GISJOIN?.slice(1) == attrs.geoid_y || tract.GISJOIN === 'MEDIAN'
        );

        new PopupZCTAs({
          target: div,
          props: {
            ...attrs,
            q_diff: parseFloat(attrs.q_diff) / 100,
            year: attrs.year,
            avg_hh_inc: attrs.average_household_income,
            series: await tractTimeSeriesLayer
              .queryFeatures({
                where: `gisjoin = '${attrs.gisjoin}'`,
                outFields: [
                  'quantile__house_value',
                  'quantile__income',
                  'average_household_income',
                  'median_house_value',
                  'quantile__difference',
                  'year',
                ],
              })
              .then((featureSet) =>
                featureSet.features
                  .map((graphic) => ({ ...graphic.attributes }))
                  .map((attrs) => {
                    return {
                      hvalue_quantile: attrs.quantile__house_value,
                      income_quantile: attrs.quantile__income,
                      avg_hh_inc: attrs.average_household_income,
                      median_house_value: attrs.median_house_value,
                      q_diff: attrs.quantile__difference,
                      year_two_converted: `${attrs.year}-01-01`,
                    };
                  })
              ),
            migrationAndServiceWorkerData: (migrationAndServiceWorkerData || []).map(
              ({
                migration__different_county_fraction,
                migration__different_state_fraction,
                service_worker_fraction,
                year,
                GISJOIN,
              }) => {
                return {
                  migration__different_county_fraction:
                    migration__different_county_fraction || undefined,
                  migration__different_state_fraction:
                    migration__different_state_fraction || undefined,
                  service_worker_fraction: service_worker_fraction || undefined,
                  year,
                  id: GISJOIN === 'MEDIAN' ? 'Median\n(all tracts)' : 'This Tract',
                };
              }
            ),
          },
        });
        return div;
      },
    });
    tractTimeSeriesLayer.popupTemplate.content = [customContentWidget];
  }

  async function addOrangeburgDataForSLI(
    evt: CustomEvent<{ map: __esri.WebMap; view: __esri.MapView }>
  ) {
    const gunterFarmsGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-80.69658173835441, 33.23476303873089],
      },
      properties: {
        name: 'Gunter Farms',
      },
    };

    const gunterFarmsLayer = (() => {
      const blob = new Blob([JSON.stringify(gunterFarmsGeoJSON)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const layer = new GeoJSONLayer({
        url,
        title: 'Gunter Farms',
        labelingInfo: [
          {
            labelExpressionInfo: { expression: '$feature.name' },
            symbol: {
              type: 'text',
              color: 'black',
              haloSize: 1,
              haloColor: 'white',
            },
          },
        ],
        renderer: new SimpleRenderer({
          symbol: new SimpleMarkerSymbol({
            size: 6,
            color: [0, 255, 255],
            outline: {
              color: [0, 0, 0],
              width: 1,
            },
          }),
        }),
      });
      return layer;
    })();

    const orangeburgCityLimitsLayer = (() => {
      const blob = new Blob([JSON.stringify(orangeburgCityLimitsGeoJSON)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const layer = new GeoJSONLayer({
        url,
        title: 'Orangeburg City Limits',
        labelingInfo: [
          {
            labelExpressionInfo: { expression: '$feature.name' },
            symbol: {
              type: 'text',
              color: 'black',
              haloSize: 1,
              haloColor: 'white',
            },
          },
        ],
        renderer: new SimpleRenderer({
          symbol: new SimpleFillSymbol({
            color: null,
            outline: {
              color: [0, 0, 0],
              width: 3,
            },
          })
        }),
  
      });
      return layer;
    })();

    evt.detail.map.add(gunterFarmsLayer);
    evt.detail.map.add(orangeburgCityLimitsLayer)
  }

  async function onMapReady(evt: CustomEvent<{ map: __esri.WebMap; view: __esri.MapView }>) {
    await handleMapReadyForZCTAs(evt);
    await handleMapReadyForTracts(evt);
    await addOrangeburgDataForSLI(evt);

    const groupLayers = evt.detail.map.layers.filter((layer) => layer.type === 'group');
    zctaGroup = groupLayers.find((layer) => layer.title.endsWith(' (ZCTAs)')) as
      | __esri.GroupLayer
      | undefined;
    tractGroup = groupLayers.find((layer) => layer.title.endsWith(' (Tracts)')) as
      | __esri.GroupLayer
      | undefined;
  }
</script>

<WebMap
  webMapProps="{{
    portalItem: {
      id: '31b40c17e0db476ab82de47c6ab16533',
      portal: { url: 'https://gis.furman.edu/portal' },
      apiKey: data.token,
    },
  }}"
  shell="{{
    actions: { print: false, bookmarks: false },
    timeSlider: {
      inheritPropertiesFromWebMap: true,
      mode: 'instant',

      // format the time slider min, max, and time window labels
      labelFormatFunction: (value, type, element) => {
        if (!element) return;

        // since we are using the 'instant' mode, the window
        // will always be two of the same dates
        if (Array.isArray(value)) {
          element.innerText = `Areas of interest\n${new Date(value[0]).getUTCFullYear()}`;
          element.style.textAlign = 'center';
          return;
        }

        element.innerText = `${new Date(value).getUTCFullYear()}`;
      },

      // show ticks for every year
      tickConfigs: [
        {
          mode: 'position',
          values: Array.from({ length: 8 }, (_, i) =>
            new Date(`${2014 + i}-01-01T00:00:00.000-05:00`).getTime()
          ),
          labelsVisible: true,
          // only show the year as a number
          labelFormatFunction: (value) => {
            const date = new Date(value);
            return `${date.getUTCFullYear()}`;
          },
        },
      ],
    },
  }}"
  actions="{[
    { id: 'filter', text: 'Filter', icon: 'filter', side: 'right' },
    { id: 'compare', text: 'Compare', icon: 'compare', side: 'right' },
  ]}"
  options="{sageDSTOptionsStore}"
  on:ready="{onMapReady}"
>
  <svelte:fragment slot="sidebar--right-panels">
    <calcite-panel heading="Filter" height-scale="l" data-panel-id="filter" hidden>
      <div id="filter-container">
        <calcite-notice open>
          <div slot="title">How do you pick a threshold?</div>
          <div slot="message">
            A larger threshold will only show tracts or ZCTAs that are more at risk of redevelopment
            or gentrification.
          </div>
          <calcite-link slot="link" href="guide/understanding-quantiles">
            Read more about quantiles
          </calcite-link>
          <calcite-link slot="link" href="guide/understanding-quantiles">
            Read more interpretation
          </calcite-link>
        </calcite-notice>

        <br />

        <calcite-label>
          Threshold
          <calcite-input-number
            placeholder="Enter a number"
            step="1"
            value="{quantileDiffAtLeast}"
            on:calciteInputNumberChange="{(evt) => {
              quantileDiffAtLeast = evt.target.value;
            }}"
          ></calcite-input-number>
        </calcite-label>
      </div>
    </calcite-panel>
    <calcite-panel heading="Compare multiple AOIs" height-scale="l" data-panel-id="compare" hidden>
      {#if zctaTimeSeriesLayerView && tractTimeSeriesLayerView}
        <ComparePanel
          tractList="{tractList}"
          tractTimeSeriesLayerView="{tractTimeSeriesLayerView}"
          zctaList="{zctaList}"
          zctaTimeSeriesLayerView="{zctaTimeSeriesLayerView}"
          bind:selection="{selection}"
        />
      {:else}
        <calcite-loader active></calcite-loader>
      {/if}
    </calcite-panel>
  </svelte:fragment>
</WebMap>

<style>
  #filter-container {
    padding: var(--calcite-internal-panel-default-padding);
  }
</style>
