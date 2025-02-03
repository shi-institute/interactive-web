import type { ParamMatcher } from '@sveltejs/kit';

const validNeighborhoods = ['northside', 'sterling'];
const validTracts = [
  45045000500, // sterling
  45045002105, // sterling
  45045002108, // sterling
  45083020400, // northside
  45083020301, // northside
];

export const match = ((param: string): param is 'northside' | 'sterling' => {
  return validNeighborhoods.includes(param) || validTracts.includes(parseInt(param));
}) satisfies ParamMatcher;
