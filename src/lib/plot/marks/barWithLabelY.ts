import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

interface PlotWithLabelYOptions
  extends Omit<Plot.BarYOptions, 'x' | 'y'>,
    Omit<Plot.TextYOptions, 'x' | 'y'> {
  labelFormat?: string;
  x: string;
  y: string;
  labelFill?: Plot.TextYOptions['fill'];
}

function barWithLabelY(
  data: Record<string, unknown>[],
  { labelFormat = '.1f', labelFill, ...options }: PlotWithLabelYOptions
) {
  const barMark = Plot.barY(data, { ...options });

  const textMark = Plot.textY(data, {
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
  });

  return Plot.marks(barMark, textMark);
}

export { barWithLabelY as _barWithLabelY };
