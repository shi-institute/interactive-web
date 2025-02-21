import { capitalize } from '$utils/capitalize';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, parent }) => {
  const { gentrificationData, tractsData } = await parent();

  if (isNaN(Number(params.neighborhood))) {
    const neighborhood = capitalize(params.neighborhood);

    const neighborhoodGentrificationData = gentrificationData.filter(
      ({ neighborhoods }) =>
        neighborhoods &&
        neighborhoods.map((n) => n.toLowerCase()).includes(params.neighborhood.toLowerCase())
    );

    return { neighborhood, neighborhoodGentrificationData };
  }

  const tract = parseInt(params.neighborhood);
  const tract_name = tractsData.find((d) => d.tract_id === tract)?.tract_name;

  const tractGentrificationData = gentrificationData.filter(({ Tract }) => Tract === tract);

  return { tract, tract_name, tractGentrificationData };
}) satisfies LayoutServerLoad;
