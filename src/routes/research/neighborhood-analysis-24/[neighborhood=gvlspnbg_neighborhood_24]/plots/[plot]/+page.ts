import { plotConfigs } from '../../../plotConfigs';
import type { PageLoad } from './$types';

export const load = (async ({ params, parent }) => {
  const { neighborhood, neighborhoodsData, tract, tract_name, tractsData } = await parent();
  const { plot } = params;

  if (neighborhood) {
    const data = neighborhoodsData.filter(
      (d) => d.neighborhood_name.toLowerCase() === neighborhood.toLowerCase()
    );

    const plotConfig = plotConfigs[plot]?.(neighborhood, data);

    return { plotConfig };
  }

  const data = tractsData.filter((d) => d.tract_id === tract);
  const plotConfig = plotConfigs[plot]?.(tract_name || 'Tract ' + tract, data);
  return { plotConfig };
}) satisfies PageLoad;
