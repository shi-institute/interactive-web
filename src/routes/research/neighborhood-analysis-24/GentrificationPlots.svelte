<script lang="ts">
  import { browser } from '$app/environment';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { notEmpty } from '$utils/notEmpty';
  import * as Plot from '@observablehq/plot';
  import { html } from 'htl';
  import type { LayoutData } from './$types';

  export let data: LayoutData['gentrificationData'];

  let width = 0;

  //  remove tracts with less than 10 data points
  $: gentrificationData = Object.entries(Object.groupBy(data, (d) => d.Tract))
    .filter(([, series]) => series && series.length > 10)
    .flatMap(([, series]) => series)
    .filter(notEmpty);

  $: gentrificationFigures = Object.entries(Object.groupBy(gentrificationData, (d) => d.Tract)).map(
    ([tract, series = []]) => {
      const seriesTidyQuantiles = series.flatMap(({ year, ...rest }) => {
        return [
          { year, Type: 'Housing value (quantile)', data: rest.hvalue_quantile },
          { year, Type: 'Income (quantile)', data: rest.income_quantile },
        ];
      });

      const maxUSD = Math.max(
        ...series.flatMap(({ year, med_hv_tracts, avg_hh_inc }) => {
          return [med_hv_tracts, avg_hh_inc];
        })
      );

      const seriesTidyUSD = series.flatMap(({ year, ...rest }) => {
        const medianHouseValue = rest.med_hv_tracts;
        const averageHouseholdIncome = rest.avg_hh_inc;
        return [
          { year, Type: 'Housing value (median USD)', data: medianHouseValue },
          { year, Type: 'Income (average USD)', data: averageHouseholdIncome },
        ];
      });

      const quantilePlotConfig = {
        height: 300,
        width: (width - 80) / (width > 860 ? 2 : 1),
        caption:
          browser && width > 860
            ? html`
                <i>Data: FHFA / IRS / US Census</i>
              `
            : '',
        color: { legend: true },
        x: { type: 'linear', label: 'Year', tickFormat: 'd' },
        y: {
          type: 'linear',
          domain: [0, 1],
          label: 'Quantile',
          tickFormat: '.0%',
        },
        marginTop: 30,
        marginRight: 14,
        marginBottom: 40,
        marks: [
          Plot.lineY(seriesTidyQuantiles, {
            x: 'year',
            y: 'data',
            stroke: 'Type',
            tip: { format: { x: 'd', y: '.0%' } },
          }),
        ],
      };

      const usdPlotConfig = {
        height: 300,
        width: (width - 80) / (width > 860 ? 2 : 1),
        caption:
          browser && width <= 860
            ? html`
                <i>Data: FHFA / IRS / US Census</i>
              `
            : '',
        color: { legend: true },
        x: { type: 'linear', label: 'Year', tickFormat: 'd' },
        y: {
          type: 'linear',
          label: `US Dollars`,
          tickFormat: 's',
          domain: [0, maxUSD],
        },
        marginTop: 30,
        marginRight: 14,
        marginBottom: 40,
        marginLeft: 40,
        marks: [
          Plot.lineY(seriesTidyUSD, {
            x: 'year',
            y: 'data',
            stroke: 'Type',
            tip: { format: { x: 'd', y: '$,.0f' } },
          }),
        ],
      };

      const tractNeighborhoods = Array.from(
        new Set(series.flatMap(({ neighborhoods }) => neighborhoods))
      ).sort((a, b) => a.localeCompare(b));

      return {
        tract,
        tractNeighborhoods,
        quantilePlotConfig,
        usdPlotConfig,
      };
    }
  );
</script>

<svelte:window bind:innerWidth="{width}" />

{#if gentrificationData.length === 0}
  <p style="margin: 20px;">No gentrification data available.</p>
{/if}

{#each gentrificationFigures as { quantilePlotConfig, usdPlotConfig, tract, tractNeighborhoods }, i}
  <div class="figure-group">
    <figure>
      <h2>Housing and income quantiles and values</h2>
      <h3>Tract {tract}</h3>
      <h3>
        <i>{tractNeighborhoods.join(', ')}</i>
      </h3>
    </figure>
    <div class="row">
      <div class="col">
        <PlotContainer plot="{quantilePlotConfig}" />
      </div>
      <div class="col">
        <PlotContainer plot="{usdPlotConfig}" />
      </div>
    </div>
  </div>
{/each}

<style>
  .figure-group {
    border: 1px solid #80808040;
    padding: 20px;
    margin: 20px;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .row > .col {
    flex: 1;
  }

  @media (max-width: 860px) {
    .row {
      flex-direction: column;
    }
  }
</style>
