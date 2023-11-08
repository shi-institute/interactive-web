import type { CDRZ } from '../CDRZ';
import type { PageLoad } from './$types';

export const load = (() => {
  return {
    cdrz: {
      tract: 'test-tract-number',
      places: [
        { name: 'Something', coordinates: { longitude: 0, latitude: 0 } },
        { name: 'TownCityVille' },
        { name: 'FloodsALotLand' },
        { name: 'OhNo' },
      ],
      urban: 0.87,
      rural: 0.13,
      ownership: {
        total: {
          renters: 214,
          owners: 102,
        },
      },
    } satisfies CDRZ,
  };
}) satisfies PageLoad;
