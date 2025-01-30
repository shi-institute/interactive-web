import { PRIVATE_DATA_REPO_ACCESS_TOKEN } from '$env/static/private';
import { deepFreeze } from '$utils';
import { capitalize } from '$utils/capitalize';
import { isNumber } from 'is-what';
import { get, writable } from 'svelte/store';
import { z } from 'zod';
import type { LayoutServerLoad } from './$types';

// cache the data in this server-side load function
// (shared with all requests to this route)
const cache = writable(new Map<string, unknown>());

export const load = (async ({ params }) => {
  const neighborhood = capitalize(params.neighborhood.replace('-24', ''));

  const cachedData = get(cache);
  if (cachedData.has('neighborhoodsData') && cachedData.has('gentrificationData')) {
    const expires = cachedData.get('expires');
    const expired = isNumber(expires) && Date.now() > expires;

    // if the cache is not expired, return the cached data
    if (!expired) {
      return {
        neighborhoodsData: deepFreeze(
          cachedData.get('neighborhoodsData') as z.infer<typeof neighborhoodDataSchema>[]
        ),
        gentrificationData: deepFreeze(
          cachedData.get('gentrificationData') as z.infer<typeof gentrificationDataSchema>[]
        ),
        neighborhood,
      };
    }
  }

  const validNeighborhoodsData = await fetch(
    'https://api.github.com/repos/shi-institute/interactive-web-private-data/contents/northside-24/neighborhoods_data_series.json',
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: `token ${PRIVATE_DATA_REPO_ACCESS_TOKEN}`,
      },
    }
  )
    .then((res) => res.json() as Promise<Record<string, unknown>[]>)
    .then((json) => json.filter((d) => d.population__total !== null))
    .then((json) => z.array(neighborhoodDataSchema).parse(json));

  const neighborhoodsData = validNeighborhoodsData.map((d) => {
    return {
      ...d,
      neighborhood_name: toTitleCase(d.neighborhood_name),
      year: d.year_range,
      GEOID: d.GISJOIN.split(',').map(toGEOID),
    };
  });

  cache.update((c) => {
    c.set('neighborhoodsData', neighborhoodsData);
    c.set('expires', Date.now() + 1000 * 60); // 1 hour
    return c;
  });

  const validGentrificationData = await fetch(
    'https://api.github.com/repos/shi-institute/interactive-web-private-data/contents/northside-24/inc_hv_annual_q_tract.json',
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: `token ${PRIVATE_DATA_REPO_ACCESS_TOKEN}`,
      },
    }
  )
    .then((res) => res.json() as Promise<Record<string, unknown>[]>)
    .then((json) => json.filter((d) => !!d.income_quantile && !!d.hvalue_quantile))
    .then((json) => z.array(gentrificationDataSchema).parse(json));

  const gentrificationData = validGentrificationData
    .map((d) => {
      const neighborhoodNames = neighborhoodsData
        .filter(({ GEOID }) => GEOID.includes(d.Tract))
        .map(({ neighborhood_name }) => neighborhood_name);

      const uniqueNeighborhoodNames = Array.from(new Set(neighborhoodNames));

      return {
        ...d,
        neighborhoods: uniqueNeighborhoodNames.length ? uniqueNeighborhoodNames : [],
      };
    })
    // only keep tracts with neighborhoods
    .filter((d) => d.neighborhoods.length);

  cache.update((c) => {
    c.set('gentrificationData', gentrificationData);
    c.set('expires', Date.now() + 1000 * 60); // 1 hour
    return c;
  });

  return {
    neighborhoodsData: deepFreeze(neighborhoodsData),
    gentrificationData: deepFreeze(gentrificationData),
    neighborhood,
  };
}) satisfies LayoutServerLoad;

function toTitleCase(str: string) {
  const words = str.split(' ');
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.slice(0, 1);
    const remainingLetters = word.slice(1);
    return firstLetter.toUpperCase() + remainingLetters.toLowerCase();
  });
  return capitalizedWords.join(' ');
}

function toGEOID(gisjoin: string) {
  const state = gisjoin.slice(1, 3);
  const county = gisjoin.slice(4, 7);
  const tract = gisjoin.slice(8);

  return parseInt(state + county + tract);
}

