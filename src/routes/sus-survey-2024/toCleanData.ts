export function toCleanData(row: Record<string, string>): CleanResponse {
  return {
    role: (() => {
      if (row.Q1 === 'Student') return 'student';
      if (row.Q1 === 'Staff Member') return 'staff';
      if (row.Q1 === 'Faculty Member') return 'faculty';
      return null;
    })(),
    commute: {
      distance: (() => {
        const distance = parseFloat(`${row.Q64 || row.Q44}`);
        return Math.round(distance * 2) / 2;
      })(),
      trips: {
        total: parseInt(`${row.Q65 || row.Q9 || 0}`),
        walk: parseInt(`${row.Q66_1 || row.Q10_1 || 0}`),
        bike: parseInt(`${row.Q66_2 || row.Q10_2 || 0}`),
        drive_alone: parseInt(`${row.Q66_3 || row.Q10_3 || 0}`),
        carpool: parseInt(`${row.Q66_4 || row.Q10_4 || 0}`),
        shuttle: parseInt(`${row.Q10_5 || 0}`),
        bus: parseInt(`${row.Q66_5 || row.Q10_6 || 0}`),
        motorcycle: parseInt(`${row.Q66_6 || row.Q10_7 || 0}`),
        other: parseInt(`${row.Q66_7 || row.Q10_8 || 0}`),
      },
      student_housing: (row.Q11 as CleanResponse['commute']['student_housing']) || null,
    },
    sustainability_literacy: {
      not_an_SDG: row.Q86
        ? (row.Q86.trim() as CleanResponse['sustainability_literacy']['not_an_SDG'])
        : null,
      LCA_def: row.Q39
        ? (row.Q39.trim() as CleanResponse['sustainability_literacy']['LCA_def'])
        : null,
      not_sus: row.Q27
        ? (row.Q27.trim() as CleanResponse['sustainability_literacy']['not_sus'])
        : null,
      current_human_population: row.Q25
        ? (row.Q25.trim() as CleanResponse['sustainability_literacy']['current_human_population'])
        : null,
      high_GHG_foods: row.Q85
        ? (row.Q85.trim() as CleanResponse['sustainability_literacy']['high_GHG_foods'])
        : null,
      know_EPA: row.Q28
        ? (row.Q28.trim() as CleanResponse['sustainability_literacy']['know_EPA'])
        : null,
      know_ecosystem_services: row.Q29
        ? (row.Q29.trim() as CleanResponse['sustainability_literacy']['know_ecosystem_services'])
        : null,
      sus_dev_def: row.Q77
        ? (row.Q77.trim() as CleanResponse['sustainability_literacy']['sus_dev_def'])
        : null,
      human_env_impact_factors: row.Q41.split(',')
        .map(
          (factor) =>
            factor.trim() as CleanResponse['sustainability_literacy']['human_env_impact_factors'][number]
        )
        .filter((x) => !!x),
      know_GHG: row.Q40
        ? (row.Q40.trim() as CleanResponse['sustainability_literacy']['know_GHG'])
        : null,
      energy_provider: row.Q38
        ? (row.Q38.trim() as CleanResponse['sustainability_literacy']['energy_provider'])
        : null,
      furman_carbon_footprint: row.Q42
        ? (row.Q42.trim() as CleanResponse['sustainability_literacy']['furman_carbon_footprint'])
        : null,
      can_recyle: row.Q35.split(',')
        .map(
          (recyclable) =>
            recyclable.trim() as CleanResponse['sustainability_literacy']['can_recyle'][number]
        )
        .filter((x) => !!x),
      solar_farm_bill_reduction: row.Q34
        ? (row.Q34.trim() as CleanResponse['sustainability_literacy']['solar_farm_bill_reduction'])
        : null,
    },
    behavior: {
      ...(row.Q1 === 'Student'
        ? {
            students: {
              particpated_attended: row.Q69.split(',')
                .map(
                  (activity) =>
                    activity.trim() as NonNullable<
                      CleanResponse['behavior']['students']
                    >['particpated_attended'][number]
                )
                .filter((x) => !!x),
              interested: row.Q70.split(',')
                .map(
                  (activity) =>
                    activity.trim() as NonNullable<
                      CleanResponse['behavior']['students']
                    >['interested'][number]
                )
                .filter((x) => !!x),
            },
          }
        : {
            facstaff: {
              particpated_attended_led: row.Q71.split(',')
                .map(
                  (activity) =>
                    activity.trim() as NonNullable<
                      CleanResponse['behavior']['facstaff']
                    >['particpated_attended_led'][number]
                )
                .filter((x) => !!x),
              interested: row.Q72.split(',')
                .map(
                  (activity) =>
                    activity.trim() as NonNullable<
                      CleanResponse['behavior']['facstaff']
                    >['interested'][number]
                )
                .filter((x) => !!x),
            },
          }),
      statements: {
        sus_important_to_life: row.Q13_1 ? (row.Q13_1.trim() as StatementResponse) : null,
        sus_career_integration_interest: row.Q13_2 ? (row.Q13_2.trim() as StatementResponse) : null,
        Furman_sus_commitment: row.Q13_3 ? (row.Q13_3.trim() as StatementResponse) : null,
        Furman_sus_commitment_attractive: row.Q13_4
          ? (row.Q13_4.trim() as StatementResponse)
          : null,
      },
      climate_change_problem: {
        current_lifetime: row.Q79 ? (row.Q79.trim() as ProblemResponse) : null,
        future_generations: row.Q80 ? (row.Q80.trim() as ProblemResponse) : null,
      },
      frequencies: {
        wash_clothes_cold_water: row.Q73_1 ? (row.Q73_1.trim() as FrequencyResponse) : null,
        unplug_applicances: row.Q73_2 ? (row.Q73_2.trim() as FrequencyResponse) : null,
        lights_off: row.Q73_3 ? (row.Q73_3.trim() as FrequencyResponse) : null,
        intentionally_minimize_waste: row.Q73_4 ? (row.Q73_4.trim() as FrequencyResponse) : null,
        bike_walk: row.Q73_5 ? (row.Q73_5.trim() as FrequencyResponse) : null,
        repurpose_or_donate: row.Q73_6 ? (row.Q73_6.trim() as FrequencyResponse) : null,
        recycle: row.Q73_7 ? (row.Q73_7.trim() as FrequencyResponse) : null,
        choose_sustainable_companies: row.Q73_8 ? (row.Q73_8.trim() as FrequencyResponse) : null,
      },
      continue_initiatives: {
        teach_sus: row.Q75_1 ? (row.Q75_1.trim() as ContinuationImportanceResponse) : null,
        operate_sustainably: row.Q75_2
          ? (row.Q75_2.trim() as ContinuationImportanceResponse)
          : null,
        research_sus: row.Q75_3 ? (row.Q75_3.trim() as ContinuationImportanceResponse) : null,
        implement_strong_CAP: row.Q75_4
          ? (row.Q75_4.trim() as ContinuationImportanceResponse)
          : null,
      },
      has_engaged_shi_institute: row.Q76 === 'Yes' ? true : row.Q76 === 'No' ? false : null,
      why_engaged_shi_institute: row.Q77_.split(',')
        .map(
          (reason) =>
            reason.trim() as CleanResponse['behavior']['why_engaged_shi_institute'][number]
        )
        .filter((x) => !!x),
    },
    outreach: {
      how_hear_about_events: row.Q18.split(',')
        .map(
          (method) => method.trim() as CleanResponse['outreach']['how_hear_about_events'][number]
        )
        .filter((x) => !!x),
      social_media_platforms_used: row.Q70_.split(',')
        .map(
          (platform) =>
            platform.trim() as CleanResponse['outreach']['social_media_platforms_used'][number]
        )
        .filter((x) => !!x),
    },
  } satisfies CleanResponse;
}

