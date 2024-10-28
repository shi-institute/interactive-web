import { hasKey } from '$utils';
import { notEmpty } from '$utils/notEmpty';
import type { LayoutLoad } from './$types';

export const load = (async ({ url }) => {
  const pages = import.meta.glob('./**/*.svx', { eager: true });
  const docsPageData = (
    await Promise.all(
      Object.entries(pages).map(async ([path, value]) => {
        const pathname = '/research/rural-change-diagnostic-screen/guide';

        if (
          !value ||
          typeof value !== 'object' ||
          !hasKey(value, 'metadata') ||
          !value.metadata ||
          typeof value.metadata !== 'object'
        ) {
          return null;
        }

        if (hasKey(value.metadata, 'hidden') && value.metadata.hidden === true) {
          return null;
        }

        return {
          attributes: value.metadata,
          pathname: pathname + path.slice(1).replace('/+page.svx', ''),
        };
      })
    )
  ).filter(notEmpty);

  return { docsPageData, currentPage: docsPageData.find((page) => page.pathname === url.pathname) };
}) satisfies LayoutLoad;
