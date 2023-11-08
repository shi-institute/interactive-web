import { error } from '@sveltejs/kit';
import type { CDRZ } from '../CDRZ';
import scCDRZs from '../sc-cdrzs.json';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  const matchingCDRZ = scCDRZs.find((cdrz) => cdrz.tract === params.tract);

  if (!matchingCDRZ) throw error(404, 'No match found');

  return {
    cdrz: matchingCDRZ as unknown as CDRZ,
  };
}) satisfies PageLoad;
