export interface CDRZ {
  /** The name/number of the census tract */
  tract: string;
  places: Place[];
  urban: UrbanRural;
  rural: UrbanRural;
  population: Population;
  /** Race and ethnicity data for this tract */
  race: Race;
  ethnicity: Ethnicity;
  /** The totals and fractions of housholds: renters vs ownsers */
  tenure: Tenure;
  /** Median and aggregate income for this tract */
  income: Income[];
  zillow?: Zillow;
  risks?: Risks;
  elections: Election[];
}

export interface Place {
  name: string;
  type?: 'city' | 'msa' | 'place' | 'watershed';
  coordinates?: {
    longitude: number;
    latitude: number;
  };
}

export interface Race {
  /** total population count */
  total: number;
  white: Ethnicity;
  black: Ethnicity;
  americanIndianOrAlaskaNative: Ethnicity;
  asian: Ethnicity;
  pacificIslander: Ethnicity;
  other: Ethnicity;
  twoOrMore: Ethnicity;
}

export interface Ethnicity {
  total: number;
  hispanicOrLatino: number;
  notHispanicOrLatino: number;
}

export interface Tenure {
  renter: { total: number; fraction: number };
  owner: { total: number; fraction: number };
  totalHouseholds: number;
}

export interface Income {
  dataYears: { start: number; end: number };
  dollarYear: number;
  median: {
    value: number;
    marginOfError: number;
  };
  // aggregate: {
  //   value: number,
  //   marginOfError: number;
  // }
}

export interface Zillow {
  /** total population for the census tract  */
  totalPopulation: number;
  /** The zip code that contains the centroid for the census tract. Some zip codes contain several CDZRs. */
  zipCode: number;
  zhvi: ZillowHomeValueIndex[];
}

type ISODate = string;

export interface ZillowHomeValueIndex {
  reportedAt: ISODate;
  /** the ZHVI for the state in which the CDZR resides */
  state: number;
  /** the ZHVI for the county in which the CDZR resides */
  county: number;
  /** the ZHVI for the zip code in which the CDZR resides */
  zip: number;
  /** the ZHVI for the MSA (Metropolitan Statistical Area) in which the CDZR resides */
  msa: number;
  /** the ZHVI for the city in which the CDZR resides */
  city: number;
  /**
   * Monthly percent rate of increase.
   *
   * Rate of increase was calculated by fitting a line of best fit (linear)
   * to monthly zhvi that was graphed from 1/31/2010 - 9/30/2023. The equation
   * for the line of best fit was used to calculate the zhvi for 1/31/10 and
   * 9/30/23 and the percent difference was calculated for those values
   */
  increaseRates: {
    startedAt: ISODate;
    endedAt: ISODate;
    state: number;
    county: number;
    zip: number;
  };
}

export interface Risks {
  compositeNRI: Risk;
  compositeExpectedAnnualLoss: Risk;
  socialVulnerability: Risk;
  communityResilience: Risk;
  natural: Record<NaturalRisk, Risk>;
}

export interface Risk {
  rating: string;
  score: number | string | null;
}

type NaturalRisk =
  | 'Avalanche'
  | 'Coastal Flooding'
  | 'Cold Wave'
  | 'Drought'
  | 'Earthquake'
  | 'Hail'
  | 'Heat Wave'
  | 'Hurricane'
  | 'Ice Storm'
  | 'Landslide'
  | 'Lightning'
  | 'Riverine Flooding'
  | 'Strong Wind'
  | 'Tornado'
  | 'Tsunami'
  | 'Volcanic Activity'
  | 'Wildfire'
  | 'Winter Weather';

export interface UrbanRural {
  /** the number of people */
  total: number;
  /** the fraction of the population */
  fraction: number;
}

export interface Population {
  total: number;
  /**
   * the area of the census tract in square miles
   *
   * *calculated in ArcGIS Pro*
   */
  personsPerSquareMileDensity: number;
}

export interface Election {
  /** precinct name */
  precinct: string;
  /**  date of the election */
  date: ISODate;
  /** election name (optional) */
  name?: string;
  turnout: {
    precinct: ElectionTurnout;
    state: Omit<ElectionTurnout, 'democratic' | 'republican'>;
    county: ElectionTurnout;
  };
}

export interface ElectionTurnout {
  /** percentage of registered voters who voted in the election */
  all: number;
  /** percentage of people who voted straight party democratic
   * (of those who voted straight party ticket) */
  democratic: number;
  /** percentage of people who voted straight party republican
   * (of those who voted straight party ticket) */
  republican: number;
  /** percentage of voters in who voted for the Democratic presidential ticket */
  democraticPresident: number;
  /** percentage of voters in who voted for the Republican presidential ticket */
  republicanPresident: number;
}
