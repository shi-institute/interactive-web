<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import PlotContainer from '$lib/PlotContainer.svelte';
  import { colors } from '$lib/colors.js';
  import * as Plot from '@observablehq/plot';
  import type { CleanResponse } from './toCleanData.js';

  export let data;

  $: studentTripModesData = getTripModesData(data.surveyData.filter((d) => d.role === 'student'));
  $: facStaffTripModesData = getTripModesData(data.surveyData.filter((d) => d.role !== 'student'));

  function getTripModesData(data: CleanResponse[]) {
    const tripModesTotals: Record<string, number> = data.reduce((acc, d) => {
      Object.entries(d.commute.trips)
        // the trips object contains the total number of trips for each trip mode,
        // but it also includes the total of all trips, which we don't want to include
        .filter(([mode]) => mode !== 'total')
        // for each trip mode, either add it to the accumulator or increment its count
        .forEach(([mode, count]) => (acc[mode] = (acc[mode] || 0) + count));
      return acc;
    }, {});

    const allTotal = Object.values(tripModesTotals).reduce((acc, count) => acc + count, 0);

    return Object.entries(tripModesTotals).map(([mode, count]) => ({
      mode,
      count,
      percentage: count / allTotal,
    }));
  }

  function getInitiativeCount(
    data: CleanResponse[],
    initiative: keyof CleanResponse['behavior']['continue_initiatives']
  ) {
    const responses = data
      .map((d) => [d.role, d.behavior.continue_initiatives[initiative]])
      .filter((x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1]);
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, response] of responses) {
      counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
      sum++;
    }

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response,
        count,
        percentage: count / sum,
      };
    });
  }

  function getFrequencyCount(
    data: CleanResponse[],
    initiative: keyof CleanResponse['behavior']['frequencies']
  ) {
    const responses = data
      .map((d) => [d.role, d.behavior.frequencies[initiative]])
      .filter((x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1]);
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, response] of responses) {
      counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
      sum++;
    }

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response,
        count,
        percentage: count / sum,
      };
    });
  }

  function getEngagementSources(data: CleanResponse[]) {
    const responses = data
      .map((d) => [d.role, d.outreach.how_hear_about_events] as const)
      .filter(
        (x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1] && Array.isArray(x[1])
      );
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, responseArr] of responses) {
      for (const response of responseArr) {
        counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
        sum++;
      }
    }

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response,
        count,
        percentage: count / sum,
      };
    });
  }

  function getEngagementSocialPlatforms(data: CleanResponse[]) {
    const responses = data
      .map((d) => [d.role, d.outreach.social_media_platforms_used] as const)
      .filter(
        (x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1] && Array.isArray(x[1])
      );
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, responseArr] of responses) {
      for (const response of responseArr) {
        counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
        sum++;
      }
    }

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response,
        count,
        percentage: count / sum,
      };
    });
  }

  function getBehaviorParticipation(data: CleanResponse[]) {
    const responses = data
      .map(
        (d) =>
          [
            d.role,
            d.behavior.students
              ? d.behavior.students.particpated_attended
              : d.behavior.facstaff!.particpated_attended_led,
          ] as const
      )
      .filter(
        (x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1] && Array.isArray(x[1])
      );
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, responseArr] of responses) {
      for (const response of responseArr) {
        counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
        sum++;
      }
    }

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      const responseMap = {
        'CLPs or events': 'CLPs or events',
        'Campus or community events': 'Campus/community events*',
        'Community service projects or volunteer work': 'Volunteer',
        Courses: 'Courses',
        'I have never participated in or attended sustainability-related things through Furman.':
          'Never',
        Internships: 'Internships',
        'Other (please describe):': 'Other',
        'Research projects': 'Research',
        'Workshops or conferences': 'Workshops/conferences*',
      };
      return {
        role,
        response: responseMap[response],
        count,
        percentage: count / sum,
      };
    });
  }

  function getBehaviorShiParticipationReasons(data: CleanResponse[]) {
    const responses = data
      .map((d) => [d.role, d.behavior.why_engaged_shi_institute] as const)
      .filter(
        (x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1] && Array.isArray(x[1])
      );
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, responseArr] of responses) {
      for (const response of responseArr) {
        counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
        sum++;
      }
    }

    const responseMap = {
      'For an interview or meeting': 'Interview/meeting',
      'I have worked at the Shi Institute': 'Employment',
      'Other (please describe):': 'Other',
      'To attend an event': 'Event',
      'To learn more about sustainability': 'Learn sustainability',
      'To visit the Furman Farm': 'Farm visit',
    };

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response: responseMap[response] || response,
        count,
        percentage: count / sum,
      };
    });
  }

  function getBehaviorShiParticipation(data: CleanResponse[]) {
    const responses = data
      .map((d) => [d.role, d.behavior.has_engaged_shi_institute] as const)
      .filter((x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => x[1] !== null);
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, response] of responses) {
      counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
      sum++;
    }

    const tidy = Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response: response === 'true' ? 'Yes' : 'No',
        count,
        percentage: count / sum,
      };
    });

    return tidy.reduce((acc, d) => {
      acc[d.role] = {
        ...acc[d.role],
        [d.response]: d.percentage,
      };
      return acc;
    }, {});
  }

  function getClimateChangeProblemResponse(
    data: CleanResponse[],
    type: 'current_lifetime' | 'future_generations'
  ) {
    const responses = data
      .map((d) => [d.role, d.behavior.climate_change_problem[type]] as const)
      .filter((x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1]);
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, response] of responses) {
      counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
      sum++;
    }

    return Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return {
        role,
        response,
        count,
        percentage: count / sum,
      };
    });
  }

  function getLiteracyReport(data: CleanResponse[]) {
    return [
      getLiteracyResponse(data, 'not_an_SDG', 'Space exploration'),
      getLiteracyResponse(
        data,
        'LCA_def',
        'An assessment of the total environmental impact of a product from the time the raw materials are gathered to their ultimate disposal'
      ),
      getLiteracyResponse(data, 'not_sus', 'Democracy'),
      getLiteracyResponse(data, 'current_human_population', '8.0 billion'),
      getLiteracyResponse(data, 'high_GHG_foods', 'Beef'),
      getLiteracyResponse(data, 'know_EPA', 'Environmental Protection Agency (the EPA)'),
      getLiteracyResponse(data, 'know_ecosystem_services', 'Ecosystem services'),
      getLiteracyResponse(
        data,
        'sus_dev_def',
        'Meeting the needs of the present without compromising the ability of future generations to meet their own needs'
      ),
      getLiteracyResponse(
        data,
        'human_env_impact_factors',
        'The number of people on the planet,The amount of materials used per person,The use of technology'
      ),
      getLiteracyResponse(data, 'know_GHG', 'Greenhouse gases'),
      getLiteracyResponse(data, 'energy_provider', 'Duke Energy'),
      getLiteracyResponse(data, 'furman_carbon_footprint', 'Purchased Electricity'),
      getLiteracyResponse(
        data,
        'can_recyle',
        'Paper,Plastics #1 and #2,Cardboard,Aluminum Cans,Batteries and Electronic Waste'
      ),
      getLiteracyResponse(data, 'solar_farm_bill_reduction', '5 –10 %'),
    ].flat();
  }

  function getLiteracyResponse(
    data: CleanResponse[],
    key: keyof CleanResponse['sustainability_literacy'],
    expected?: string
  ) {
    const responses = data
      .map((d) => [d.role, d.sustainability_literacy[key]] as const)
      .filter((x): x is [(typeof x)[0], NonNullable<(typeof x)[1]>] => !!x[1]);
    const counts: Record<string, number> = {};
    let sum = 0;

    for (const [role, response] of responses) {
      counts[`${role}_${response}`] = (counts[`${role}_${response}`] || 0) + 1;
      sum++;
    }

    const responseCounts = Object.entries(counts).map(([role_response, count]) => {
      const [role, response] = role_response.split('_');
      return [role, response, count] as const;
    });

    const tidy = responseCounts.map(([role, response, count]) => {
      return {
        role,
        question: key,
        response,
        count,
        percentage: count / sum,
        percentageWithRole:
          count /
          responseCounts.filter(([r, resp]) => r === role).reduce((acc, [, , c]) => acc + c, 0),
      };
    });

    if (!expected) return tidy;

    // if expected is defined, return an array of objects similar to tidy,
    // but instead of the response options, only distinguish between
    // correct and incorrect responses
    return tidy.reduce((acc, d) => {
      const isCorrect = d.response === expected;
      if (isCorrect) {
        return [...acc, { ...d, response: 'correct' }];
      }

      const existingIncorrectRecord = acc.find(
        (x) => x.role === d.role && x.response === 'incorrect'
      );
      if (existingIncorrectRecord) {
        // merge the count and percetages of the record in this loop iteration
        // with the existing record for incorrect responses for this role
        // that is already in the accumulator
        existingIncorrectRecord.count += d.count;
        existingIncorrectRecord.percentage += d.percentage;
        existingIncorrectRecord.percentageWithRole += d.percentageWithRole;
      } else {
        // otherwise, add a new record for incorrect responses for this role
        // to the accumulator
        acc.push({ ...d, response: 'incorrect' });
      }
      return acc;
    }, [] as typeof tidy);
  }

  $: shiParticipation = getBehaviorShiParticipation(data.surveyData);

  $: console.table(getLiteracyReport(data.surveyData));
  // $: console.table(
  //   getLiteracyResponse(data.surveyData, 'not_an_SDG').filter((d) => d.role === 'student')
  // );

  function sortByRole(
    a: { role: NonNullable<CleanResponse['role']> },
    b: { role: NonNullable<CleanResponse['role']> }
  ) {
    const roleOrder = { student: 1, staff: 3, faculty: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  }

  const roleLegendSpec = {
    legend: true,
    domain: ['student', 'faculty', 'staff'],
    range: [colors.vibrant.blue, colors.vibrant.magenta, colors.vibrant.orange],
  };

  $: literacyReportGroups = Object.values(
    Object.groupBy(getLiteracyReport(data.surveyData), (item) => item.question)
  );
</script>

<PageTitle>
  Survey results: Sustainability attitudes, behaviors, and knowledge at Furman University
  <svelte:fragment slot="caption">2024</svelte:fragment>
</PageTitle>

<h2>Transportation</h2>
<div class="facets">
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'Transportation modes for students',
        subtitle: 'Furman University 2024',
        marginBottom: 40,
        marginLeft: 120,
        marginTop: 0,
        x: { domain: [0, 1] },
        marks: [Plot.barX(studentTripModesData, { x: 'percentage', y: 'mode', tip: true })],
      }}"
    />
  </div>

  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'Transportation modes for faculty and staff',
        subtitle: 'Furman University 2024',
        marginBottom: 40,
        marginLeft: 120,
        marginTop: 0,
        x: { domain: [0, 1] },
        marks: [Plot.barX(facStaffTripModesData, { x: 'percentage', y: 'mode', tip: true })],
      }}"
    />
  </div>
