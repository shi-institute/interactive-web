import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
  try {
    const { html, attributes }: { html: string; attributes: Record<string, unknown> } =
      await import(`./${params.rest}.md`);

    return { html, attributes };
  } catch {
    throw error(404, new Error(`Not found`));
  }
}) satisfies PageLoad;
