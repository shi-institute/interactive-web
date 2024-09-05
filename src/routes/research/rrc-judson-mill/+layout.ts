import type { LayoutLoad } from './$types';
import data from './data.json';

export const load = (async () => {
  const tidyPerecentPopulationByRace = Object.entries(data.percentPopulationByRace).flatMap(
    ([race, decadalData]) => {
      return Object.entries(decadalData).map(([decade, percent]) => {
        return { year: new Date(decade), race, percent };
      });
    }
  );

  const tidyPopulationDensity = Object.entries(data.populationDensity).map(([decade, density]) => {
    return { year: new Date(decade), density };
  });

  return {
    tidyPerecentPopulationByRace,
    tidyPopulationDensity,
  };
}) satisfies LayoutLoad;
