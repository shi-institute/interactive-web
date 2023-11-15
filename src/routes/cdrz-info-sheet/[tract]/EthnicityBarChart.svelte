<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import type { CDRZ, Ethnicity } from '../CDRZ';

  export let data: CDRZ;

  const ethnicityData = [
    {
      tract: '',
      value: data.ethnicity.hispanicOrLatino,
      ethnicity: 'Hispanic or Latino',
    },
    {
      tract: '',
      value: data.ethnicity.notHispanicOrLatino,
      ethnicity: 'Not Hispanic or Latino',
    },
  ];

  const colors = ['#4477aa', '#66ccee', '#228833', '#ccbb44', '#ee6677', '#aa3377', '#bbbbbb'];

  let plotOptions: Plot.PlotOptions;
  $: plotOptions = {
    color: { legend: true, range: colors },
    marginTop: 0,
    marginLeft: 0,
    x: { label: 'Population' },
    y: { axis: null },
    marks: [
      Plot.barX(ethnicityData, {
        x: 'value',
        y: 'tract',
        fill: 'ethnicity',
        tip: false,
      }),
      Plot.ruleX([0]),
    ],
    height: 55,
  };

  let div: HTMLDivElement;
  $: {
    div?.firstChild?.remove(); // remove old chart if it exists
    div?.append(Plot.plot(plotOptions));
  }
</script>

<div bind:this="{div}" role="img"></div>

<style>
  /* offset the zero from the left by two pixels so it is not cut off */
  div :global(g[aria-label='x-axis tick label'] > text:first-of-type) {
    transform: translate(2px, 25px);
  }

  /* adjust spacing around the swatches */
  div :global(div[class*='-swatches']) {
    margin-bottom: 0;
  }
</style>
