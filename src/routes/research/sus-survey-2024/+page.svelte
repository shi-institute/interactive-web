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

  $: shiParticipation = getBehaviorShiParticipation(data.surveyData);

  $: console.log(getClimateChangeProblemResponse(data.surveyData, 'future_generations'));

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

  h2 {
    margin: 44px 16px -12px 16px;
  }
</style>
