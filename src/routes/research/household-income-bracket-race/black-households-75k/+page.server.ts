import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const data = fetch('/filestore/household-income-bracket-race/black-households-75k.json')
    .then((res) => res.json())
    .then((data) => schema.parse(data));

  return {
    tidy: (await data).map(({ municipality, race, type, count, totalHouseholds }) => ({
      municipality,
      race,
      type,
      count,
      totalHouseholds,
      fraction: count / totalHouseholds,
    })),
  };
}) satisfies PageServerLoad;

const schema = z
  .object({
    municipality: z.string(),
    race: z.string(),
    type: z.string(),
    count: z.number(),
    totalHouseholds: z.number(),
    fraction: z.number().optional(),
  })
  .array();
