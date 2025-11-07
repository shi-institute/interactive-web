import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const est1 = fetch('/filestore/household-income-bracket-race/population-by-race-acs/est1.json')
    .then((res) => res.json())
    .then((data) => estimatesSchema.parse(data));

  const est5 = fetch('/filestore/household-income-bracket-race/population-by-race-acs/est5.json')
    .then((res) => res.json())
    .then((data) => estimatesSchema.parse(data));

  const cv = fetch(
    '/filestore/household-income-bracket-race/population-by-race-acs/tidyVarianceCoefficientsData.json'
  )
    .then((res) => res.json())
    .then((data) => cvSchema.parse(data));

  return {
    est1: (await est1).map((d) => ({ ...d, year: new Date(d.year) })),
    est5: (await est5).map((d) => ({ ...d, year: new Date(d.year) })),
    cv: (await cv).map((d) => ({ ...d, year: new Date(d.year) })),
  };
}) satisfies PageServerLoad;

const estimatesSchema = z
  .object({
    GISJOIN: z.string(),
    year: z.coerce.date(),
    black: z.number(),
    blackMOE: z.number(),
    blackVarianceCoefficient: z.number(),
    blackFraction: z.number(),
    blackFractionMOE: z.number(),
    white: z.number(),
    whiteMOE: z.number(),
    whiteVarianceCoefficient: z.number(),
    whiteFraction: z.number(),
    whiteFractionMOE: z.number(),
    total: z.number(),
    totalMOE: z.number(),
    totalVarianceCoefficient: z.number(),
    variant: z.string(),
  })
  .array();

const cvSchema = z
  .object({
    GISJOIN: z.string(),
    year: z.coerce.date(),
    race: z.string(),
    type: z.string(),
    varianceCoefficient: z.number(),
    group: z.string(),
  })
  .array();
