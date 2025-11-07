import { geojsonSchema } from '$utils';
import type { FeatureCollection } from 'geojson';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const gvlVoteMargins = fetch('/filestore/gvl-vote-2022/gvlVoteMargins.json')
    .then((res) => res.json())
    .then((data) => geojsonSchema.parse(data) as FeatureCollection);

  const states = fetch('/filestore/gvl-vote-2022/states.json')
    .then((res) => res.json())
    .then((data) => geojsonSchema.parse(data) as FeatureCollection);

  return {
    gvlVoteMargins: await gvlVoteMargins,
    states: await states,
  };
}) satisfies PageLoad;
