import { notEmpty } from '$utils/notEmpty';
import { error } from '@sveltejs/kit';
import type { CDRZ } from '../CDRZ';
import scCDRZs2010 from '../sc-cdrzs-2010.json';
import scCDRZs from '../sc-cdrzs.json';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  const tracts = params.tract.includes(',')
    ? [...new Set(params.tract.split(','))]
    : [params.tract];

  const matches = tracts
    .map((tract, index) => {
      const match2020 = scCDRZs.find((cdrz) => cdrz.tract === tract) as unknown as CDRZ | undefined;
      const match2010 = scCDRZs2010.find((cdrz) => cdrz.tract === tract) as unknown as
        | CDRZ
        | undefined;

      if (!match2020 || !match2010) {
        // guarantees that at least the first tract is correct
        // and that the array will therefore at least contain one match
        if (index === 0) throw error(404, 'No match found');
        return null;
      }
      return { 2020: match2020, 2010: match2010 };
    })
    .filter(notEmpty);

  return {
    cdrz: matches[0][2020],
    cdrz2010: matches[0][2010],
    additional: matches.slice(1),
    tracts,
  };
}) satisfies PageLoad;
