import { z } from 'zod';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({ fetch }) => {
  const landcoverStats = fetch(
    '/filestore/upstate-sc-land/conus_landcover_projections_2006-2100_stats.json'
  )
    .then((res) => res.json())
    .then((data) => schema.parse(data))
    .then((data) =>
      data.map((obj) => ({
        ...obj,
        ...Object.fromEntries(
          Object.entries(obj.pixels).map(([key, value]) => [
            `millionSqKm${key.replaceAll(' ', '').replaceAll('/', '')}`,
            (value * 0.25) / // each pixel represents 0.25 square kilometers
              1000000, // we want to show by millions of square kilometers
          ])
        ),
      }))
    );

  return {
    landcoverStats: await landcoverStats,
  };
}) satisfies PageLoad;

const schema = z
  .object({
    name: z.string(),
    year: z.string(),
    scenario: z.string(),
    pixels: z.object({
      Water: z.number(),
      Developed: z.number(),
      'Mechanically Disturbed National Forests': z.number(),
      'Mechanically Disturbed Other Public Lands': z.number(),
      'Mechanically Disturbed Private': z.number(),
      Mining: z.number(),
      Barren: z.number(),
      'Deciduous Forest': z.number(),
      'Evergreen Forest': z.number(),
      'Mixed Forest': z.number(),
      Grassland: z.number(),
      Shrubland: z.number(),
      Cropland: z.number(),
      'Hay/Pasture Land': z.number(),
      'Herbaceous Wetland': z.number(),
      'Woody Wetland': z.number(),
      'Perennial Ice/Snow': z.number(),
    }),
    totalPixels: z.number(),
  })
  .array();
