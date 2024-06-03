import { colors } from '$lib/colors';
import * as Plot from '@observablehq/plot';
import type { PageData } from './$types';

export function getPlotOptionsRaceACS(
  data: PageData['est1'] | PageData['est5'],
  titlePrefix = '',
  width = 640,
  height = 380,
  showLegend = true,
  showCaption = true
) {
  return {
    title: titlePrefix + ' estimates',
    subtitle: 'City of Greenville, SC',
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
                dy: 30,
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
                text: ['Percent white population'],
                lineAnchor: 'top',
                textAnchor: 'start',
                dy: 35,
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
                dy: 50,
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
                dy: 55,
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
      }),
      // upper error line
      Plot.line(data, {
        x: 'year',
        y: (d) => d.whiteFraction + d.whiteFractionMOE,
        stroke: '#ccc',
        strokeWidth: 0.5,
      }),
      // lower error line
      Plot.line(data, {
        x: 'year',
        y: (d) => d.whiteFraction - d.whiteFractionMOE,
        stroke: '#ccc',
        strokeWidth: 0.5,
      }),
      // value line
      Plot.line(data, {
        x: 'year',
        y: 'whiteFraction',
        stroke: colors.vibrant.orange,
        strokeWidth: 2,
      }),
      // year percent labels
      Plot.text(data, {
        x: 'year',
        y: 'whiteFraction',
        text: (d) => `${(d.whiteFraction * 100).toFixed(1)}%`,
        dy: -6,
        lineAnchor: 'bottom',
        textAnchor: 'middle',
      }),
      Plot.dot(data, {
        x: 'year',
        y: 'whiteFraction',
        strokeWidth: 0,
        fill: colors.vibrant.orange,
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
                text: ['Percent Black population'],
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
