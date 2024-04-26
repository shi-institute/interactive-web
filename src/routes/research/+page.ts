import type { PageLoad } from '../$types';

export const load = (({ url }) => {
  const visualizations: VizPageInfo[] = [
    {
      label: 'South Carolina Communnity Disaster Resilience Zones (CDRZs)',
      caption: 'Information sheets for each of the CDRZs in South Carolina.',
      authors: ['Jack Buehner', 'Mike Winiski', 'Zury Marroquin'],
      href: '/cdrz-info-sheet',
      date: new Date('2024-01-01'),
      backgroundHref: '/pexels-eva-bronzini-6420126.jpg',
    },
    {
      label: 'Racial Displacement in Greenville, SC',
      caption:
        'An exploration of historic and current population shifts in the City of Greenville and surrounding Greenville County.',
      authors: ['Ken Kolb', 'Mike Winiski', 'Sam Hayes', 'Catherine Lippert'],
      href: '/gvl-racial-displacement',
      date: new Date('2020-01-08'),
      backgroundHref:
        'https://cdn.arcgis.com/sharing/rest/content/items/ec193fcd3f194bc0a7f8353f69f24aa8/resources/21mYxILLa_jpcjGFUh4Rq.png?w=400',
    },
    {
      label: 'Upstate SC Landcover Projections',
      authors: ['Mike Winiski', 'Jack Buehner', 'Zury Marroquin'],
      href: '/upstate-sc-land',
      date: new Date('2023-01-01'),
      backgroundHref: '/upstate-land-dev.png',
    },
  ];

  return { visualizations, url };
}) satisfies PageLoad;

export interface VizPageInfo {
  label: string;
  caption?: string;
  authors?: string[];
  href: string;
  date?: Date;
  backgroundHref?: string;
}
