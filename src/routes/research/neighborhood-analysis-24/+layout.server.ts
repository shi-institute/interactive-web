import { PRIVATE_DATA_REPO_ACCESS_TOKEN } from '$env/static/private';
import { deepFreeze } from '$utils';
import { fipsToCountyName } from '$utils/fipsToCountyName';
import { isNumber } from 'is-what';
import { get, writable } from 'svelte/store';
import { z } from 'zod';
import type { LayoutServerLoad } from './$types';

// cache the data in this server-side load function
// (shared with all requests to this route)
const cache = writable(new Map<string, unknown>());

export const load = (async ({ params }) => {
  const cachedData = get(cache);
  if (
    cachedData.has('neighborhoodsData') &&
    cachedData.has('gentrificationData') &&
    cachedData.has('tractsData') &&
    cachedData.has('neighborhoodBlocksData')
  ) {
    const expires = cachedData.get('expires');
    const expired = isNumber(expires) && Date.now() > expires;

    // if the cache is not expired, return the cached data
    if (!expired) {
      return {
        neighborhoodsData: deepFreeze(
          cachedData.get('neighborhoodsData') as z.infer<typeof neighborhoodDataSchema>[]
        ),
        gentrificationData: deepFreeze(
          cachedData.get('gentrificationData') as (z.infer<typeof gentrificationDataSchema> & {
            neighborhoods: string[];
          })[]
        ),
        tractsData: deepFreeze(cachedData.get('tractsData') as z.infer<typeof tractDataSchema>[]),
        neighborhoodBlocksData: deepFreeze(
          cachedData.get('neighborhoodBlocksData') as z.infer<typeof neighborhoodBlocksDataSchema>[]
        ),
      };
    }
  }

  const validNeighborhoodsData = fetch(
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
    .then((json) => z.array(neighborhoodDataSchema).parse(json))
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2), '<- Error fetching neighborhoods data');
      return [] as z.infer<typeof neighborhoodDataSchema>[];
    });

  const validGentrificationData = fetch(
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
    .then((json) => z.array(gentrificationDataSchema).parse(json))
    .then(async (data) => {
      const awaitedNeighborhoodsData = await validNeighborhoodsData;

      return (
        data
          .map((d) => {
            const neighborhoodNames = awaitedNeighborhoodsData
              .filter(({ GEOID }) => GEOID.includes(d.Tract))
              .map(({ neighborhood_name }) => neighborhood_name);

            const uniqueNeighborhoodNames = Array.from(new Set(neighborhoodNames));

            return {
              ...d,
              neighborhoods: uniqueNeighborhoodNames.length ? uniqueNeighborhoodNames : [],
            };
          })
          // only keep tracts with neighborhoods
          .filter((d) => d.neighborhoods.length)
      );
    });

  const validTractsData = fetch(
    'https://api.github.com/repos/shi-institute/interactive-web-private-data/contents/northside-24/tracts_data_series.json',
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
    .then((json) => z.array(tractDataSchema).parse(json))
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2), '<- Error fetching tracts data');
      return [] as z.infer<typeof tractDataSchema>[];
    });

  const validNeighborhoodBlocksData = fetch(
    'https://api.github.com/repos/shi-institute/interactive-web-private-data/contents/northside-24/blocks_data_series.json',
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: `token ${PRIVATE_DATA_REPO_ACCESS_TOKEN}`,
      },
    }
  )
    .then((res) => res.json() as Promise<Record<string, unknown>[]>)
    .then((json) => z.array(neighborhoodBlocksDataSchema).parse(json))
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2), '<- Error fetching neighborhood blocks data');
      return [];
    });

  const frozenData = await Promise.all([
    validNeighborhoodsData,
    validGentrificationData,
    validTractsData,
    validNeighborhoodBlocksData,
  ]).then(([neighborhoodsData, gentrificationData, tractsData, neighborhoodBlocksData]) => {
    return {
      neighborhoodsData: deepFreeze(neighborhoodsData),
      gentrificationData: deepFreeze(gentrificationData),
      tractsData: deepFreeze(tractsData),
      neighborhoodBlocksData: deepFreeze(neighborhoodBlocksData),
    };
  });

  cache.update((c) => {
    c.set('neighborhoodsData', frozenData.neighborhoodsData);
    c.set('gentrificationData', frozenData.gentrificationData);
    c.set('tractsData', frozenData.tractsData);
    c.set('neighborhoodBlocksData', frozenData.neighborhoodBlocksData);
    c.set('expires', Date.now() + 1000 * 60); // 1 hour
    return c;
  });

  return frozenData;
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

