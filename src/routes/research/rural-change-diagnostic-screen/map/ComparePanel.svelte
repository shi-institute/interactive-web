<script lang="ts">
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { getZodSchemaFieldsShallow } from '$utils/getZodSchemaFields';
  import * as Plot from '@observablehq/plot';
  import { html } from 'htl';
  import z from 'zod';

  export let zctaTimeSeriesLayerView: __esri.FeatureLayerView;
  export let zctaList: (string | number)[] = [];

  let loading = false;
  let dataErrorMessage = '';

  let selectedZCTAs: string[] = [];
  function handleComboboxChange(
    evt: Event & { target?: { value: (string | number)[] | (string | number) } }
  ) {
    if (Array.isArray(evt.target.value)) {
      selectedZCTAs = evt.target.value.map((v) => v.toString());
    } else {
      selectedZCTAs = [`${evt.target.value}`];
    }
  }

  const attrsSchema = z.object({
    ZCTA5: z.string(),
    hvalue_quantile: z.number().nullable(),
    income_quantile: z.number().nullable(),
    avg_hh_inc: z.number().nullable(),
    median_house_value: z.number().nullable(),
    q_diff: z.number().nullable(),
    Year_two_Converted: z.string(),
  });
  let data: z.infer<typeof attrsSchema>[] = [];
  function handleZCTAsChange() {
    if (selectedZCTAs.length === 0) {
      data = [];
      return;
    }

    loading = true;
    dataErrorMessage = '';

    zctaTimeSeriesLayerView.layer
      .queryFeatures({
        where: 'ZCTA5 in (' + selectedZCTAs.join(',') + ')',
        outFields: getZodSchemaFieldsShallow(attrsSchema),
      })
      .then((featureSet) => featureSet.features.map((graphic) => ({ ...graphic.attributes })))
      .then((attrs) => attrsSchema.array().parse(attrs))
      .then((attrs) => (data = attrs))
      .catch((error) => {
        console.error(error.issues);
        dataErrorMessage = 'Error loading data (see console)';
      })
      .finally(() => {
        loading = false;
      });
  }
  $: {
    selectedZCTAs;
    handleZCTAsChange();
  }

  $: seriesTidyQuantiles = data.flatMap(({ Year_two_Converted, ZCTA5, ...rest }) => {
    const year = new Date(Year_two_Converted).getUTCFullYear();
    return [
      { year, type: 'house', data: rest.hvalue_quantile, ZCTA: ZCTA5 },
      { year, type: 'income', data: rest.income_quantile, ZCTA: ZCTA5 },
    ];
  });
</script>

<div id="compare-container">
  <calcite-notice open>
    <div slot="title">Compare</div>
    <div slot="message">Select ZCTAs to compare their housing value and income quantiles.</div>
    <calcite-link slot="link" title="my action">Learn more about the quantiles</calcite-link>
  </calcite-notice>

  <br />

  <calcite-label>
    ZCTAs to compare
    <calcite-combobox
      placeholder="Select a field"
      on:calciteComboboxChange="{handleComboboxChange}"
    >
      {#each zctaList as zcta}
        <calcite-combobox-item value="{zcta}" text-label="{zcta}"></calcite-combobox-item>
      {/each}
    </calcite-combobox>
  </calcite-label>

  {#if loading}
    <calcite-loader type="indeterminate" label="Loading data"></calcite-loader>
  {:else if dataErrorMessage}
    <calcite-alert color="red" scale="s" auto-dismiss>
      <div slot="message">{dataErrorMessage}</div>
    </calcite-alert>
  {:else if seriesTidyQuantiles.length > 0}
    <div class="plot-wrapper">
      <PlotContainer
        fullWidth
        enablePopup
        plotClass="{'zcta-quantile-compare-plot'}"
        plot="{{
          subtitle: html`
            <span class="line-legend">
              <span class="line solid">——</span>
              Housing value quantile
              <span class="line">&nbsp;&nbsp;- - -</span>
              Income quantile
              <span></span>
            </span>
          `,
          height: 300,
          color: { legend: true, type: 'ordinal', tickFormat: 'd', scheme: 'category10' },
          x: { type: 'linear', label: 'Year', tickFormat: 'd' },
          y: { type: 'linear', domain: [0, 1], label: 'Quantile', tickFormat: '.0%' },
          marginTop: 30,
          marginRight: 14,
          marginBottom: 40,
          marks: [
            Plot.lineY(
              seriesTidyQuantiles.filter(({ type }) => type === 'house'),
              {
                x: 'year',
                y: 'data',
                stroke: 'ZCTA',
                tip: { format: { x: 'd', y: '.0%' } },
              }
            ),
            Plot.lineY(
              seriesTidyQuantiles.filter(({ type }) => type === 'income'),
              {
                x: 'year',
                y: 'data',
                stroke: 'ZCTA',
                strokeDasharray: '5,5',
                tip: { format: { x: 'd', y: '.0%' } },
              }
            ),
          ],
        }}"
      >
        <svelte:fragment slot="popup-before">
          <h2 style="margin: 0;">House value and income quantiles over time</h2>
          <div style="margin-bottom: 10px;">Multiple ZCTAs, 2014-2021</div>
        </svelte:fragment>
      </PlotContainer>
    </div>
  {/if}
</div>

<style>
  #compare-container {
    padding: var(--calcite-internal-panel-default-padding);
  }

  .plot-wrapper {
    margin-bottom: 24px;
  }
  :global(.zcta-quantile-compare-plot svg) {
    background-color: transparent;
  }
  :global(.zcta-quantile-compare-plot .line-legend) {
    font-family: 'JetBrains Mono', 'JetBrains Mono Embedded', monospace;
    font-weight: 500;
    font-size: 12px;
  }
  :global(.zcta-quantile-compare-plot .line-legend .line) {
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 12px;
  }
  :global(.zcta-quantile-compare-plot .line-legend .solid) {
    letter-spacing: -0.2em;
  }
</style>
