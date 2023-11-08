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
}

export interface Place {
  name: string;
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
