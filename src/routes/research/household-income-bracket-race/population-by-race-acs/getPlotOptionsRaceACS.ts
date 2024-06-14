import { colors } from '$lib/colors';
import * as Plot from '@observablehq/plot';
import { html } from 'htl';
import type { PageData } from './$types';

export function getPlotOptionsRaceACS(
  _data: PageData['est1'] | PageData['est5'],
  titlePrefix = '',
  width = 640,
  height = 380,
  showLegend = true,
  showCaption = true,
  alone = false
) {
  const data = _data.filter((d) => d.variant === (alone ? 'alone' : 'aloneOrCombined'));

  return {
    title: titlePrefix + ' estimates',
    subtitle: html`
      <h3>City of Greenville, SC &nbsp;·&nbsp; 2016-2022</h3>
    `,
    caption: showCaption ? 'Data: US Census Bureau American Community Survey' : undefined,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 0,
    width,
    height,
    x: {
      domain: [new Date(2015, 11, 31), new Date(2022, 0)],
    },
    y: {
      domain: [0.05, 0.79],
    },
    marks: [
      /* -------------------- */
      // WHITE
      // series label
      ...(showLegend
        ? [
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'whiteFraction',
                text: ['■'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 45,
                dx: 8,
                fill: colors.vibrant.orange,
                fontSize: 24,
              })
            ),
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'whiteFraction',
                text: [
                  alone
                    ? 'Percent white alone population'
                    : 'Percent white or partially white population',
                ],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 50,
                dx: 28,
              })
            ),
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'whiteFraction',
                text: ['■'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 65,
                dx: 8,
                fill: colors.vibrant.orange,
                fontSize: 24,
                opacity: 0.3,
              })
            ),
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'whiteFraction',
                text: ['Margin of error'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 70,
                dx: 28,
                opacity: 0.7,
              })
            ),
          ]
        : []),
      // error zone
      Plot.areaY(data, {
        x: 'year',
        y1: (d) => d.whiteFraction + d.whiteFractionMOE,
        y2: (d) => d.whiteFraction - d.whiteFractionMOE,
        fill: colors.vibrant.orange + '22',
        dy: 15,
      }),
      // upper error line
      Plot.line(data, {
        x: 'year',
        y: (d) => d.whiteFraction + d.whiteFractionMOE,
        stroke: '#ccc',
        strokeWidth: 0.5,
        dy: 15,
      }),
      // lower error line
      Plot.line(data, {
        x: 'year',
        y: (d) => d.whiteFraction - d.whiteFractionMOE,
        stroke: '#ccc',
        strokeWidth: 0.5,
        dy: 15,
      }),
      // value line
      Plot.line(data, {
        x: 'year',
        y: 'whiteFraction',
        stroke: colors.vibrant.orange,
        strokeWidth: 2,
        dy: 15,
      }),
      // year percent labels
      Plot.text(data, {
        x: 'year',
        y: 'whiteFraction',
        text: (d) => `${(d.whiteFraction * 100).toFixed(1)}%`,
        dy: 9,
        lineAnchor: 'bottom',
        textAnchor: 'middle',
      }),
      Plot.dot(data, {
        x: 'year',
        y: 'whiteFraction',
        strokeWidth: 0,
        fill: colors.vibrant.orange,
        dy: 15,
      }),

      /* -------------------- */
      // BLACK
      // series label
      ...(showLegend
        ? [
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'blackFraction',
                text: ['■'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 42,
                dx: 8,
                fill: colors.vibrant.blue,
                fontSize: 24,
              })
            ),
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'blackFraction',
                text: [
                  alone
                    ? 'Percent Black alone population'
                    : 'Percent Black or partially Black population',
                ],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 47,
                dx: 28,
              })
            ),
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'blackFraction',
                text: ['■'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 62,
                dx: 8,
                fill: colors.vibrant.blue,
                fontSize: 24,
                opacity: 0.3,
              })
            ),
            Plot.text(
              data,
              Plot.selectFirst({
                x: 'year',
                y: 'blackFraction',
                text: ['Margin of error'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 67,
                dx: 28,
                opacity: 0.7,
              })
            ),
          ]
        : []),
      // error zone
      Plot.areaY(data, {
        x: 'year',
        y1: (d) => d.blackFraction + d.blackFractionMOE,
        y2: (d) => d.blackFraction - d.blackFractionMOE,
        fill: colors.vibrant.blue + '22',
      }),
      // upper error line
      Plot.line(data, {
        x: 'year',
        y: (d) => d.blackFraction + d.blackFractionMOE,
        stroke: '#ccc',
        strokeWidth: 0.5,
      }),
      // lower error line
      Plot.line(data, {
        x: 'year',
        y: (d) => d.blackFraction - d.blackFractionMOE,
        stroke: '#ccc',
        strokeWidth: 0.5,
      }),
      // value line
      Plot.line(data, {
        x: 'year',
        y: 'blackFraction',
        stroke: colors.vibrant.blue,
        strokeWidth: 2,
      }),
      // year percent labels
      Plot.text(data, {
        x: 'year',
        y: 'blackFraction',
        text: (d) => `${(d.blackFraction * 100).toFixed(1)}%`,
        dy: -6,
        lineAnchor: 'bottom',
      }),
      Plot.dot(data, {
        x: 'year',
        y: 'blackFraction',
        strokeWidth: 0,
        fill: colors.vibrant.blue,
      }),

      /* -------------------- */

      // remove y axis since the labels on the lines
      // make the axis labels redundant
      Plot.axisY([], { label: '', labelArrow: 'none' }),
    ],
  } satisfies Plot.PlotOptions;
}
