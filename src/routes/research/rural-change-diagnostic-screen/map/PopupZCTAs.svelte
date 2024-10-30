<script lang="ts">
  import { colors } from '$lib/colors';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { adjustForInflation } from '$utils/adjustForInflation';
  import * as Plot from '@observablehq/plot';
  import * as d3 from 'd3';
  import { format } from 'd3-format';
  import { html } from 'htl';

  format('.2s')(1000); // "1k"

  export let year: number;
  export let series: {
    hvalue_quantile: number;
    income_quantile: number;
    avg_hh_inc: number;
    median_house_value: number;
    q_diff: string;
    Year_two_Converted: string; // ISO date without time
  }[];
  export let migrationAndServiceWorkerData: {
    migration__different_county_fraction: number | undefined;
    migration__different_state_fraction: number | undefined;
    service_worker_fraction: number | undefined;
    year: string;
    id: string;
  }[];

  let showAllData = false;

  const frontTablePropsLabels: ([string, string] | [string, string, string])[] = [
    // ['hvalue_quantile', 'Housing value quantile'],
    // ['income_quantile', 'Income value quantile'],
    // ['q_diff', 'County'],
    ['avg_hh_inc', 'Average household income', '$,.0f'],
    ['median_house_value', 'Median house value', '$,.0f'],
    ['County', 'County'],
    ['zcta', 'ZCTA'],
    ['q_diff', 'Quantile Difference', '.0%'],
    // ['ZCTA5', 'Zip code tabulation area (2020)'],
  ];

  const seriesTidyQuantiles = series.flatMap(({ Year_two_Converted, ...rest }) => {
    const year = new Date(Year_two_Converted).getUTCFullYear();
    return [
      { year, Type: 'Housing value (quantile)', data: rest.hvalue_quantile },
      { year, Type: 'Income (quantile)', data: rest.income_quantile },
    ];
  });

  let adjustDataForInflation = true;
  let maxUSD = Math.max(
    ...series.flatMap(({ Year_two_Converted, median_house_value, avg_hh_inc }) => {
      const year = new Date(Year_two_Converted).getUTCFullYear();
      return [
        adjustForInflation(median_house_value, year, 2020),
        adjustForInflation(avg_hh_inc, year, 2020),
      ];
    })
  );
  $: seriesTidyUSD = series.flatMap(({ Year_two_Converted, ...rest }) => {
    const year = new Date(Year_two_Converted).getUTCFullYear();

    const medianHouseValue = adjustDataForInflation
      ? adjustForInflation(rest.median_house_value, year, 2020)
      : rest.median_house_value;
    const averageHouseholdIncome = adjustDataForInflation
      ? adjustForInflation(rest.avg_hh_inc, year, 2020)
      : rest.avg_hh_inc;

    return [
      { year, Type: 'Housing value (median USD)', data: medianHouseValue },
      { year, Type: 'Income (average USD)', data: averageHouseholdIncome },
    ];
  });
</script>

<h3>Year {year}</h3>

<table class="esri-widget__table" summary="List of attributes and values">
  <tbody>
    {#each frontTablePropsLabels as [key, label, formatStr]}
      {@const value = $$props[key]}
      {#if value}
        {@const formatter = formatStr ? format(formatStr) : undefined}
        <tr>
          <th class="esri-feature-fields__field-header">{label}</th>
          <td class="esri-feature-fields__field-data">{formatter ? formatter(value) : value}</td>
        </tr>
      {/if}
    {/each}
  </tbody>
</table>

<h3>Quantiles over time</h3>
<p style="margin-bottom: 0;">
  A gap where the housing value quantile is greater than the income quantile indicates
  gentrification.
</p>
<ul style="margin-top: 0; padding-inline-start: 20px;">
  <li>If the gap is small, there is little to no gentrification.</li>
  <li>If the gap is recently opened, gentrification is in the early stages.</li>
  <li>If the gap is closing, gentrification is in the late stages.</li>
  <li>
    If the income quantile is greater than the housing value quantile, the area is recently
    gentrified.
  </li>
</ul>
<p>
  Quantiles are not the same as dollar amounts. They are a way to compare values within regions of
  the state. For example, a housing value quantile of 0.5 means that the housing value is higher
  than 50% of the other housing values in the region. Use the next figure with dollar amounts to
  inform your interpretation.
</p>
<div class="plot-container">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      height: 300,
      color: { legend: true },
      x: { type: 'linear', label: 'Year', tickFormat: 'd' },
      y: { type: 'linear', domain: [0, 1], label: 'Quantile', tickFormat: '.0%' },
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
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">House value and income quantiles over time</h2>
  </PlotContainer>
</div>

<h3>House value and income over time</h3>

<aside class="options">
  <h4>Options</h4>

  <calcite-label>
    <span>
      Adjust for inflation (use 2020 dollars)
      <br />
      <i style="opacity: 0.7;">Based on the US BLS Consumer Price Index</i>
    </span>
    <div class="switch">
      <span>Off</span>
      <calcite-switch
        checked="{adjustDataForInflation}"
        on:calciteSwitchChange="{(evt) => {
          adjustDataForInflation = evt.target.checked;
        }}"
      ></calcite-switch>
      <span>On</span>
    </div>
  </calcite-label>
</aside>

