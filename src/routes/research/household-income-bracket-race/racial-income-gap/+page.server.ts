import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const data = fetch('/filestore/household-income-bracket-race/racial-income-gap.json')
    .then((res) => res.json())
    .then((data) => schema.parse(data));

  return {
    tidy: (await data).filter(({ whiteBlackIncomeRatio }) => !!whiteBlackIncomeRatio),
  };
}) satisfies PageServerLoad;

const schema = z
  .object({
    municipality: z.string(),
    race: z.string(),
    medianHouseholdIncome: z.number(),
    whiteBlackIncomeRatio: z.number().optional(),
    index: z.number(),
  })
  .array();
