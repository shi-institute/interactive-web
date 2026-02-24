import type { PageServerLoad } from './$types';
import tidyDataAllYears from './tidy_median_income_by_race__allYears.json';

export const load = (async () => {
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
