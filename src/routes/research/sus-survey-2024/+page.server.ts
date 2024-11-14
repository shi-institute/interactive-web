import { PRIVATE_DATA_REPO_ACCESS_TOKEN } from '$env/static/private';
import { _ensureAuthentication } from '../authenticate/+page.server';
import type { PageServerLoad } from './$types';
import { toCleanData } from './toCleanData';

export const load = (async ({ fetch, parent, url }) => {
  const { session } = await parent();

  if (session.authScopes.susSurvey2024 !== true) {
    _ensureAuthentication({
      session,
      url,
      scope: 'sus_survey_2024',
      appName: '2024 Sustainability Survey Results',
    });
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
