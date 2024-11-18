import {
  RURAL_CHANGE_DIAGNOSTIC_SCREEN_ARCGIS_PASSWORD,
  RURAL_CHANGE_DIAGNOSTIC_SCREEN_ARCGIS_USERNAME,
} from '$env/static/private';
import { generateTokenSafe } from '$utils/generateToken';
import { error } from '@sveltejs/kit';
import { _ensureAuthentication } from '../authenticate/+page.server';
import type { LayoutServerLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load = (async ({ parent, url }) => {
  const { session } = await parent();

  _ensureAuthentication({
    session,
    url,
    scope: 'application__rural_change_diagnostic_screen',
    appName: 'Rural change diagnostic screening tool',
  });

  const result = await generateTokenSafe(
    RURAL_CHANGE_DIAGNOSTIC_SCREEN_ARCGIS_USERNAME,
    RURAL_CHANGE_DIAGNOSTIC_SCREEN_ARCGIS_PASSWORD,
    url.origin
  );

  // wait 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (!result.success) {
    throw error(500, result.error.message);
  }

  return {
    token: result.data.token,
  };
}) satisfies LayoutServerLoad;
