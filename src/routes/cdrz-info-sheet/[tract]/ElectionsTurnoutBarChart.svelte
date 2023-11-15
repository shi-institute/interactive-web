<script lang="ts">
  import { capitalize } from '$utils/capitalize';
  import * as Plot from '@observablehq/plot';
  import * as d3 from 'd3';
  import type { CDRZ } from '../CDRZ';

  export let data: CDRZ;

  const turnout = data.elections
    .map((election) => {
      return {
        name: election.name,
        precinct: election.turnout.precinct.all,
        state: election.turnout.state.all,
        county: election.turnout.county.all,
      };
    })
    .flatMap(({ name, ...rest }) => {
      return Object.entries(rest).map(([level, turnout]) => {
        return { name, level: capitalize(level), turnout };
      });
    });

  const colors = ['#ee6677', '#4477aa', '#66ccee', '#228833', '#ee6677', '#aa3377', '#bbbbbb'];
  const domain = ['Precinct', 'County', 'State'];

  let plotOptions: Plot.PlotOptions;
  $: plotOptions = {
    color: { legend: true, range: colors, domain },
    height: 92,
    width: div?.clientWidth,
    x: { tickFormat: '.0%', domain: [0, 1], label: 'Voter turnout' },
    y: { axis: null, padding: 0.0, domain },
    marginLeft: 0,
    marks: [
      Plot.frame({ strokeOpacity: 0.1 }),
      Plot.barX(turnout, {
        x: 'turnout',
        y: 'level',
        fill: 'level',
        tip: false,
        fillOpacity: (d) => {
          if (d.level === 'Precinct') return 1;
          return 0.6;
        },
      }),
      Plot.text(turnout, {
        x: 'turnout',
        y: 'level',
        text: (d) => d3.format('.1%')(d.turnout),
        dx: -3,
        textAnchor: 'end',
        fill: 'white',
        stroke: 'black',
        strokeOpacity: 0.5,
      }),
    ],
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
    transform: translate(6px, 62px);
  }

  /* adjust spacing around the swatches */
  div :global(div[class*='-swatches']) {
    margin-bottom: 0;
  }
</style>