export interface CleanResponse {
  role: 'student' | 'staff' | 'faculty' | null;
  commute: {
    /**
     * A commute distance rounded to the nearest half-mile.
     */
    distance: number;
    /**
     * The trip methods and counts for communiting days in a work week (M-F)
     */
    trips: {
      total: number;
      walk: number;
      bike: number;
      drive_alone: number;
      carpool: number;
      bus: number;
      shuttle: number;
      motorcycle: number;
      other: number;
    };
    /**
     * If a student answered: where the live on campus.
     */
    student_housing:
      | 'South Housing'
      | 'Lakeside Housing'
      | 'North Village'
      | 'Other off-campus location'
      | 'The Greenbelt'
      | null;
  };
  sustainability_literacy: {
    /**
     * [Q86] Which of the following is NOT one of the United Nation's 17 Sustainable Development Goals?
     */
    not_an_SDG:
      | 'Space exploration'
      | 'Gender equality'
      | 'No poverty'
      | 'Climate action'
      | 'Quality education'
      | null;
    /**
     * [Q39] Life cycle analysis is:
     */
    LCA_def:
      | 'An assessment of the total environmental impact of a product from the time the raw materials are gathered to their ultimate disposal'
      | 'The amount of environmental impact that the average person creates within their lifetime'
      | 'A measure of the resources needed to sustain a person’s lifestyle'
      | 'A comparative analysis of an individual’s carbon footprint based on one’s quality of life'
      | null;
    /**
     * [Q27] Which one of the following is NOT typically considered one of the three components of sustainability?
     */
    not_sus: 'Democracy' | 'Society' | 'Environment' | 'Economy' | null;
    /**
     * [Q25] The Earth’s current population is estimated at:
     */
    current_human_population:
      | '3.4 billion'
      | '5.2 billion'
      | '9.6 billion'
      | '8.0 billion'
      | '12.1 billion'
      | null;
    /**
     * [Q85]: Which of the following foods is associated with the highest greenhouse gas footprint?
     */
    high_GHG_foods: 'Beef' | 'Chicken' | 'Fish' | 'Pork' | null;
    /**
     * [Q28] What is the name of the primary federal agency that oversees environmental regulation in the United States?
     */
    know_EPA:
      | 'Environmental Protection Agency (the EPA)'
      | 'Department of Health, Environment, and Safety (the DHES)'
      | 'Federal Pollution Control Agency (the FPCA)'
      | 'National Natural Conservation Agency (the NNCA)'
      | null;
    /**
     * [Q29] The term for the benefits that nature provides such as clean water, clean air, productive soils, and pollination of plants is:
     */
    know_ecosystem_services:
      | 'Ecosystem services'
      | 'Resilience'
      | 'Environmental Economics'
      | 'Environmental Conservation'
      | 'Ecological Footprint'
      | null;
    /**
     * [Q77] Which of the following is the most commonly used definition of sustainable development?
     */
    sus_dev_def:
      | 'Meeting the needs of the present without compromising the ability of future generations to meet their own needs'
      | 'Creating a government welfare system that ensures universal access to education, healthcare, and social services'
      | 'Setting aside resources for preservation, never to be used'
      | 'Building a neighborhood that is socio-demographically and economically diverse'
      | null;
    /**
     * [Q41] What are believed to be the key factors that influence human impact on the Earth? (choose all that apply)
     */
    human_env_impact_factors: (
      | 'The number of people on the planet'
      | 'The use of technology'
      | 'The amount of materials used per person'
      | 'The enforcement of governmental regulations'
      | null
    )[];
    /**
     * [Q40] Certain substances in the atmosphere, such as water vapor, carbon dioxide, methane, and nitrous oxide, influence the Earth’s temperature and climate. These substances are commonly referred to as:
     */
    know_GHG:
      | 'Greenhouse gases'
      | 'Radiation'
      | 'Solar gases'
      | 'Ozone'
      | 'Ultraviolet Light'
      | null;
    /**
     * [Q38] Who is Furman’s primary energy provider?
     */
    energy_provider:
      | 'Duke Energy'
      | 'We generate the majority of our energy on campus'
      | 'South Carolina Electric and Gas'
      | 'Santee Cooper'
      | null;
    /**
     * [Q42] The largest source of Furman's carbon footprint is:
     */
    furman_carbon_footprint:
      | 'Purchased Electricity'
      | 'Natural Gas for Heating'
      | 'Faculty, Staff, and Student Commuting'
      | 'Campus Paper Use'
      | 'Study Abroad Travel'
      | null;
    /**
     * [Q35] Which of the following currently CAN be recycled on campus? (choose all that apply)
     */
    can_recyle: (
      | 'Paper'
      | 'Glass'
      | 'Plastics #1 and #2'
      | 'Plastics #3 – #7'
      | 'Cardboard'
      | 'Aluminum Cans'
      | 'Batteries and Electronic Waste'
      | null
    )[];
    /**
     * [Q34] The 743 kilowatt solar installation across from the main gate, called the “Solar Farm,” reduces Furman’s electricity bill by about ______, on average.
     */
    solar_farm_bill_reduction: '5 –10 %' | '15 – 20%' | '25 – 30%' | '45 – 50%' | '0%' | null;
  };
  behavior: {
    facstaff?: {
      /**
       * [Q71] Through Furman, I have participated in, attended, or led sustainability-related: (choose all that apply)
       */
      particpated_attended_led: (
        | 'Research projects'
        | 'Courses'
        | 'Community service projects or volunteer work'
        | 'Workshops or conferences'
        | 'CLPs or events'
        | 'Campus or community events'
        | 'Other (please describe):'
        | 'I have never participated in or attended sustainability-related things through Furman.'
      )[];
      /**
       * [Q72] I am interested in pursuing or participating in sustainability-related: (choose all that apply)
       */
      interested: (
        | 'Research projects'
        | 'Courses'
        | 'Community service projects or volunteer work'
        | 'Workshops or conferences'
        | 'CLPs or events'
        | 'Campus or community events'
        | 'Other (please describe):'
        | 'I am not interested in pursuing sustainability-related activities through Furman.'
      )[];
    };
    students?: {
      /**
       * [Q69] Through Furman, I have attended or participated in sustainability-related: (choose all that apply) - Selected Choice
       */
      particpated_attended: (
        | 'Internships'
        | 'Research projects'
        | 'Community service projects or volunteer work'
        | 'Courses'
        | 'CLPs or events'
        | 'Other (please describe):'
        | 'I have never participated in or attended sustainability-related things through Furman.'
      )[];
      /**
       * [Q70] I am interested in pursuing or participating in sustainability-related: (choose all that apply)
       */
      interested: (
        | 'Internships'
        | 'Research projects'
        | 'Community service projects or volunteer work'
        | 'Courses'
        | 'CLPs or events'
        | 'Other (please describe):'
        | 'I am not interested in pursuing sustainability-related activities at Furman.'
      )[];
    };
    statements: {
      /**
       * [Q13_1] Sustainability is important to how I live my life
       */
      sus_important_to_life: StatementResponse;
      /**
       * [Q13_2] I am interested in integrating sustainability into my current or future professional career
       */
      sus_career_integration_interest: StatementResponse;
      /**
       * [Q13_3] Furman is committed to sustainability efforts
       */
      Furman_sus_commitment: StatementResponse;
      /**
       * [Q13_4] Furman's sustainability commitment positively influenced my decision to work or enroll here
       */
      Furman_sus_commitment_attractive: StatementResponse;
    };
    climate_change_problem: {
      /**
       * [Q79] Climate change refers to a long-term increase in the Earth's average temperature, attributed largely to increased levels of atmospheric carbon dioxide.  How much of a problem do you think climate change will be in your lifetime?
       */
      current_lifetime: ProblemResponse;
      /**
       * [Q80] How much of a problem do you think climate change will be for future generations?
       */
      future_generations: ProblemResponse;
    };
    /**
     * [Q73] Please indicate the frequency with which you do the following things
     */
    frequencies: {
      wash_clothes_cold_water: FrequencyResponse;
      unplug_applicances: FrequencyResponse;
      lights_off: FrequencyResponse;
      intentionally_minimize_waste: FrequencyResponse;
      bike_walk: FrequencyResponse;
      repurpose_or_donate: FrequencyResponse;
      recycle: FrequencyResponse;
      choose_sustainable_companies: FrequencyResponse;
    };
    /**
     * [Q75] In your opinion, how important is it that Furman continue to engage in the following initiatives
     */
    continue_initiatives: {
      teach_sus: ContinuationImportanceResponse;
      operate_sustainably: ContinuationImportanceResponse;
      research_sus: ContinuationImportanceResponse;
      implement_strong_CAP: ContinuationImportanceResponse;
    };
    /**
     * [Q76] Have you ever visited or engaged with the Shi Institute for Sustainable Communities?
     */
    has_engaged_shi_institute: boolean | null;
    /**
     * [Q77_] Why did you visit or engage with the Shi Institute? (choose all that apply)
     */
    why_engaged_shi_institute: (
      | 'Class visit'
      | 'For an interview or meeting'
      | 'To attend an event'
      | 'To learn more about sustainability'
      | 'I have worked at the Shi Institute'
      | 'To visit the Furman Farm'
      | 'Other (please describe):'
    )[];
  };
  outreach: {
    /**
     * [Q18] How do you typically hear about Furman activities and events?
     */
    how_hear_about_events: (
      | 'E-mail lists or digital newsletters'
      | 'Word of mouth'
      | 'From an RA or FRAD'
      | 'Flyers/posters'
      | 'In-class announcements'
      | 'Greek-life chapter meetings/events'
      | 'Social Media'
      | 'Other'
    )[];
    /**
     * [Q70_] Which social media platforms do you use most frequently?
     */
    social_media_platforms_used: (
      | 'Facebook'
      | 'Instagram'
      | 'TikTok'
      | 'LinkedIn'
      | 'Other (name below)'
    )[];
  };
}

type StatementResponse =
  | 'Strongly Agree'
  | 'Agree'
  | 'Disagree'
  | 'Neutral'
  | 'Strongly Disagree'
  | null;
type ProblemResponse =
  | 'Minor problem'
  | 'Major problem'
  | 'I’m not sure'
  | 'No problem at all'
  | null;
type FrequencyResponse = 'Always' | 'Rarely' | 'Often' | 'Never' | null;
type ContinuationImportanceResponse =
  | 'Very important'
  | 'Somewhat important'
  | 'Not important'
  | null;
