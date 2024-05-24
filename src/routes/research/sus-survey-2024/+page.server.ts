import { PRIVATE_DATA_REPO_ACCESS_TOKEN } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { toCleanData } from './toCleanData';

import 'groupby-polyfill/lib/polyfill.js';

export const load = (async ({ fetch, parent, url }) => {
  const { session } = await parent();

  if (session.authenticated !== true) {
    throw redirect(302, `/basic-login?from=${encodeURIComponent(url.href)}`);
  }

  const surveyData = fetch(
    'https://api.github.com/repos/shi-institute/interactive-web-private-data/contents/sus-survey-2024.json',
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: `token ${PRIVATE_DATA_REPO_ACCESS_TOKEN}`,
      },
    }
  ).then((res) => res.json() as Promise<Record<string, unknown>[]>);

  return { surveyData: (await surveyData).slice(1).map(toCleanData) };
}) satisfies PageServerLoad;
