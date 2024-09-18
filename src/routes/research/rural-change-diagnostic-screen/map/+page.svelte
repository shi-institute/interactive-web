<script lang="ts">
  import WebMap from '$lib/arcgis/WebMap.svelte';
  import { sageDSTOptionsStore } from '$stores/sageDstOptionsStore';
  import { isEsriFeatureLayer } from '$utils/isEsriFeatureLayer';
  import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter.js';
  import CustomContent from '@arcgis/core/popup/content/CustomContent.js';
  import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
  import ComparePanel from './ComparePanel.svelte';
  import PopupZCTAs from './PopupZCTAs.svelte';

  const ZCTA_TIME_SERIES_LAYER_ID = '1915220f14c-layer-20';
  const ZCTA_LAYER_IDS = [
    '19151a24efa-layer-9', // 2014
    '19151a25b19-layer-10', // 2015
    '19151a260b7-layer-11', // 2016
    '19151a26574-layer-12', // 2017
    '19151a26979-layer-13', // 2018
    '19151a27a36-layer-14', // 2019
    '191527c4adf-layer-16', // 2020
    '1914c956a53-layer-8', // 2021
  ];

  const TRACT_TIME_SERIES_LAYER_ID = '19201440858-layer-18';
  const TRACT_LAYER_IDS = [
    '1920144085a-layer-19', // 2021_rural
    '1920144085b-layer-20', // 2020_rural
    '1920144085d-layer-21', // 2019_rural
    '1920144085e-layer-22', // 2018_rural
    '19201440860-layer-23', // 2017_rural
    '19201440861-layer-24', // 2016_rural
    '19201440862-layer-25', // 2015_rural
    '19201440864-layer-26', // 2014_rural
  ];

  let quantileDiffAtLeast = 10;
  let zctaTimeSeriesLayerView: __esri.FeatureLayerView | undefined = undefined;
  let tractTimeSeriesLayerView: __esri.FeatureLayerView | undefined = undefined;
  let originalZctaTimeSeriesRenderer: __esri.Renderer | undefined = undefined;
  let originalTractTimeSeriesRenderer: __esri.Renderer | undefined = undefined;
  let zctaLayersViews: __esri.FeatureLayerView[] = [];
  let tractLayersViews: __esri.FeatureLayerView[] = [];
  let zctaList: (string | number)[] = [];

  let zctaSelection: string[] = [];
  $: zctaHighlightFilterWhere =
    $sageDSTOptionsStore.activeWidget.right === 'compare' && zctaSelection.length > 0
      ? zctaSelection.map((pair) => `ZCTA5 = ${pair[0]}`).join(' OR ')
      : '';

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
        outFields: ['ZCTA5'],
        returnGeometry: false,
      })
      .then((featureSet) => featureSet.features.map((graphic) => graphic.attributes.ZCTA5))
      .then((data) => (zctaList = Array.from(new Set(data))));

    // if there is a comparison filter, highlight the selected ZCTAs
    if (originalZctaTimeSeriesRenderer) {
      if (zctaHighlightFilterWhere) {
        console.log(originalZctaTimeSeriesRenderer);
        zctaTimeSeriesLayerView.layer.renderer = new UniqueValueRenderer({
          field: 'ZCTA5',
          uniqueValueInfos: zctaSelection.map(([zcta, color]) => ({
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
      where: quantileFilterWhere,
    });
    tractTimeSeriesLayerView.filter = filter;
    tractLayersViews.forEach((layerView) => {
      layerView.filter = filter;
    });
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
        new PopupZCTAs({
          target: div,
          props: {
            ...attrs,
            q_diff: parseFloat(attrs.q_diff) / 100,
            year: new Date(attrs.Year_two_Converted).getUTCFullYear(),
            series: await zctaTimeSeriesLayer
              .queryFeatures({
                where: `ZCTA5 = '${attrs.ZCTA5}'`,
                outFields: [
                  'hvalue_quantile',
                  'income_quantile',
                  'avg_hh_inc',
                  'median_house_value',
                  'q_diff',
                  'Year_two_Converted',
                ],
              })
              .then((featureSet) =>
                featureSet.features.map((graphic) => ({ ...graphic.attributes }))
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
    tractTimeSeriesLayer.popupTemplate.title = 'Tract: {GISJOIN}';

    // add custom content in front of the existing popup content
    const customContentWidget = new CustomContent({
      outFields: ['*'],
      creator: async (evt) => {
        if (!evt) return '';
        const attrs: Record<string, never> = evt.graphic.attributes || {};
        const div = document.createElement('div');
        console.log(attrs);
        new PopupZCTAs({
          target: div,
          props: {
            ...attrs,
            q_diff: parseFloat(attrs.q_diff) / 100,
            year: attrs.year,
            avg_hh_inc: attrs.average_household_income,
            series: await tractTimeSeriesLayer
              .queryFeatures({
                where: `GISJOIN = '${attrs.GISJOIN}'`,
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
                      Year_two_Converted: `${attrs.year}-01-01`,
                    };
                  })
              ),
          },
        });
        return div;
      },
    });
    tractTimeSeriesLayer.popupTemplate.content = [customContentWidget];
  }

  async function onMapReady(evt: CustomEvent<{ map: __esri.WebMap; view: __esri.MapView }>) {
    console.log(
      Array.from(evt.detail.map.allLayers.map((layer) => ({ title: layer.title, id: layer.id })))
    );

    await handleMapReadyForZCTAs(evt);
    await handleMapReadyForTracts(evt);
  }
</script>

<WebMap
  webMapProps="{{
    portalItem: { id: '4d1ec76f5ac2438d827c945b23c772e4' },
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
          element.innerText = `Areas of Interest (ZCTAs)\n${new Date(value[0]).getUTCFullYear()}`;
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

        <calcite-notice open>
          <div slot="title">How do you pick a threshold?</div>
          <div slot="message">Explain what the quantiles mean and give advice</div>
          <calcite-link slot="link" title="my action">Read more</calcite-link>
        </calcite-notice>
      </div>
    </calcite-panel>
    <calcite-panel heading="Compare multiple ZCTAs" height-scale="l" data-panel-id="compare" hidden>
      {#if zctaTimeSeriesLayerView}
        <ComparePanel
          zctaList="{zctaList}"
          zctaTimeSeriesLayerView="{zctaTimeSeriesLayerView}"
          bind:zctaSelection="{zctaSelection}"
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
