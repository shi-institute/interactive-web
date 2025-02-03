import { notEmpty } from '$utils/notEmpty';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

interface PlotWithLabelYOptions
  extends Omit<Plot.BarYOptions, 'x' | 'y'>,
    Omit<Plot.TextYOptions, 'x' | 'y'> {
  labelFormat?: string;
  x: string;
  y: string;
  yErrorMargin?: string;
  labelFill?: Plot.TextYOptions['fill'];
}

function barWithLabelY(
  data: readonly Record<string, unknown>[] | Record<string, unknown>[],
  { labelFormat = '.1f', labelFill, yErrorMargin, ...options }: PlotWithLabelYOptions
) {
  const barMark = Plot.barY(data, { ...options });

  const textMarkOptions = {
    ...options,
    fill: labelFill ?? options.fill,
    text: (d: (typeof data)[number], index: number) => {
      return d3.format(labelFormat)(d[options.y] as number);
    },
    render: (index, scales, values, dimensions, context, next) => {
      // get the svg element that is going to be rendered
      const g = next?.(index, scales, values, dimensions, context) ?? null;

      // if needed, manipulate the text elements within

      // return the g
      return g;
    },
    textAnchor: 'middle',
    lineAnchor: 'bottom',
    dy: -6,
  } satisfies Plot.TextYOptions;

  const compoundTextMark = Plot.marks([
    Plot.textY(data, {
      ...textMarkOptions,
      stroke: 'var(--background-color, #ffffff)',
      strokeWidth: 8,
      opacity: 0.5,
    }),
    Plot.textY(data, { ...textMarkOptions, fill: 'var(--text-color, var(--fds-text-primary))' }),
  ]);

  const errorBarMark = yErrorMargin
    ? Plot.ruleX(data, {
        x: 'year',
        y1: (d) => {
          const base = d[options.y];
          const errorMargin = d[yErrorMargin];

          if (base === null || errorMargin === null) return null;

          return base - errorMargin;
        },
        y2: (d) => {
          const base = d[options.y];
          const errorMargin = d[yErrorMargin];

          if (base === null || errorMargin === null) return null;

          return base + errorMargin;
        },
        marker: 'tick',
        opacity: 0.5,
      })
    : null;

  return Plot.marks([barMark, errorBarMark, compoundTextMark].filter(notEmpty));
}

export { barWithLabelY as _barWithLabelY };
