import { Job, JobStage } from '@workspace/ui/components/jobs-table/types';

export function getYourJobs() {
  return YOUR_JOBS.map(job => convertJob(job));
}
export function getHomeJobs() {
  return HOME_YOUR_JOBS.map(job => convertJob(job));
}
export function getFeaturedJobs() {
  return FEATURED_JOBS.map(job => convertJob(job));
}

export function convertJob(job: any) {
  return {
    title: job.position_title,
    company: job.company_name,
    jobId: job.job_id,
    lastEdited: new Date(job.saved_date).getTime() || null,
    favorite: false,
    hired: false,
    stage: (job.application_status as JobStage) || null,
    industry: job.industry,
    jobType: job.job_type,
    workplace: job.workplace_type,
    badge: job.badge,
    stages: {
      saved: job.application_status === 'saved',
      applied: job.application_status === 'applied',
      interview: job.application_status === 'interview',
      offer: job.application_status === 'offer',
      hired: job.application_status === 'hired',
      ineligible: job.application_status === 'ineligible'
    }
  } as Job;
}

const YOUR_JOBS = [
  {
    job_id: 'b1c0058d-2aee-492b-af62-ca116f3d1787',
    application_status: 'saved',
    saved_date: Date.now(),
    position_title: 'Senior Campaigner, Private Equity',
    company_name: 'The Sunrise Project',
    industry: 'finance',
    workplace_type: 'hybrid',
    job_type: 'full_time',
    badge: 'featured'
  },
  {
    job_id: 'b4f7be73-ff63-49ea-a9c7-150286ec25b7',
    application_status: 'saved',
    saved_date: '2024-09-14T18:24:26.249277+00:00',
    company_name: 'The Rachel Carson Council',
    position_title: 'Assistant Director, Civic and Campus Engagement',
    industry: 'policy',
    workplace_type: 'onsite',
    job_type: 'full_time'
  },
  {
    job_id: 'd3497e0d-0962-4803-89e8-e494ef3ccb3c',
    application_status: 'saved',
    saved_date: '2024-09-14T18:24:39.809228+00:00',
    company_name: 'Great Lakes Protection Fund',
    position_title: 'Program Associate',
    industry: 'conservation',
    workplace_type: 'remote',
    job_type: 'full_time'
  },
  {
    job_id: 'df55d4bf-bb22-4203-9ec6-760b3d34ddc0',
    application_status: 'interview',
    saved_date: '2024-09-14T18:24:26.249277+00:00',
    company_name: 'Earthjustice',
    position_title: 'Spring 2025 Science Externship – International Program',
    industry: 'forestry',
    workplace_type: 'onsite',
    job_type: 'full_time'
  },
  {
    job_id: 'fbd7c35c-423d-4f4e-8099-cc2ccd2857ca',
    application_status: 'interview',
    saved_date: '2024-09-14T18:24:26.249277+00:00',
    company_name: 'Capital Good Fund',
    position_title: 'Project Manager',
    industry: 'forestry',
    workplace_type: 'onsite',
    job_type: 'full_time'
  }
];

const HOME_YOUR_JOBS = [
  {
    job_id: 'b4f7be73-ff63-49ea-a9c7-150286ec25b7',
    application_status: 'saved',
    saved_date: '2024-09-14T18:24:26.249277+00:00',
    company_name: 'The Rachel Carson Council',
    position_title: 'Assistant Director, Civic and Campus Engagement',
    industry: 'policy',
    workplace_type: 'onsite',
    job_type: 'full_time'
  },
  {
    job_id: 'd3497e0d-0962-4803-89e8-e494ef3ccb3c',
    application_status: 'saved',
    saved_date: '2024-09-14T18:24:39.809228+00:00',
    company_name: 'Great Lakes Protection Fund',
    position_title: 'Program Associate',
    industry: 'conservation',
    workplace_type: 'remote',
    job_type: 'full_time'
  },
  {
    job_id: 'df55d4bf-bb22-4203-9ec6-760b3d34ddc0',
    application_status: 'interview',
    company_name: 'Earthjustice',
    position_title: 'Spring 2025 Science Externship – International Program',
    industry: 'forestry',
    workplace_type: 'onsite',
    job_type: 'full_time'
  },
  {
    job_id: 'fbd7c35c-423d-4f4e-8099-cc2ccd2857ca',
    application_status: 'interview',
    saved_date: '2024-09-14T18:24:26.249277+00:00',
    company_name: 'Capital Good Fund',
    position_title: 'Project Manager',
    industry: 'forestry',
    workplace_type: 'onsite',
    job_type: 'full_time'
  }
];

const FEATURED_JOBS = [
  {
    job_id: 'b1c0058d-2aee-492b-af62-ca116sdfg787',
    position_title: 'Senior Campaigner, Private Equity',
    company_name: 'The Sunrise Project',
    industry: 'finance',
    workplace_type: 'hybrid',
    job_type: 'full_time',
    badge: 'featured'
  },
  {
    job_id: 'b4f7be73-ff63-49ea-a9c7-150sdgsc25b7',
    position_title: 'Conservation Crew Corpsmember',
    company_name: 'Treehouse',
    industry: 'forestry',
    workplace_type: 'onsite',
    badge: 'featured',
    job_type: 'full_time'
  },
  {
    job_id: 'd3497e0d-0962-4803-89e8-e4erwe3ccb3c',
    position_title: 'Senior Manager, Energy',
    company_name: 'Program Associate',
    industry: 'energy',
    workplace_type: 'remote',
    badge: 'featured',
    job_type: 'full_time'
  },
  {
    job_id: 'df55d4bf-bb22-4203-9ec6-760b3dtwerc0',
    company_name: 'Seattle Aquarium',
    position_title: 'Environmental Program Manager',
    industry: 'water',
    workplace_type: 'onsite',
    job_type: 'full_time',
    badge: 'featured'
  },
  {
    job_id: 'fbd7c35c-423d-4f4e-8099-cc2ccqwetr7ca',
    company_name: 'Grist',
    position_title: 'Vice President for Finance and Impact Investing',
    industry: 'finance',
    workplace_type: 'onsite',
    badge: 'featured',
    job_type: 'full_time'
  },
  {
    job_id: '34a85525-d2f8-4e1a-b918-e64b325233100d',
    company_name: 'BeGreen.org',
    position_title: 'Jr. Graphic Designer',
    industry: 'technology',
    workplace_type: 'onsite',
    badge: 'featured',
    job_type: 'full_time'
  },
  {
    job_id: 'df5fsdbf-bb22-4203-9ec6-760b3dtwerc0',
    company_name: 'Creatives for Climate',
    position_title: 'Jr. Software Developer',
    industry: 'waste-management',
    workplace_type: 'remote',
    job_type: 'full_time',
    badge: 'featured'
  },
  {
    job_id: '34a85sdf-d2f8-4e1a-b918-e64b325233100d',
    company_name: "We Don't Have Time",
    position_title: 'Jr. Policy Analyst',
    industry: 'policy',
    workplace_type: 'onsite',
    badge: 'featured',
    job_type: 'full_time'
  },
  {
    job_id: 'fbd7c35c-423d-4ffsdde-8099-cc2ccqwetr7ca',
    company_name: 'Hip-Hop Caucus',
    position_title: 'Development Associate',
    industry: 'real-estate',
    workplace_type: 'onsite',
    badge: 'featured',
    job_type: 'full_time'
  }
];
