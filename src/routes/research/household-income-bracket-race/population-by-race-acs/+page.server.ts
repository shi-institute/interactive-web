import type { PageServerLoad } from './$types';
import est1 from './est1.json';
import est5 from './est5.json';
import cv from './tidyVarianceCoefficientsData.json';

export const load = (async () => {
  return {
    est1: est1.map((d) => ({ ...d, year: new Date(d.year) })),
    est5: est5.map((d) => ({ ...d, year: new Date(d.year) })),
    cv: cv.map((d) => ({ ...d, year: new Date(d.year) })),
  };
}) satisfies PageServerLoad;
