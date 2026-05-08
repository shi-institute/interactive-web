import type { FeatureCollection } from 'geojson';
import { base } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const gvlVoteMargins2022 = await fetch(`${base}/data/gvl-vote-2022/gvlVoteMargins.json`).then(
    (response) => response.json() as Promise<FeatureCollection>
  );

  const states = await fetch(`${base}/data/gvl-vote-2022/states.json`).then(
    (response) => response.json() as Promise<FeatureCollection>
  );

  return {
    gvlVoteMargins2022,
    states,
  };
}) satisfies PageServerLoad;
