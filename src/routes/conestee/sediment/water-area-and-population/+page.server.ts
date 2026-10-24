import type { PageServerLoad } from './$types';
import data from './data.json';

export const load = (async () => {
  return {
    tidy: data,
  };
}) satisfies PageServerLoad;
