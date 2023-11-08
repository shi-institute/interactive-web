export interface CDRZ {
  /** The name/number of the census tract */
  tract: string;
  places: Place[];
  /** The fraction of land in this tract that is urban */
  urban: number;
  /** The fraction of land in this tract that is rural */
  rural: number;
  /** Race and ethnicity data for this tract */
  demographics?: Demographics;
  /** The totals and fractions of housholds: renters vs ownsers */
  ownership?: Ownership;
  /** Median and aggregate income for this tract */
  income?: Income;
  zillow?: Zillow;
}

export interface Place {
  name: string;
  type?: 'city' | 'msa' | 'place';
  coordinates?: {
    longitude: number;
    latitude: number;
  };
}

export interface Demographics {
  race?: Race;
  ethnicity?: {
    hispanicOrLatino: Race;
    notHispanicOrLatino: Race;
  };
}

export interface Race {
  /** total population count */
  total: number;
  /** population counts for indiviudals of a single race  */
  alone: {
    white: number;
    black: number;
    americanIndianOrAlaskaNative: number;
    asian: number;
    pacificIslander: number;
    other: number;
    /** sum of all singular races, including other */
    total: number;
  };
  /** population counts for indiviudals of a single race  */
  twoOrMore: {
    total: number;
  };
}

export interface Ownership {
  total?: {
    renters: number;
    owners: number;
  };
  fraction?: {
    renters: number;
    owners: number;
  };
}

export interface Income {
  median: number;
  aggregate: number;
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
