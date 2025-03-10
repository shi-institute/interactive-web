import { colors } from '$lib/colors';
import * as Plot from '@observablehq/plot';
import { html } from 'htl';
import type { PageData } from './$types';

export function getPlotOptionsCV(data: PageData['cv'], titlePrefix = '', alone = false) {
  const domainX = alone
    ? [
        'White alone (1-year)',
        'Black alone (1-year)',
        'White alone (5-year)',
        'Black alone (5-year)',
      ]
    : [
        'White or partially white (1-year)',
        'Black or partially Black (1-year)',
        'White or partially white (5-year)',
        'Black or partially Black (5-year)',
      ];

  return {
    title: `${titlePrefix}Coefficient of variation`,
    subtitle: 'One-year vs. five-year estimates for race in City of Greenville, SC',
    // prettier-ignore
    caption: html`Lower coefficients of variation (CVs) are better. Larger CVs indicate higher sampling error associated with the data and lower reliability.
      <i>Data: US Census Bureau American Community Survey</i>`,
    width: 860,
    height: 350,
    marginBottom: 40,
    marginTop: 30,
    color: {
      legend: 'swatches',
      domain: domainX,
      range: [
        colors.vibrant.orange + '55',
        colors.vibrant.blue + '55',
        colors.vibrant.orange,
        colors.vibrant.blue,
      ],
    },
    x: { domain: domainX },
    y: { domain: [0, 32] },
    marks: [
      // grid lines every two values on the y-axis
      Plot.gridY({
        interval: 2,
        strokeOpacity: 0.05,
        inset: -6,
      }),

      // identify the point at which data is considered less reliable (CV >= 15)
      Plot.ruleY([15], { inset: -6, strokeDasharray: '2,2' }),
      Plot.text(
        [
          {
            year: new Date(2016, 0),
            text: 'Below 15 is considered good reliability',
          },
        ],
        {
          y: 15,
          text: 'text',
          fx: 'year',
          frameAnchor: 'left',
          lineAnchor: 'top',
          dy: 7,
          dx: 7,
        }
      ),

      // identify the point at which data is considered less reliable (CV >= 30)
      Plot.ruleY([30], { inset: -6 }),
      Plot.text(
        [
          {
            year: new Date(2016, 0),
            text: 'Between 15 and 30 is considered fair reliability',
          },
        ],
        {
          y: 30,
          text: 'text',
          fx: 'year',
          frameAnchor: 'left',
          lineAnchor: 'top',
          dy: 7,
          dx: 7,
        }
      ),

      // create the bars with facets
      Plot.barY(data, {
        fx: 'year',
        x: 'group',
        fill: 'group',
        y: 'varianceCoefficient',
        tip: true,
        sort: { x: 'x' },
      }),
      // Plot.ruleY([0]),

      // hide the x-axis within each facet
      Plot.axisX({ label: null, ticks: [] }),

      // label the facet x-axis with the year
      Plot.axisFx({
        anchor: 'bottom',
        label: 'Year',
        labelAnchor: 'right',
        labelArrow: 'right',
        tickFormat: '%Y',
      }),

      // label the facet y-axis CV
      Plot.axisY({
        anchor: 'left',
        label: 'Coefficient of variation (CV)',
        labelAnchor: 'top',
        labelArrow: 'up',
      }),
    ],
  } satisfies Plot.PlotOptions;
}
