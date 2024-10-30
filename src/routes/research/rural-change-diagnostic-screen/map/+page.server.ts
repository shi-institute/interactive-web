import type { PageServerLoad } from './$types';
import migrationAndServiceWorkerData from './migration_and_service_data.json';

export const ssr = false;
export const prerender = false;

export const load = (async () => {
  return {
    migrationAndServiceWorkerData,
  };
}) satisfies PageServerLoad;
