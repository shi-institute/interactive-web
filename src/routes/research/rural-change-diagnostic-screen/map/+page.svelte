<script lang="ts">
  import WebMap from '$lib/arcgis/WebMap.svelte';
  import { isEsriFeatureLayer } from '$utils/isEsriFeatureLayer';
  import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter.js';
  import CustomContent from '@arcgis/core/popup/content/CustomContent.js';
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

  let quantileDiffAtLeast = 10;
  let zctaTimeSeriesLayerView: __esri.FeatureLayerView | undefined = undefined;
  let zctaLayersViews: __esri.FeatureLayerView[] = [];

  // filter the layer by the q_diff value
  $: if (zctaTimeSeriesLayerView) {
    const filter = new FeatureFilter({ where: `q_diff >= ${quantileDiffAtLeast}` });
    zctaTimeSeriesLayerView.filter = filter;
    zctaLayersViews.forEach((layerView) => {
      layerView.filter = filter;
    });
  }

  async function onMapReady(evt: CustomEvent<{ map: __esri.WebMap; view: __esri.MapView }>) {
    // console.log(evt.detail.map.allLayers.map((layer) => ({ title: layer.title, id: layer.id })));
    const zctaTimeSeriesLayer = evt.detail.map.allLayers.find(
      (layer) => layer.id === ZCTA_TIME_SERIES_LAYER_ID
    );
    if (!isEsriFeatureLayer(zctaTimeSeriesLayer)) return;

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

    evt.detail.view.popup.when;

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
            year: new Date(attrs.Year_two_Converted).getFullYear(),
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
    zctaTimeSeriesLayer.popupTemplate.content = [
      customContentWidget,
      // ...(Array.isArray(zctaTimeSeriesLayer.popupTemplate.content)
      //   ? zctaTimeSeriesLayer.popupTemplate.content
      //   : []),
    ];
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
      // mode: 'instant',
      // tickConfigs: [
      //   {
      //     mode: 'position',
      //     values: Array.from({ length: 12 }, (_, i) =>
      //       new Date(`${2013 + i}-01-01T00:00:00.000-05:00`).getTime()
      //     ),
      //     labelsVisible: true,
      //     labelFormatFunction: (value) => {
      //       const date = new Date(value);
      //       return date.toISOString().split('T')[0];
      //       return `'${date.getUTCFullYear() - 2000}`;
      //     },
      //   },
      // ],
    },
  }}"
  actions="{[
    { id: 'filter', text: 'Filter', icon: 'filter', side: 'right' },
    { id: 'compare', text: 'Compare', icon: 'compare', side: 'right' },
  ]}"
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
      <div id="compare-container">
        <calcite-notice open>
          <div slot="title">Compare</div>
          <div slot="message">
            Select up to 10 ZCTAs to compare their housing value and income quantiles.
          </div>
          <calcite-link slot="link" title="my action">Learn more about the quantiles</calcite-link>
        </calcite-notice>
      </div>
    </calcite-panel>
  </svelte:fragment>
</WebMap>

<style>
  #filter-container,
  #compare-container {
    padding: var(--calcite-internal-panel-default-padding);
  }
</style>
