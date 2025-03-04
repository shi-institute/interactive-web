import { type Option } from '$lib/common/Select';
import { notEmpty } from '$utils/notEmpty';
import { ssp } from 'sveltekit-search-params';
import { getPlotsList } from '../getPlotsList';

export function getParams(url: URL) {
  const { tractPlots, blockPlots } = getPlotsList(url);

  const availablePlotOptions = [...tractPlots, ...blockPlots].map(([title, key]) => ({
    label: title,
    _id: key,
  }));

  const params = {
    title: true,
    subtitle: true,
    plots: {
      encode: (value: Option[]) => value.map((v) => v._id).join(','),
      decode: (value: string | null) =>
        (value ? value.split(',') : [])
          .map((v): Option | undefined => availablePlotOptions.find((o) => o._id === v))
          .filter(notEmpty),
      defaultValue: [],
    },
    neighborhoods: {
      encode: (value: string[]) => value.join(','),
      decode: (value: string | null) => (value ? value.split(',') : []),
      defaultValue: [],
    },
    plotWidth: ssp.number(600),
    plotHeight: ssp.number(400),
    normalizeYAxisScale: ssp.boolean(false),
  };

  return params;
}

export const queryParamsOptions = {
  debounceHistory: 500,
  pushHistory: false,
};
