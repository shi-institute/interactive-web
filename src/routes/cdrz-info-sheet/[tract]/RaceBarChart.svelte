<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import type { CDRZ, Ethnicity } from '../CDRZ';

  export let data: CDRZ;

  const raceFigureData = (() => {
    const arr: {
      tract: string;
      race: string;
      population: number;
      percent: string;
      label: string;
    }[] = [];

    const raceMap: Record<string, string> = {
      white: 'White',
      black: 'Black',
      americanIndianAlaskanNative: 'American Indian or Alaskan Native',
      asian: 'Asian',
      pacificIslander: 'Hawaiian or Pacific Islander',
      twoOrMore: 'Two or more',
      other: 'Other',
    };

    Object.entries(data.race)
      .map(([key, value]: [string, Ethnicity]) => {
        if (key === 'total') return null;
        return [key, value.total];
      })
      .filter((d): d is [string, number] => !!d)
      .forEach(([race, population]) => {
        const percent = `${((population / data.race.total) * 100).toFixed(1)}%`;

        arr.push({
          tract: data.tract,
          race: raceMap[race],
          population,
          percent,
          label: `${population.toLocaleString('en-US')} (${percent})`,
        });
      });

    return arr;
  })();

  const colors = ['#4477aa', '#66ccee', '#228833', '#ccbb44', '#ee6677', '#aa3377', '#bbbbbb'];
  const domain = [
    'White',
    'Black',
    'American Indian or Alaskan Native',
    'Asian',
    'Hawaiian or Pacific Islander',
    'Two or more',
    'Other',
  ];

  let plotOptions: Plot.PlotOptions;
  $: plotOptions = {
    color: { legend: false, range: colors },
    height: 190,
    marginLeft: 160,
    marginRight: 70,
    marginTop: 0,
    x: { label: 'Population' },
    y: {
      label: null,
      domain: domain,
    },
    marks: [
      // Plot.frame({ strokeOpacity: 0.1 }),
      Plot.barX(raceFigureData, {
        y: 'race',
        x: 'population',
        fill: (d) => {
          const index = domain.findIndex((_) => _ === d.race);
          return colors[index];
        },
        tip: false,
      }),
      Plot.text(raceFigureData, {
        x: 'population',
        y: 'race',
        text: 'label',
        dx: 3,
        textAnchor: 'start',
      }),
      Plot.ruleX([0]),
    ],
  };

  let div: HTMLDivElement;
  $: {
    div?.firstChild?.remove(); // remove old chart if it exists
    div?.append(Plot.plot(plotOptions));
  }
</script>

<div bind:this="{div}" role="img"></div>
