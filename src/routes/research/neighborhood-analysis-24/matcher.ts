const validNeighborhoods = ['northside', 'sterling'];
const validTracts = [
  45045000500, // sterling
  45045002105, // sterling
  45045002108, // sterling
  45083020400, // northside
  45083020301, // northside
];

const overrides: Record<string, string[]> = {
  'decennial‾‾population__RACE_ETHNICITY_BREAKDOWN': ['west end', 'gandy-allmon'],
};

export function validatePublic(
  param: unknown,
  plotId?: string
): param is keyof typeof validNeighborhoods | keyof typeof validTracts {
  if (typeof param !== 'string') return false;

  const isValidNeighborhood = validNeighborhoods.includes(param);
  if (isValidNeighborhood) return true;

  const isValidTract = validTracts.includes(parseInt(param));
  if (isValidTract) return true;

  if (!plotId) return false;
  const isForcedPublic = (plotId && overrides[plotId]?.includes(param)) || false;
  return isForcedPublic;
}

export const validTractOrNeighborhood = [...validNeighborhoods, ...validTracts];
