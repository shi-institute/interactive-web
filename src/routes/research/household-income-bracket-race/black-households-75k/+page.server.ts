import type { PageServerLoad } from './$types';
import data from './data.json';

export const load = (async () => {
  return {
    tidy: data.map(({ municipality, race, type, count, totalHouseholds }) => ({
      municipality,
      race,
      type,
      count,
      totalHouseholds,
      fraction: count / totalHouseholds,
    })),
  };
}) satisfies PageServerLoad;
