import { dev } from '$app/environment';
import frontmatter from 'front-matter';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
  const pages = import.meta.glob('./**/*.svx');
  const docsPageData = Object.entries(pages).map(async ([path]) => {
    console.log(path.replace(url.pathname, ''));

    const attributes = await fetch(
      (dev ? '/src/routes' : '') + url.pathname + path.replace('./', '/')
    )
      .then((res) => res.text())
      .then((text) => frontmatter(text))
      .then(({ attributes }) => attributes);

    return {
      attributes,
      pathname: url.pathname + path.slice(1).replace('/+page.svx', ''),
    };
  });

  return { docsPageData: await Promise.all(docsPageData) };
}) satisfies PageLoad;
