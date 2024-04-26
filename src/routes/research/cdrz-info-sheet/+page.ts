import type { PageLoad } from './$types';
import scCDRZs from './sc-cdrzs.json';

export const load = (() => {
  return {
    cdrzs: scCDRZs,
  };
}) satisfies PageLoad;