const neighborhoodDataSchema = z
  .object({
    neighborhood_name: z.string(),
    year_range: z.string(),
    GISJOIN: z.string(),
    geometry: z.string(),

    // estimates
    age__65_over: z.number(),
    age__65_over_fraction: z.number(),
    age__under_5: z.number(),
    age__under_5_fraction: z.number(),
    'disability__18-34__female': z.number(),
    'disability__18-34__male': z.number(),
    'disability__35-64__female': z.number(),
    'disability__35-64__male': z.number(),
    'disability__5-17__female': z.number(),
    'disability__5-17__male': z.number(),
    'disability__65-74__female': z.number(),
    'disability__65-74__male': z.number(),
    disability__75_over__female: z.number(),
    disability__75_over__male: z.number(),
    disability__total: z.number(),
    disability__total_fraction: z.number(),
    disability__under_5__female: z.number(),
    disability__under_5__male: z.number(),
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
    employment__black__employed: z.number(),
    employment__black__unemployed: z.number(),
    employment__employed: z.number(),
    employment__hispanic__employed: z.number(),
    employment__hispanic__unemployed: z.number(),
    employment__unemployed: z.number(),
    employment__white__employed: z.number(),
    employment__white__unemployed: z.number(),
    ethnicity__hispanic_or_latino: z.number(),
    ethnicity__hispanic_or_latino__amer_indian_alaskan_native: z.number(),
    ethnicity__hispanic_or_latino__asian: z.number(),
    ethnicity__hispanic_or_latino__black: z.number(),
    ethnicity__hispanic_or_latino__other_race: z.number(),
    ethnicity__hispanic_or_latino__pacific_islander: z.number(),
    ethnicity__hispanic_or_latino__white: z.number(),
    ethnicity__not_hispanic_or_latino: z.number(),
    ethnicity__not_hispanic_or_latino__amer_indian_alaskan_native: z.number(),
    ethnicity__not_hispanic_or_latino__asian: z.number(),
    ethnicity__not_hispanic_or_latino__black: z.number(),
    ethnicity__not_hispanic_or_latino__other_race: z.number(),
    ethnicity__not_hispanic_or_latino__pacific_islander: z.number(),
    ethnicity__not_hispanic_or_latino__two_or_more_races: z.number(),
    ethnicity__not_hispanic_or_latino__white: z.number(),
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
    insurance_coverage__black__with_insurance: z.number(),
    insurance_coverage__black__without_insurance: z.number(),
    insurance_coverage__hispanic__with_insurance: z.number(),
    insurance_coverage__hispanic__without_insurance: z.number(),
    insurance_coverage__white__with_insurance: z.number(),
    insurance_coverage__white__without_insurance: z.number(),
    insurance_coverage__with_insurance: z.number(),
    insurance_coverage__without_insurance: z.number(),
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
    tenure__black__owner: z.number(),
    tenure__black__renter: z.number(),
    tenure__hispanic__owner: z.number(),
    tenure__hispanic__renter: z.number(),
    tenure__owner: z.number(),
    tenure__renter: z.number(),
    tenure__white__owner: z.number(),
    tenure__white__renter: z.number(),
    veteran__18_to_64_years: z.number(),
    veteran__65_years_and_over: z.number(),
    vision_difficulty__under_5__male: z.number(),
    'vision_difficulty__5-17__male': z.number(),
    'vision_difficulty__18-34__male': z.number(),
    'vision_difficulty__35-64__male': z.number(),
    'vision_difficulty__65-74__male': z.number(),
    vision_difficulty__75_over__male: z.number(),
    vision_difficulty__under_5__female: z.number(),
    'vision_difficulty__5-17__female': z.number(),
    'vision_difficulty__18-34__female': z.number(),
    'vision_difficulty__35-64__female': z.number(),
    'vision_difficulty__65-74__female': z.number(),
    vision_difficulty__75_over__female: z.number(),
  })
  .transform((d) => {
    return {
      ...d,
      neighborhood_name: toTitleCase(d.neighborhood_name),
      year: d.year_range,
      GEOID: d.GISJOIN.split(',').map(toGEOID),
    };
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

const tractDataSchema = z
  .object({
    GEOID: z.number(),
    NAMELSAD: z.string(),
    STATEFP: z.number(),
    COUNTYFP: z.number(),
    year_range: z.string(),
    GISJOIN: z.string(),
    geometry: z.string(),

    // estimates
    age__65_over: z.number(),
    age__65_over_fraction: z.number(),
    age__under_5: z.number(),
    age__under_5_fraction: z.number(),
    'disability__18-34__female': z.number(),
    'disability__18-34__male': z.number(),
    'disability__35-64__female': z.number(),
    'disability__35-64__male': z.number(),
    'disability__5-17__female': z.number(),
    'disability__5-17__male': z.number(),
    'disability__65-74__female': z.number(),
    'disability__65-74__male': z.number(),
    disability__75_over__female: z.number(),
    disability__75_over__male: z.number(),
    disability__total: z.number(),
    disability__total_fraction: z.number(),
    disability__under_5__female: z.number(),
    disability__under_5__male: z.number(),
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
    employment__black__employed: z.number(),
    employment__black__unemployed: z.number(),
    employment__employed: z.number(),
    employment__hispanic__employed: z.number(),
    employment__hispanic__unemployed: z.number(),
    employment__unemployed: z.number(),
    employment__white__employed: z.number(),
    employment__white__unemployed: z.number(),
    ethnicity__hispanic_or_latino: z.number(),
    ethnicity__hispanic_or_latino__amer_indian_alaskan_native: z.number(),
    ethnicity__hispanic_or_latino__asian: z.number(),
    ethnicity__hispanic_or_latino__black: z.number(),
    ethnicity__hispanic_or_latino__other_race: z.number(),
    ethnicity__hispanic_or_latino__pacific_islander: z.number(),
    ethnicity__hispanic_or_latino__white: z.number(),
    ethnicity__not_hispanic_or_latino: z.number(),
    ethnicity__not_hispanic_or_latino__amer_indian_alaskan_native: z.number(),
    ethnicity__not_hispanic_or_latino__asian: z.number(),
    ethnicity__not_hispanic_or_latino__black: z.number(),
    ethnicity__not_hispanic_or_latino__other_race: z.number(),
    ethnicity__not_hispanic_or_latino__pacific_islander: z.number(),
    ethnicity__not_hispanic_or_latino__two_or_more_races: z.number(),
    ethnicity__not_hispanic_or_latino__white: z.number(),
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
    insurance_coverage__black__with_insurance: z.number(),
    insurance_coverage__black__without_insurance: z.number(),
    insurance_coverage__hispanic__with_insurance: z.number(),
    insurance_coverage__hispanic__without_insurance: z.number(),
    insurance_coverage__white__with_insurance: z.number(),
    insurance_coverage__white__without_insurance: z.number(),
    insurance_coverage__with_insurance: z.number(),
    insurance_coverage__without_insurance: z.number(),
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
    tenure__black__owner: z.number(),
    tenure__black__renter: z.number(),
    tenure__hispanic__owner: z.number(),
    tenure__hispanic__renter: z.number(),
    tenure__owner: z.number(),
    tenure__renter: z.number(),
    tenure__white__owner: z.number(),
    tenure__white__renter: z.number(),
    veteran__18_to_64_years: z.number(),
    veteran__65_years_and_over: z.number(),
    vision_difficulty__under_5__male: z.number(),
    'vision_difficulty__5-17__male': z.number(),
    'vision_difficulty__18-34__male': z.number(),
    'vision_difficulty__35-64__male': z.number(),
    'vision_difficulty__65-74__male': z.number(),
    vision_difficulty__75_over__male: z.number(),
    vision_difficulty__under_5__female: z.number(),
    'vision_difficulty__5-17__female': z.number(),
    'vision_difficulty__18-34__female': z.number(),
    'vision_difficulty__35-64__female': z.number(),
    'vision_difficulty__65-74__female': z.number(),
    vision_difficulty__75_over__female: z.number(),

    // margins of error
    Mage__65_over: z.number(),
    Mage__65_over_fraction: z.number(),
    Mage__under_5: z.number(),
    Mage__under_5_fraction: z.number(),
    Mdisability__total: z.number(),
    Mdisability__total_fraction: z.number(),
    Medu_enrollment__black__college_undergraduate: z.number(),
    Medu_enrollment__black__graduate_professional: z.number(),
    Medu_enrollment__black__k12: z.number(),
    Medu_enrollment__black__nursery_preschool: z.number(),
    Medu_enrollment__black__total: z.number(),
    Medu_enrollment__college_undergraduate: z.number(),
    Medu_enrollment__graduate_professional: z.number(),
    Medu_enrollment__hispanic__college_undergraduate: z.number(),
    Medu_enrollment__hispanic__graduate_professional: z.number(),
    Medu_enrollment__hispanic__k12: z.number(),
    Medu_enrollment__hispanic__nursery_preschool: z.number(),
    Medu_enrollment__hispanic__total: z.number(),
    Medu_enrollment__k12: z.number(),
    Medu_enrollment__nursery_preschool: z.number(),
    Medu_enrollment__total: z.number(),
    Medu_enrollment__white__college_undergraduate: z.number(),
    Medu_enrollment__white__graduate_professional: z.number(),
    Medu_enrollment__white__k12: z.number(),
    Medu_enrollment__white__nursery_preschool: z.number(),
    Medu_enrollment__white__total: z.number(),
    Meducation__associates_degree: z.number(),
    Meducation__bachelors_degree: z.number(),
    Meducation__doctorate_degree: z.number(),
    Meducation__ged_or_alternative_credential: z.number(),
    Meducation__masters_degree: z.number(),
    Meducation__professional_school_degree: z.number(),
    Meducation__regular_high_school_diploma: z.number(),
    Meducation__some_college_no_degree: z.number(),
    Memployment__black__employed: z.number(),
    Memployment__black__unemployed: z.number(),
    Memployment__employed: z.number(),
    Memployment__hispanic__employed: z.number(),
    Memployment__hispanic__unemployed: z.number(),
    Memployment__unemployed: z.number(),
    Memployment__white__employed: z.number(),
    Memployment__white__unemployed: z.number(),
    Methnicity__hispanic_or_latino: z.number(),
    Methnicity__hispanic_or_latino__amer_indian_alaskan_native: z.number(),
    Methnicity__hispanic_or_latino__asian: z.number(),
    Methnicity__hispanic_or_latino__black: z.number(),
    Methnicity__hispanic_or_latino__other_race: z.number(),
    Methnicity__hispanic_or_latino__pacific_islander: z.number(),
    Methnicity__hispanic_or_latino__white: z.number(),
    Methnicity__not_hispanic_or_latino: z.number(),
    Methnicity__not_hispanic_or_latino__amer_indian_alaskan_native: z.number(),
    Methnicity__not_hispanic_or_latino__asian: z.number(),
    Methnicity__not_hispanic_or_latino__black: z.number(),
    Methnicity__not_hispanic_or_latino__other_race: z.number(),
    Methnicity__not_hispanic_or_latino__pacific_islander: z.number(),
    Methnicity__not_hispanic_or_latino__two_or_more_races: z.number(),
    Methnicity__not_hispanic_or_latino__white: z.number(),
    Mfood_stamps__not_received: z.number(),
    Mfood_stamps__not_received__above_poverty: z.number(),
    Mfood_stamps__not_received__below_poverty: z.number(),
    Mfood_stamps__received: z.number(),
    Mfood_stamps__received__above_poverty: z.number(),
    Mfood_stamps__received__below_poverty: z.number(),
    Mfood_stamps__received_fraction: z.number(),
    Mgeographic_mobility__abroad: z.number(),
    Mgeographic_mobility__abroad_fraction: z.number(),
    Mgeographic_mobility__different_county_same_state: z.number(),
    Mgeographic_mobility__different_county_same_state_fraction: z.number(),
    Mgeographic_mobility__different_state: z.number(),
    Mgeographic_mobility__different_state_fraction: z.number(),
    Mgeographic_mobility__no_income: z.number(),
    Mgeographic_mobility__no_income_fraction: z.number(),
    Mgeographic_mobility__no_movement: z.number(),
    Mgeographic_mobility__no_movement_fraction: z.number(),
    Mgeographic_mobility__same_county: z.number(),
    Mgeographic_mobility__same_county_fraction: z.number(),
    Mgeographic_mobility__with_income: z.number(),
    Mgeographic_mobility__with_income_fraction: z.number(),
    Mhas_computer__black: z.number().nullable().optional(),
    Mhas_computer__black_percent: z.number().nullable().optional(),
    Mhas_computer__hispanic: z.number().nullable().optional(),
    Mhas_computer__hispanic_percent: z.number().nullable().optional(),
    Mhas_computer__total: z.number().nullable().optional(),
    Mhas_computer__total_percent: z.number().nullable().optional(),
    Mhas_computer__white: z.number().nullable().optional(),
    Mhas_computer__white_percent: z.number().nullable().optional(),
    Mhousehold_vehicles__0: z.number(),
    Mhousehold_vehicles__none_fraction: z.number(),
    Mhousing__total_occupied: z.number(),
    Mindustry__service_fraction: z.number(),
    Mindustry_employment__recreation_services_etc: z.number(),
    Mindustry_employment__social_services_etc: z.number(),
    Minsurance_coverage__black__with_insurance: z.number(),
    Minsurance_coverage__black__without_insurance: z.number(),
    Minsurance_coverage__hispanic__with_insurance: z.number(),
    Minsurance_coverage__hispanic__without_insurance: z.number(),
    Minsurance_coverage__white__with_insurance: z.number(),
    Minsurance_coverage__white__without_insurance: z.number(),
    Minsurance_coverage__with_insurance: z.number(),
    Minsurance_coverage__without_insurance: z.number(),
    Minternet__broadband__black: z.number().nullable().optional(),
    Minternet__broadband__black_percent: z.number().nullable().optional(),
    Minternet__broadband__hispanic: z.number().nullable().optional(),
    Minternet__broadband__hispanic_percent: z.number().nullable().optional(),
    Minternet__broadband__total: z.number().nullable().optional(),
    Minternet__broadband__total_percent: z.number().nullable().optional(),
    Minternet__broadband__white: z.number().nullable().optional(),
    Minternet__broadband__white_percent: z.number().nullable().optional(),
    Mmedian_household_income: z.number(),
    Mmedian_household_income__black: z.number().nullable().optional(),
    Mmedian_household_income__white: z.number().nullable().optional(),
    Mmedian_household_income__hispanic: z.number().nullable().optional(),
    Mno_computer__black: z.number().nullable().optional(),
    Mno_computer__hispanic: z.number().nullable().optional(),
    Mno_computer__total: z.number().nullable().optional(),
    Mno_computer__white: z.number().nullable().optional(),
    Mpopulation__children_living_with_grandparent_householder: z.number(),
    Mpopulation__children_living_with_grandparent_householder_fraction: z.number(),
    Mpopulation__total: z.number(),
    Mpoverty__above_poverty_household: z.number(),
    Mpoverty__above_poverty_household_fraction: z.number(),
    Mpoverty__below_poverty_household: z.number(),
    Mpoverty__below_poverty_household_fraction: z.number(),
    Mtenure__black__owner: z.number(),
    Mtenure__black__renter: z.number(),
    Mtenure__hispanic__owner: z.number(),
    Mtenure__hispanic__renter: z.number(),
    Mtenure__owner: z.number(),
    Mtenure__renter: z.number(),
    Mtenure__white__owner: z.number(),
    Mtenure__white__renter: z.number(),
    Mveteran__18_to_64_years: z.number(),
    Mveteran__65_years_and_over: z.number(),
    Mvision_difficulty__under_5__male: z.number(),
    'Mvision_difficulty__5-17__male': z.number(),
    'Mvision_difficulty__18-34__male': z.number(),
    'Mvision_difficulty__35-64__male': z.number(),
    'Mvision_difficulty__65-74__male': z.number(),
    Mvision_difficulty__75_over__male: z.number(),
    Mvision_difficulty__under_5__female: z.number(),
    'Mvision_difficulty__5-17__female': z.number(),
    'Mvision_difficulty__18-34__female': z.number(),
    'Mvision_difficulty__35-64__female': z.number(),
    'Mvision_difficulty__65-74__female': z.number(),
    Mvision_difficulty__75_over__female: z.number(),
  })
  .transform(({ GEOID, NAMELSAD, STATEFP, COUNTYFP, ...rest }) => {
    const [, fipsData] = fipsToCountyName(STATEFP, COUNTYFP);

    const fullTractName = (() => {
      if (!fipsData) return NAMELSAD;

      return fipsData.CountyName + ', ' + fipsData.StateAbbr + ' ' + NAMELSAD;
    })();

    return {
      tract_id: GEOID,
      tract_name: fullTractName,
      year: rest.year_range,
      ...rest,
    };
  });

const neighborhoodBlocksDataSchema = z
  .object({
    neighborhood_name: z.string(),
    year: z.number(),
    GISJOIN: z.string(),
    geometry: z.string(),

    'age__10-14__female': z.number().nullable(),
    'age__10-14__male': z.number().nullable(),
    'age__15-17__female': z.number().nullable(),
    'age__15-17__male': z.number().nullable(),
    'age__18-19__female': z.number().nullable(),
    'age__18-19__male': z.number().nullable(),
    age__20__female: z.number().nullable(),
    age__20__male: z.number().nullable(),
    age__21__female: z.number().nullable(),
    age__21__male: z.number().nullable(),
    'age__22-24__female': z.number().nullable(),
    'age__22-24__male': z.number().nullable(),
    'age__25-29__female': z.number().nullable(),
    'age__25-29__male': z.number().nullable(),
    'age__30-34__female': z.number().nullable(),
    'age__30-34__male': z.number().nullable(),
    'age__35-39__female': z.number().nullable(),
    'age__35-39__male': z.number().nullable(),
    'age__40-44__female': z.number().nullable(),
    'age__40-44__male': z.number().nullable(),
    'age__45-49__female': z.number().nullable(),
    'age__45-49__male': z.number().nullable(),
    'age__5-9__female': z.number().nullable(),
    'age__5-9__male': z.number().nullable(),
    'age__50-54__female': z.number().nullable(),
    'age__50-54__male': z.number().nullable(),
    'age__55-59__female': z.number().nullable(),
    'age__55-59__male': z.number().nullable(),
    'age__60-61__female': z.number().nullable(),
    'age__60-61__male': z.number().nullable(),
    'age__62-64__female': z.number().nullable(),
    'age__62-64__male': z.number().nullable(),
    'age__65-66__female': z.number().nullable(),
    'age__65-66__male': z.number().nullable(),
    'age__67-69__female': z.number().nullable(),
    'age__67-69__male': z.number().nullable(),
    'age__70-74__female': z.number().nullable(),
    'age__70-74__male': z.number().nullable(),
    'age__75-79__female': z.number().nullable(),
    'age__75-79__male': z.number().nullable(),
    'age__80-84__female': z.number().nullable(),
    'age__80-84__male': z.number().nullable(),
    age__85_over__female: z.number().nullable(),
    age__85_over__male: z.number().nullable(),
    age__under_5__female: z.number().nullable(),
    age__under_5__male: z.number().nullable(),
    ethnicity__hispanic_or_latino: z.number().nullable(),
    ethnicity__hispanic_or_latino__amer_indian_alaskan_native: z.number().nullable(),
    ethnicity__hispanic_or_latino__asian: z.number().nullable(),
    ethnicity__hispanic_or_latino__black: z.number().nullable(),
    ethnicity__hispanic_or_latino__other_race: z.number().nullable(),
    ethnicity__hispanic_or_latino__pacific_islander: z.number().nullable(),
    ethnicity__hispanic_or_latino__two_or_more_races: z.number().nullable(),
    ethnicity__hispanic_or_latino__white: z.number().nullable(),
    ethnicity__not_hispanic_or_latino: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__amer_indian_alaskan_native: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__asian: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__black: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__other_race: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__pacific_islander: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__two_or_more_races: z.number().nullable(),
    ethnicity__not_hispanic_or_latino__white: z.number().nullable(),
    female__total: z.number().nullable(),
    female_total: z.number().nullable(),
    households__total: z.number().nullable(),
    households__with_seniors: z.number().nullable(),
    households__with_seniors__1_person: z.number().nullable(),
    households__with_seniors__2_or_more_persons: z.number().nullable(),
    households__with_seniors__2_or_more_persons__family: z.number().nullable(),
    households__with_seniors__2_or_more_persons__nonfamily: z.number().nullable(),
    households__without_seniors: z.number().nullable(),
    households__without_seniors__1_person: z.number().nullable(),
    households__without_seniors__2_or_more_persons: z.number().nullable(),
    households__without_seniors__2_or_more_persons__family: z.number().nullable(),
    households__without_seniors__2_or_more_persons__nonfamily: z.number().nullable(),
    housing__owned_mortage_loan: z.number().nullable(),
    housing__owned_no_loan: z.number().nullable(),
    housing__owner_occupied: z.number().nullable(),
    housing__renter_occupied: z.number().nullable(),
    housing__total_occupied: z.number().nullable(),
    housing_units__occupied: z.number().nullable(),
    housing_units__total: z.number().nullable(),
    housing_units__vacant: z.number().nullable(),
    male__total: z.number().nullable(),
    male_total: z.number().nullable(),
    population_total: z.number().nullable(),
  })
  .transform(({ population_total, year, ...rest }) => {
    return {
      ...rest,
      year: year.toString(),
      population__total: population_total,
    };
  });