</div>

<h2>Sustainability engagemenet importance</h2>
<div class="facets">
  {#each ['teach_sus', 'operate_sustainably', 'research_sus', 'implement_strong_CAP'] as initiative}
    <div class="facet">
      <PlotContainer
        fullWidth
        plot="{{
          title: `How important is it for Furman to engage in ${initiative}`,
          color: roleLegendSpec,
          marginBottom: 40,
          marginLeft: 168,
          marginTop: 0,
          marks: [
            Plot.barX(getInitiativeCount(data.surveyData, initiative), {
              x: 'percentage',
              y: 'response',
              fill: 'role',
              sort: sortByRole,
              tip: true,
            }),
          ],
        }}"
      />
    </div>
  {/each}
</div>

<h2>Sustainable habits frequencies</h2>
<div class="facets">
  {#each ['wash_clothes_cold_water', 'unplug_applicances', 'lights_off', 'intentionally_minimize_waste', 'bike_walk', 'repurpose_or_donate', 'recycle', 'choose_sustainable_companies'] as freqCategory}
    <div class="facet">
      <PlotContainer
        fullWidth
        plot="{{
          title: `Frequency: ${freqCategory}`,
          color: roleLegendSpec,
          marginBottom: 40,
          marginLeft: 86,
          marginTop: 0,
          marks: [
            Plot.barX(getFrequencyCount(data.surveyData, freqCategory), {
              x: 'percentage',
              y: 'response',
              fill: 'role',
              sort: sortByRole,
              tip: true,
            }),
          ],
        }}"
      />
    </div>
  {/each}
