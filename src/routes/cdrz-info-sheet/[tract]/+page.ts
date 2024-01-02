import { error } from '@sveltejs/kit';
import type { CDRZ } from '../CDRZ';
import scCDRZs2010 from '../sc-cdrzs-2010.json';
import scCDRZs from '../sc-cdrzs.json';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  const matchingCDRZ = scCDRZs.find((cdrz) => cdrz.tract === params.tract) as unknown as
    | CDRZ
    | undefined;
  const matchingCDRZ2010 = scCDRZs2010.find((cdrz) => cdrz.tract === params.tract) as unknown as
    | CDRZ
    | undefined;

  if (!matchingCDRZ) throw error(404, 'No match found');

  return {
    cdrz: matchingCDRZ,
    cdrz2010: matchingCDRZ2010,
  };
}) satisfies PageLoad;
