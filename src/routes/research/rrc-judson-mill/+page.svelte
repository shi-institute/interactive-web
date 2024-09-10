<script lang="ts">
  import { colors } from '$lib/colors.js';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import * as Plot from '@observablehq/plot';
  import * as d3 from 'd3';
  import { html } from 'htl';

  export let data;

  const colorMap = {
    Black: colors.vibrant.blue,
    White: colors.vibrant.orange,
    Other: colors.vibrant.maroon,
    'Two or more': colors.vibrant.gray,
  };

  const byRaceTitle = 'Percent population by race';
  const subtitle = 'Judson Mill, 1960-2020';
  const caption = html`
    <i>Data: US Census Bureau</i>
  `;
</script>

<section>
  <PlotContainer
    enablePopup
    plot="{{
      title: 'Population density',
      subtitle,
      caption,
      marginTop: 30,
      marginLeft: 50,
      marginBottom: 40,
      y: { label: 'People per square mile', labelArrow: 'up', labelAnchor: 'top', grid: true },
      x: { type: 'band' },
      marks: [
        Plot.barY(data.tidyPopulationDensity, {
          x: 'year',
          y: 'density',
        }),
        Plot.textY(data.tidyPopulationDensity, {
          x: 'year',
          y: 'density',
          text: (d) => d3.format(',.0f')(d.density),
          textAnchor: 'middle',
          lineAnchor: 'bottom',
          dy: -6,
        }),
      ],
    }}"
  />
</section>

<section>
  <PlotContainer
    enablePopup
    plot="{{
      title: byRaceTitle,
      subtitle,
      caption,
      color: {
        legend: true,
        domain: Object.keys(colorMap),
      },
      marginTop: 40,
      marginBottom: 40,
      x: { axis: null, domain: Object.keys(colorMap) },
      fx: { label: 'Year', labelArrow: 'right', labelAnchor: 'right' },
      y: { label: 'Percent population', labelArrow: 'up', labelAnchor: 'top', grid: true },
      marks: [
        Plot.barY(data.tidyPerecentPopulationByRace, {
          x: 'race',
          y: 'percent',
          fill: 'race',
          fx: 'year',
        }),
        Plot.textX(data.tidyPerecentPopulationByRace, {
          x: 'race',
          y: 'percent',
          fx: 'year',
          text: (d) => (d.percent >= 0.5 ? parseInt(d.percent) : ''),
          dy: -8,
          opacity: 0.6,
        }),
      ],
    }}"
  />

  <PlotContainer
    enablePopup
    plot="{{
      title: byRaceTitle,
      subtitle,
      caption,
      color: {
        legend: true,
        domain: Object.keys(colorMap),
      },
      marginTop: 40,
      marginBottom: 40,
      x: { axis: null, domain: Object.keys(colorMap) },
      fx: { label: 'Year', labelArrow: 'right', labelAnchor: 'right' },
      y: { label: 'Percent population', labelArrow: 'up', labelAnchor: 'top' },
      marks: [
        Plot.barY(data.tidyPerecentPopulationByRace, {
          x: 'race',
          y: 'percent',
          fill: 'race',
          fx: 'year',
        }),
        Plot.textX(data.tidyPerecentPopulationByRace, {
          x: 'race',
          y: 'percent',
          fx: 'year',
          text: (d) => d3.format('.0%')(d.percent / 100),
          dy: -8,
        }),
      ],
    }}"
  />

  <PlotContainer
    enablePopup
    plot="{{
      title: byRaceTitle,
      subtitle,
      caption,
      color: {
        legend: true,
        domain: Object.keys(colorMap),
      },
      marginTop: 20,
      marginBottom: 40,
      y: { axis: null, domain: Object.keys(colorMap) },
      fy: { label: 'Year', labelArrow: 'down', labelAnchor: 'top' },
      x: { label: 'Percent population', labelArrow: 'right', labelAnchor: 'right' },
      marks: [
        Plot.barX(data.tidyPerecentPopulationByRace, {
          x: 'percent',
          y: 'race',
          fill: 'race',
          fy: 'year',
        }),
        Plot.textY(data.tidyPerecentPopulationByRace, {
          x: 'percent',
          y: 'race',
          fy: 'year',
          text: (d) => d3.format('.0%')(d.percent / 100),
          dx: 4,
          textAnchor: 'start',
        }),
      ],
    }}"
  />

  <PlotContainer
    enablePopup
    plot="{{
      title: byRaceTitle,
      subtitle,
      caption,
      color: {
        legend: true,
        domain: Object.keys(colorMap),
      },
      marginTop: 30,
      marginBottom: 35,
      x: { label: 'Year', labelArrow: 'right', labelAnchor: 'right', type: 'band' },
      y: { label: 'Percent population', labelArrow: 'up', labelAnchor: 'top' },
      marks: [
        Plot.barY(
          data.tidyPerecentPopulationByRace,
          Plot.stackY({
            x: 'year',
            y: 'percent',
            fill: 'race',
          })
        ),
      ],
    }}"
  />
</section>

<style>
  section {
    padding: 20px;
  }
  section > :global(*) {
    margin-top: 20px;
  }
  section > :global(*:nth-child(2)) {
    margin-top: 0;
  }
</style>
