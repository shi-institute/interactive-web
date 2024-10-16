import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
  const pages = import.meta.glob('./**/*.md');
  const docsPageData = Object.entries(pages).map(async ([path]) => {
    const { html, attributes }: { html: string; attributes: Record<string, unknown> } =
      await import(`./${path}`.replace('./', ''));

    return {
      html,
      attributes,
      pathname: path.slice(1).replace('.md', '').replace('/[...rest]', url.pathname),
    };
  });

  return { docsPageData: await Promise.all(docsPageData) };
}) satisfies PageLoad;
