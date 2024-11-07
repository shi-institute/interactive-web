<script lang="ts">
  import { colors } from '$lib/colors';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import * as Plot from '@observablehq/plot';
  import * as d3 from 'd3';
  import { html } from 'htl';

  export let mode: 'migrationDiffCounty' | 'migrationDiffState' | 'serviceWorkers';
  export let maxWidth: number = 0;
  export let height = 300;
  export let caption = '';

  const sampleData = [
    {
      ZCTA5: 'MEDIAN',
      migration__different_county_fraction: 0.0442539515,
      migration__different_state_fraction: 0.016342344,
      service_worker_fraction: 0.05030491404066875,
      year: '2013-2017',
    },
    {
      ZCTA5: 'MEDIAN',
      migration__different_county_fraction: 0.048005498690295745,
      migration__different_state_fraction: 0.0180666256317276,
      service_worker_fraction: 0.0504670749289255,
      year: '2018-2022',
    },
    {
      ZCTA5: '29001',
      migration__different_county_fraction: 0.05108055,
      migration__different_state_fraction: 0.043713163,
      service_worker_fraction: 0.0348432055749129,
      year: '2013-2017',
    },
    {
      ZCTA5: '29001',
      migration__different_county_fraction: 0.0210622710622711,
      migration__different_state_fraction: 0.00412087912087912,
      service_worker_fraction: 0.0693333333333333,
      year: '2018-2022',
    },
  ];

  const key =
    mode === 'migrationDiffCounty'
      ? 'migration__different_county_fraction'
      : mode === 'migrationDiffState'
      ? 'migration__different_state_fraction'
      : 'service_worker_fraction';
</script>

<div class="plot-container" style="--maxWidth: {maxWidth ? `${maxWidth}px` : '100%'};">
  <PlotContainer
    fullWidth
    enablePopup
    plot="{{
      height,
      marginLeft: 45,
      marginTop: 45,
      color: {
        legend: false,
        range: [
          mode === 'migrationDiffCounty'
            ? colors.vibrant.maroon
            : mode === 'migrationDiffState'
            ? colors.vibrant.magenta
            : colors.vibrant.teal,
          '#999',
        ],
      },
      y: {
        label:
          mode === 'migrationDiffCounty' || mode === 'migrationDiffState'
            ? 'Percent of population'
            : 'Percent of working population',
        tickFormat: '.2p',
      },
      fx: { label: '' },
      x: { label: '' },
      width: 300,
      title: '',
      // prettier-ignore
      caption: html`${caption}
        <i>Data: US Census ACS</i>
      `,
      marks: [
        Plot.frame({ strokeOpacity: 0.1 }),
        Plot.barY(sampleData, {
          fx: 'year',
          x: 'ZCTA5',
          y: key,
          fill: 'ZCTA5',
        }),
        Plot.text(sampleData, {
          fx: 'year',
          x: 'ZCTA5',
          y: key,
          text: (d) => d3.format('.2p')(d[key]),
          dy: 10,
          fill: 'white',
          stroke: 'black',
          strokeOpacity: 0.14,
        }),
        Plot.ruleY([0]),
      ],
    }}"
  />
</div>

<style>
  .plot-container {
    box-sizing: border-box;
    border: 1px solid var(--calcite-color-border-1);
    padding: 8px;
    max-width: var(--maxWidth);
  }
  .plot-container :global(svg[class^='plot-']) {
    background-color: var(--calcite-color-foreground-1);
  }
</style>
