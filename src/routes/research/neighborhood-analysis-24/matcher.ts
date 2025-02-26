const validNeighborhoods = ['northside', 'sterling'];
const validTracts = [
  45045000500, // sterling
  45045002105, // sterling
  45045002108, // sterling
  45083020400, // northside
  45083020301, // northside
];

export function validatePublic(
  param: unknown
): param is keyof typeof validNeighborhoods | keyof typeof validTracts {
  if (typeof param !== 'string') return false;

  return validNeighborhoods.includes(param) || validTracts.includes(parseInt(param));
}

export const validTractOrNeighborhood = [...validNeighborhoods, ...validTracts];
