import { blockPlotConfigs, plotConfigs } from './plotConfigs';

export function getPlotsList(url: URL) {
  const tractPlots = Object.entries(plotConfigs)
    .map(([key, config]) => [config('', [], url).title || key, key] as const)
    .map(([title, key]) => [`${title}`, key] as const);

  const blockPlots = Object.entries(blockPlotConfigs)
    .map(([key, config]) => [config('', [], url).title || key, key] as const)
    .flatMap(([title, key]) => {
      if (key === 'population_pyramid') {
        return [
          [`${title} (2020)`, `${key}?year=2020`],
          [`${title} (2010)`, `${key}?year=2010`],
          [`${title} (2000)`, `${key}?year=2000`],
        ] as const;
      } else {
        return [[title, key] as const];
      }
    })
    .map(([title, key]) => [`${title} [decennial]`, `decennial‾‾${key}`] as const);

  return { tractPlots, blockPlots };
}
