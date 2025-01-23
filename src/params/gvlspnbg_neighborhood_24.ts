import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is 'northside-24' | 'sterling-24' => {
  return param === 'northside-24' || param === 'sterling-24';
}) satisfies ParamMatcher;
