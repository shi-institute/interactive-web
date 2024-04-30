import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
  if (dev) throw redirect(307, '/research');
  throw redirect(307, 'https://furman.edu/shi-institute');
}) satisfies PageLoad;
