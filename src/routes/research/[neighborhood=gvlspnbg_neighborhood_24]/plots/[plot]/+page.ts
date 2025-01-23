import { capitalize } from '$utils/capitalize';
import type { PageLoad } from './$types';
import { plotConfigs } from './plotConfigs';

export const load = (async ({ params, parent }) => {
  const { neighborhoodsData, neighborhood } = await parent();
  const { plot } = params;

  const data = neighborhoodsData.filter(
    (d) => d.neighborhood_name.toLowerCase() === neighborhood.toLowerCase()
  );

  const plotConfig = plotConfigs[plot]?.(neighborhood, data);

  return {
    plotConfig,
  };
}) satisfies PageLoad;
