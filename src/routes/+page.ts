import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
  throw redirect(307, 'https://furman.edu/shi-institute');
}) satisfies PageLoad;