</div>

<h2>Engagement</h2>
<div class="facets">
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'How students, faculty, and staff hear about sustainability events',
        color: roleLegendSpec,
        marginBottom: 40,
        marginLeft: 286,
        marginTop: 0,
        marks: [
          Plot.barX(getEngagementSources(data.surveyData), {
            x: 'percentage',
            y: 'response',
            fill: 'role',
            sort: sortByRole,
            tip: true,
          }),
        ],
      }}"
    />
  </div>
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'Social media platforms used by students, faculty, and staff',
        color: roleLegendSpec,
        marginBottom: 40,
        marginLeft: 110,
        marginTop: 0,
        marks: [
          Plot.barX(
            getEngagementSocialPlatforms(data.surveyData).map((d) => ({
              ...d,
              response: d.response.replace('(name below)', ''),
            })),
            {
              x: 'percentage',
              y: 'response',
              fill: 'role',
              sort: sortByRole,
              tip: true,
            }
          ),
        ],
      }}"
    />
  </div>
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'Participation in sustainability behaviors',
        caption: '* response only available to faculty and staff',
        color: roleLegendSpec,
        marginBottom: 40,
        marginLeft: 210,
        marginTop: 0,
        marks: [
          Plot.barX(getBehaviorParticipation(data.surveyData), {
            x: 'percentage',
            y: 'response',
            fill: 'role',
            sort: sortByRole,
            tip: true,
          }),
        ],
      }}"
    />
  </div>
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'Reasons for engaging with the Shi Institute',
        caption: `${(shiParticipation.student.Yes * 100).toFixed(0)}% of students, ${(
          shiParticipation.faculty.Yes * 100
        ).toFixed(0)}% of faculty, and ${(shiParticipation.staff.Yes * 100).toFixed(
          0
        )}% of staff have engaged with the Shi Institute.`,
        color: roleLegendSpec,
        marginBottom: 40,
        marginLeft: 180,
        marginTop: 0,
        marks: [
          Plot.barX(getBehaviorShiParticipationReasons(data.surveyData), {
            x: 'percentage',
            y: 'response',
            fill: 'role',
            sort: sortByRole,
            tip: true,
          }),
        ],
      }}"
    />
  </div>
