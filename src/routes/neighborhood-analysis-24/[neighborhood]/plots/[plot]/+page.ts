import { blockPlotConfigs, plotConfigs } from '../../../plotConfigs';
import type { PageLoad } from './$types';

export const load = (async ({ params, parent, url }) => {
  const { neighborhood, neighborhoodsData, neighborhoodBlocksData, tract, tract_name, tractsData } =
    await parent();
  const { plot } = params;

  if (neighborhood) {
    const data = neighborhoodsData.filter(
      (d) => d.neighborhood_name.toLowerCase() === neighborhood.toLowerCase()
    );

    const plotConfig = plotConfigs[plot]?.(neighborhood, data, url);

    if (!plotConfig) {
      const blockData = neighborhoodBlocksData.filter(
        (d) => d.neighborhood_name.toLowerCase() === neighborhood.toLowerCase()
      );
      const plotConfig = blockPlotConfigs[plot.replace('decennial‾‾', '')]?.(
        neighborhood,
        blockData,
        url
      );
      return { plotConfig };
    }

    return { plotConfig };
  }

  const data = tractsData.filter((d) => d.tract_id === tract);
  const plotConfig = plotConfigs[plot]?.(tract_name || 'Tract ' + tract, data, url);
  return { plotConfig };
}) satisfies PageLoad;
