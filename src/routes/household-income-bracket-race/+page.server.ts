import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const tidyDataAllYears = await fetch(
    '/data/household-income-bracket-race/tidy_median_income_by_race__allYears.json'
  )
    .then((response) => response.json())
    .then((data) => z.array(medianIncomeByRaceObjectSchema).parse(data));

  const acsYearsUnique = Array.from(new Set(tidyDataAllYears.map(({ yearsACS }) => yearsACS))).sort(
    (a, b) => (parseInt(a.split('-')[0]) > parseInt(b.split('-')[0]) ? 1 : -1)
  );

  const citiesUnique = Array.from(new Set(tidyDataAllYears.map(({ cityName }) => cityName)));

  return {
    tidyDataAllYears,
    acsYearsUnique,
    citiesUnique,
  };
}) satisfies PageServerLoad;

const medianIncomeByRaceObjectSchema = z.object({
  city: z.string(),
  state: z.string(),
  cityName: z.string(),
  yearsACS: z.string(),
  race: z.string(),
  incomeBracket: z.string(),
  households: z.number(),
  totalPlaceHouseholds: z.number(),
  placeMedianHouseholdIncome: z.number(),
  placeWhiteMedianHouseholdIncome: z.number(),
  placeBlackMedianHouseholdIncome: z.number(),
});
