import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import 'groupby-polyfill/lib/polyfill.js';

export const load = (async () => {
  if (dev) throw redirect(307, '/research');
  throw redirect(307, 'https://furman.edu/shi-institute');
}) satisfies PageLoad;