</div>

<h2>Is climate change a problem?</h2>
<div class="facets">
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'In your current lifetime',
        color: roleLegendSpec,
        marginBottom: 40,
        marginLeft: 130,
        marginTop: 0,
        y: { label: '' },
        marks: [
          Plot.barX(getClimateChangeProblemResponse(data.surveyData, 'current_lifetime'), {
            x: 'percentage',
            y: 'response',
            fill: 'role',
            sort: sortByRole,
            tip: true,
          }),
        ],
      }}"
    />
  </div>
  <div class="facet">
    <PlotContainer
      fullWidth
      plot="{{
        title: 'For future generations',
        color: roleLegendSpec,
        marginBottom: 40,
        marginLeft: 130,
        marginTop: 0,
        y: { label: '' },
        marks: [
          Plot.barX(getClimateChangeProblemResponse(data.surveyData, 'future_generations'), {
            x: 'percentage',
            y: 'response',
            fill: 'role',
            sort: sortByRole,
            tip: true,
          }),
        ],
      }}"
    />
  </div>
</div>

<h2>Sustainability literacy</h2>
<div class="facets max1 integratedHead">
  {#each [literacyReportGroups[0], ...literacyReportGroups] as group, index}
    {@const question = group[0].question}
    {@const showTopAxis = index === 0}
    {@const showBottomAxis = index === literacyReportGroups.length}
    {@const useExtraHeight = showBottomAxis}
    {@const extraHeight = 40}
    <div class="facet">
      <PlotContainer
        fullWidth
        plot="{{
          title: index > 0 ? question : '',
          color: { ...roleLegendSpec, legend: showTopAxis },
          marginTop: showTopAxis ? extraHeight : 0,
          marginLeft: 70,
          marginBottom: showBottomAxis ? extraHeight : 0,
          height: useExtraHeight ? 40 + extraHeight : 40,
          x: {
            label: index === 0 ? 'Percentage of respondents' : '',
            labelArrow: index === 0 ? 'right' : 'none',
            domain: [0, 1],
            grid: true,
          },
          y: { label: '' },
          marks: [
            Plot.barX(index > 0 ? group : [], {
              x: 'percentage',
              y: 'response',
              fill: 'role',
              sort: sortByRole,
              tip: true,
            }),
            index === 0 ? Plot.axisX({ anchor: 'top' }) : null,
          ].filter((x) => !!x),
        }}"
      />
    </div>
  {/each}
</div>

<style>
  .facets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    grid-template-rows: auto;
    border: 4px solid #dedede;
    margin: 16px 10px;
    gap: 1px;
    background: #dedede;
  }
  .facets.max1 {
    grid-template-columns: 1fr;
  }
  .facets.integratedHead .facet {
    padding: 6px 16px;
  }
  @media (prefers-color-scheme: dark) {
    .facets {
      border-color: #3d3d3d;
      background: #3d3d3d;
    }
  }

  .facet {
    background: white;
    padding: 16px;
  }
  @media (prefers-color-scheme: dark) {
    .facet {
      background: #212121;
    }
  }

  .facets :global(figure > h2) {
    font-size: 22px;
  }
  .facets.smallHead :global(figure > h2) {
    font-size: 18px;
  }
  .facets.integratedHead :global(figure > h2) {
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    margin-bottom: 6px;
  }

  h2 {
    margin: 44px 16px -12px 16px;
  }
</style>