const neighborhoodDataSchema = z.object({
  neighborhood_name: z.string(),
  GISJOIN: z.string(),
  age__65_over: z.number(),
  age__65_over_fraction: z.number(),
  age__under_5: z.number(),
  age__under_5_fraction: z.number(),
  disability__total: z.number(),
  disability__total_fraction: z.number(),
  edu_enrollment__black__college_undergraduate: z.number(),
  edu_enrollment__black__graduate_professional: z.number(),
  edu_enrollment__black__k12: z.number(),
  edu_enrollment__black__nursery_preschool: z.number(),
  edu_enrollment__black__total: z.number(),
  edu_enrollment__college_undergraduate: z.number(),
  edu_enrollment__graduate_professional: z.number(),
  edu_enrollment__hispanic__college_undergraduate: z.number(),
  edu_enrollment__hispanic__graduate_professional: z.number(),
  edu_enrollment__hispanic__k12: z.number(),
  edu_enrollment__hispanic__nursery_preschool: z.number(),
  edu_enrollment__hispanic__total: z.number(),
  edu_enrollment__k12: z.number(),
  edu_enrollment__nursery_preschool: z.number(),
  edu_enrollment__total: z.number(),
  edu_enrollment__white__college_undergraduate: z.number(),
  edu_enrollment__white__graduate_professional: z.number(),
  edu_enrollment__white__k12: z.number(),
  edu_enrollment__white__nursery_preschool: z.number(),
  edu_enrollment__white__total: z.number(),
  education__associates_degree: z.number(),
  education__bachelors_degree: z.number(),
  education__doctorate_degree: z.number(),
  education__ged_or_alternative_credential: z.number(),
  education__masters_degree: z.number(),
  education__professional_school_degree: z.number(),
  education__regular_high_school_diploma: z.number(),
  education__some_college_no_degree: z.number(),
  food_stamps__not_received: z.number(),
  food_stamps__not_received__above_poverty: z.number(),
  food_stamps__not_received__below_poverty: z.number(),
  food_stamps__received: z.number(),
  food_stamps__received__above_poverty: z.number(),
  food_stamps__received__below_poverty: z.number(),
  food_stamps__received_fraction: z.number(),
  geographic_mobility__abroad: z.number(),
  geographic_mobility__abroad_fraction: z.number(),
  geographic_mobility__different_county_same_state: z.number(),
  geographic_mobility__different_county_same_state_fraction: z.number(),
  geographic_mobility__different_state: z.number(),
  geographic_mobility__different_state_fraction: z.number(),
  geographic_mobility__no_income: z.number(),
  geographic_mobility__no_income_fraction: z.number(),
  geographic_mobility__no_movement: z.number(),
  geographic_mobility__no_movement_fraction: z.number(),
  geographic_mobility__same_county: z.number(),
  geographic_mobility__same_county_fraction: z.number(),
  geographic_mobility__with_income: z.number(),
  geographic_mobility__with_income_fraction: z.number(),
  geometry: z.string(),
  has_computer__black: z.number().nullable().optional(),
  has_computer__black_percent: z.number().nullable().optional(),
  has_computer__hispanic: z.number().nullable().optional(),
  has_computer__hispanic_percent: z.number().nullable().optional(),
  has_computer__total: z.number().nullable().optional(),
  has_computer__total_percent: z.number().nullable().optional(),
  has_computer__white: z.number().nullable().optional(),
  has_computer__white_percent: z.number().nullable().optional(),
  household_vehicles__0: z.number(),
  household_vehicles__none_fraction: z.number(),
  housing__total_occupied: z.number(),
  industry__service_fraction: z.number(),
  industry_employment__recreation_services_etc: z.number(),
  industry_employment__social_services_etc: z.number(),
  internet__broadband__black: z.number().nullable().optional(),
  internet__broadband__black_percent: z.number().nullable().optional(),
  internet__broadband__hispanic: z.number().nullable().optional(),
  internet__broadband__hispanic_percent: z.number().nullable().optional(),
  internet__broadband__total: z.number().nullable().optional(),
  internet__broadband__total_percent: z.number().nullable().optional(),
  internet__broadband__white: z.number().nullable().optional(),
  internet__broadband__white_percent: z.number().nullable().optional(),
  median_household_income: z.number(),
  median_household_income__black: z.number().nullable().optional(),
  median_household_income__white: z.number().nullable().optional(),
  median_household_income__hispanic: z.number().nullable().optional(),
  no_computer__black: z.number().nullable().optional(),
  no_computer__hispanic: z.number().nullable().optional(),
  no_computer__total: z.number().nullable().optional(),
  no_computer__white: z.number().nullable().optional(),
  population__children_living_with_grandparent_householder: z.number(),
  population__children_living_with_grandparent_householder_fraction: z.number(),
  population__total: z.number(),
  poverty__above_poverty_household: z.number(),
  poverty__above_poverty_household_fraction: z.number(),
  poverty__below_poverty_household: z.number(),
  poverty__below_poverty_household_fraction: z.number(),
  veteran__18_to_64_years: z.number(),
  veteran__65_years_and_over: z.number(),
  year_range: z.string(),
});

const gentrificationDataSchema = z.object({
  ID: z.number(),
  GISJOIN: z.string(),
  Tract: z.number(),
  region: z.string(),
  class: z.number(),
  year: z.number(),
  hpi: z.number().optional(),
  imp: z.number(),
  ImpAndScaled: z.number(),
  imputed_flag: z.boolean(),
  was2020imp: z.boolean(),
  zcta: z.number(),
  med_hh_inc_2020: z.number(),
  totpop2020: z.number(),
  tothu2020: z.number(),
  med_hv2020_tract: z.number(),
  med_hv_tracts: z.number(),
  avg_hh_inc: z.number(),
  zcta_inc_growth: z.number(),
  avg_hhinc_tracts: z.number(),
  income_quantile: z.number(),
  hvalue_quantile: z.number(),
  q_diff: z.number(),
  q_diff_flag: z.boolean(),
});
