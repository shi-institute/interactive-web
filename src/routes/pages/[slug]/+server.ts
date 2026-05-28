import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const pages = import.meta.glob<string>('../../../lib/pages/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const GET: RequestHandler = async ({ params }) => {
  const slug = params.slug.endsWith('.html') ? params.slug.slice(0, -5) : params.slug;

  const html = pages[`../../../lib/pages/${slug}.html`] ?? null;
  if (!html) {
    error(404);
  }

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};
