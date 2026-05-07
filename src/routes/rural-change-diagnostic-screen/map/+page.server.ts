import type { PageServerLoad } from './$types';

export const ssr = false;
export const prerender = false;

type MigrationAndServiceWorkerData =
  typeof import('../../../../static/data/rural-change-diagnostic-screen/migration_and_service_data.json');

export const load = (async ({ fetch }) => {
  const migrationAndServiceWorkerData = (await fetch(
    '/data/rural-change-diagnostic-screen/migration_and_service_data.json'
  ).then((response) => response.json())) as MigrationAndServiceWorkerData;

  return {
    migrationAndServiceWorkerData,
  };
}) satisfies PageServerLoad;