<div class="plot-container">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      height: 300,
      color: { legend: true },
      x: { type: 'linear', label: 'Year', tickFormat: 'd' },
      y: {
        type: 'linear',
        label: `US Dollars ${adjustDataForInflation ? '(inflation-adjusted to 2020)' : ''}`,
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
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">House value and income over time</h2>
  </PlotContainer>
</div>

<h3>Migration from a different county in South Carolina</h3>

<div class="plot-container">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      marginLeft: 45,
      marginTop: 45,
      marginBottom: 40,
      color: { legend: true, range: [colors.vibrant.maroon, '#999'], reverse: true },
      y: { label: 'Percent of population', tickFormat: '.2p' },
      fx: { label: '' },
      x: { label: '', reverse: true },
      width: 300,
      caption: 'Data: US Census ACS',
      marks: [
        Plot.frame({ strokeOpacity: 0.1 }),
        Plot.barY(migrationAndServiceWorkerData, {
          fx: 'year',
          x: 'id',
          y: 'migration__different_county_fraction',
          fill: 'id',
          tip: true,
        }),
        Plot.text(migrationAndServiceWorkerData, {
          fx: 'year',
          x: 'id',
          y: 'migration__different_county_fraction',
          text: (d) => d3.format('.2p')(d.migration__different_county_fraction),
          dy: 10,
          fill: 'white',
          stroke: 'black',
          strokeOpacity: 0.14,
        }),
        Plot.ruleY([0]),
      ],
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">
      Migration from a different county in South Carolina
    </h2>
  </PlotContainer>
</div>

<h3>Migration from outside South Carolina</h3>

<div class="plot-container">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      marginLeft: 45,
      marginTop: 45,
      marginBottom: 40,
      color: { legend: true, range: [colors.vibrant.magenta, '#999'], reverse: true },
      y: { label: 'Percent of population', tickFormat: '.2p' },
      fx: { label: '' },
      x: { label: '', reverse: true },
      width: 300,
      caption: 'Data: US Census ACS',
      marks: [
        Plot.frame({ strokeOpacity: 0.1 }),
        Plot.barY(migrationAndServiceWorkerData, {
          fx: 'year',
          x: 'id',
          y: 'migration__different_state_fraction',
          fill: 'id',
          tip: true,
        }),
        Plot.text(migrationAndServiceWorkerData, {
          fx: 'year',
          x: 'id',
          y: 'migration__different_state_fraction',
          text: (d) => d3.format('.2p')(d.migration__different_state_fraction),
          dy: 10,
          fill: 'white',
          stroke: 'black',
          strokeOpacity: 0.14,
        }),
        Plot.ruleY([0]),
      ],
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">Migration from outside South Carolina</h2>
  </PlotContainer>
</div>

<h3>Percent of workers who are in the service industry</h3>

<div class="plot-container">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      marginLeft: 45,
      marginTop: 45,
      marginBottom: 40,
      color: { legend: true, range: [colors.vibrant.teal, '#999'], reverse: true },
      y: { label: 'Percent of working population', tickFormat: '.2p' },
      fx: { label: '' },
      x: { label: '', reverse: true },
      width: 300,
      caption: 'Data: US Census ACS',
      marks: [
        Plot.frame({ strokeOpacity: 0.1 }),
        Plot.barY(migrationAndServiceWorkerData, {
          fx: 'year',
          x: 'id',
          y: 'service_worker_fraction',
          fill: 'id',
          tip: true,
        }),
        Plot.text(migrationAndServiceWorkerData, {
          fx: 'year',
          x: 'id',
          y: 'service_worker_fraction',
          text: (d) => d3.format('.2p')(d.service_worker_fraction),
          dy: 10,
          fill: 'white',
          stroke: 'black',
          strokeOpacity: 0.14,
        }),
        Plot.ruleY([0]),
      ],
    }}"
  >
    <h2 slot="popup-before" style="margin: 0;">
      Percent of workers who are in the service industry
    </h2>
  </PlotContainer>
</div>

<h3>All data ({year})</h3>

{#if showAllData}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <calcite-button
    kind="neutral"
    appearance="outline"
    width="full"
    iconStart="chevron-up"
    on:click="{() => (showAllData = false)}"
  >
    Hide all data
  </calcite-button>

  <table
    class="esri-widget__table"
    summary="List of attributes and values"
    style="margin-top: 10px;"
  >
    <tbody>
      {#each Object.entries($$props) as [key, value]}
        <tr>
          <th class="esri-feature-fields__field-header">{key}</th>
          <td class="esri-feature-fields__field-data">
            {#if (Array.isArray(value) && value.some((v) => typeof v === 'object')) || typeof value === 'object'}
              <span style="white-space: pre-wrap;">
                {JSON.stringify(value, null, 2)}
              </span>
            {:else}
              {value}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <calcite-button
    kind="neutral"
    appearance="outline"
    width="full"
    iconStart="chevron-down"
    on:click="{() => (showAllData = true)}"
  >
    Show all data
  </calcite-button>
{/if}

<style>
  table {
    margin-bottom: 24px;
  }

  .plot-container {
    margin-bottom: 24px;
  }
  .plot-container :global(svg) {
    background-color: transparent;
  }

  .switch {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--calcite-color-text-2);
  }

  aside.options {
    border: 1px solid var(--calcite-color-border-1);
    padding: 0 var(--calcite-internal-panel-default-padding);
  }
</style>
