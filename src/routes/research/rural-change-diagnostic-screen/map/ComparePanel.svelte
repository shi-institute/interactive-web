<script lang="ts">
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { type PlotNode } from '$lib/PlotNodeManager';
  import { getZodSchemaFieldsShallow } from '$utils/getZodSchemaFields';
  import * as Plot from '@observablehq/plot';
  import { html } from 'htl';
  import z from 'zod';

  export let zctaTimeSeriesLayerView: __esri.FeatureLayerView;
  export let zctaList: (string | number)[] = [];
  export let tractTimeSeriesLayerView: __esri.FeatureLayerView;
  export let tractList: (string | number)[] = [];

  let loading = false;
  let dataErrorMessage = '';

  let selectedZCTAs: string[] = [];
  let selectedTracts: string[] = [];
  function handleComboboxChange(
    evt: Event & { target?: { value: (string | number)[] | (string | number) } }
  ) {
    if (Array.isArray(evt.target.value)) {
      const values = evt.target.value.map((v) => v.toString());
      selectedZCTAs = values.filter((v) => v.length === 5);
      selectedTracts = values.filter((v) => v.length !== 5);
    } else if (evt.target.value === '') {
      selectedZCTAs = [];
      selectedTracts = [];
      return;
    } else {
      const value = `${evt.target.value}`;
      if (value.length === 5) {
        selectedZCTAs = [value];
        selectedTracts = [];
      } else {
        selectedTracts = [value];
        selectedZCTAs = [];
      }
    }
  }

  const zctaAttrsSchema = z
    .object({
      zcta5: z.string().default(''),
      hvalue_quantile: z.number().nullable(),
      income_quantile: z.number().nullable(),
      avg_hh_inc: z.number().nullable(),
      median_house_value: z.number().nullable(),
      q_diff: z.number().nullable(),
      year_two_converted: z.string(),
    })
    .transform(({ zcta5, ...attrs }) => ({
      ...attrs,
      label: `${zcta5} (ZCTA)`,
    }));
  const tracrAttrsSchema = z
    .object({
      gisjoin: z.string().default(''),
      quantile__house_value: z.number().nullable(),
      quantile__income: z.number().nullable(),
      average_household_income: z.number().nullable(),
      median_house_value: z.number().nullable(),
      q_diff: z.number().nullable(),
      year: z.number(),
    })
    .transform(
      ({
        gisjoin,
        quantile__house_value,
        quantile__income,
        year,
        average_household_income,
        ...attrs
      }) => ({
        ...attrs,
        hvalue_quantile: quantile__house_value,
        income_quantile: quantile__income,
        year_two_converted: new Date(year, 0, 1).toISOString(),
        avg_hh_inc: average_household_income,
        label: `${gisjoin.slice(1)} (Tract)`,
      })
    );
  let data: z.infer<typeof zctaAttrsSchema>[] = [];
  function handleSelectionChange(selectedZCTAs: string[], selectedTracts: string[]) {
    if (selectedZCTAs.length === 0 && selectedTracts.length === 0) {
      data = [];
      return;
    }

    loading = true;
    dataErrorMessage = '';
    let promises: Promise<typeof data>[] = [];

    if (selectedZCTAs.length > 0) {
      const zctaData = zctaTimeSeriesLayerView.layer
        .queryFeatures({
          where: selectedZCTAs.map((zcta) => `zcta5 = '${zcta}'`).join(' OR '),
          outFields: getZodSchemaFieldsShallow(zctaAttrsSchema),
        })
        .then((featureSet) => featureSet.features.map((graphic) => ({ ...graphic.attributes })))
        .then((attrs) => zctaAttrsSchema.array().parse(attrs))
        .catch((error) => {
          console.error(error.issues || error);
          dataErrorMessage = 'Error loading ZCTA data (see console)';
          return [];
        });
      promises.push(zctaData);
    }

    if (selectedTracts.length > 0) {
      const tractData = tractTimeSeriesLayerView.layer
        .queryFeatures({
          where: selectedTracts.map((tract) => `gisjoin = 'G${tract}'`).join(' OR '),
          outFields: getZodSchemaFieldsShallow(tracrAttrsSchema),
        })
        .then((featureSet) => featureSet.features.map((graphic) => ({ ...graphic.attributes })))
        .then((attrs) => tracrAttrsSchema.array().parse(attrs))
        .catch((error) => {
          console.error(error.issues || error);
          dataErrorMessage = 'Error loading ZCTA data (see console)';
          return [];
        });
      promises.push(tractData);
    }

    Promise.all(promises)
      .then((results) => {
        data = results.flat();
      })
      .finally(() => {
        loading = false;
      });
  }
  $: handleSelectionChange(selectedZCTAs, selectedTracts);

  // get the colors for each ZCTA from the plot
  // and expose them paired with their ZCTAs as zctaSelection
  let plotNode: PlotNode;
  $: plotColorScale = (() => {
    const scale = plotNode?.scale?.('color');
    if (scale?.range && scale?.domain) {
      return { range: Array.from(scale.range), domain: Array.from(scale.domain) };
    }
  })();
  export let selection: [string, string][] = [];
  let showColorsOnMap = true;
  $: selection = (() => {
    if (selectedZCTAs.length === 0 && selectedTracts.length === 0) return [];
    if (!plotColorScale) return [];
    if (!showColorsOnMap) return [];
    return plotColorScale.domain.map((zcta, index) => {
      return [zcta, plotColorScale.range[index % (plotColorScale.range.length - 1)]];
    });
  })();

  $: seriesTidyQuantiles = data.flatMap(({ year_two_converted, label, ...rest }) => {
    const year = new Date(year_two_converted).getUTCFullYear();
    return [
      { year, type: 'house', data: rest.hvalue_quantile, label },
      { year, type: 'income', data: rest.income_quantile, label },
    ];
  });
</script>

<div id="compare-container">
  <calcite-notice open>
    <div slot="title">Compare</div>
    <div slot="message">
      Select areas of interest (AOIs) to compare their housing value and income quantiles.
    </div>
    <calcite-link slot="link" href="guide/understanding-quantiles">
      Learn more about the quantiles
    </calcite-link>
  </calcite-notice>

  <br />

  <calcite-label>
    AOIs to compare
    <calcite-combobox
      placeholder="Select a field"
      on:calciteComboboxChange="{handleComboboxChange}"
    >
      {#each tractList as tract}
        <calcite-combobox-item value="{tract}" text-label="{tract} (Tract)"></calcite-combobox-item>
      {/each}
      {#each zctaList as zcta}
        <calcite-combobox-item value="{zcta}" text-label="{zcta} (ZCTA)"></calcite-combobox-item>
      {/each}
    </calcite-combobox>
  </calcite-label>

  <calcite-label>
    <span>
      Show selection on the map
      <br />
      <i style="opacity: 0.7;">This will hide AOIs you have not selected</i>
    </span>
    <div class="switch">
      <span>Off</span>
      <calcite-switch
        checked="{showColorsOnMap}"
        on:calciteSwitchChange="{(evt) => {
          showColorsOnMap = evt.target.checked;
        }}"
      ></calcite-switch>
      <span>On</span>
    </div>
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
        bind:plotNode="{plotNode}"
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
          color: { legend: true, scheme: 'category10' },
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
                stroke: 'label',
                tip: { format: { x: 'd', y: '.0%' } },
              }
            ),
            Plot.lineY(
              seriesTidyQuantiles.filter(({ type }) => type === 'income'),
              {
                x: 'year',
                y: 'data',
                stroke: 'label',
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
