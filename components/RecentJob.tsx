
import { } from "react";
import { gql, useQuery } from "@apollo/client"
import { Skeleton } from '@mui/material'
import ProfileImage from './ProfileImage';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const GET_RECENT_JOBS = gql`query {
  jobs(first: 5, orderBy: issued_at, orderDirection: desc) {
    id,
    owner_id,
    title,
    description,
    work_location_city,
    work_location_country,
    job_type,
  }}`;

const RecentJobsComponent = ({
  
}) => {
  const { loading, error, data } = useQuery(GET_RECENT_JOBS);

  const openJob = (jobId: string) => (event) => {
    if (window) {
      window.open(`https://certy-career-builder.vercel.app/certy-career/individual/jobs/${jobId}`, '_blank')?.focus();
    }
  }

  return (
    <div className="p-6 app-card">
      <h3 className="text-[rgb(28,31,39)]/50 text-medium font-semibold">New Jobs</h3>
      <ul className="mt-7 flex flex-col space-y-6">
        {(!loading && data && data.jobs) && data.jobs.map((job) => (
          <li key={job.id} className="cursor-pointer inline-flex flex-row items-start rounded-l-lg rounded-r-lg" onClick={openJob(job.id)}>
            <div className="min-w-[48px]"><ProfileImage src={job.owner_id} alt={'job_' + job.id} /></div>
            <div className="flex flex-col ml-6">
              <div className="font-semibold text-sm line-clamp-1 text-[rgb(28,31,39)]">{job.title}</div>
              <div className="mt-2 flex flex-row space-x-3 divide-x divide-[rgb(0,0,0)]/5">
                <span className="text-sm font-semibold text-[rgb(28,31,39)]/70">{job.work_location_city}</span>
                <span className="text-sm pl-3 text-[rgb(28,31,39)]/50">{job.job_type}</span>
              </div>
            </div>
          </li>
        ))}
        {loading && (
          <>
            {[1,2,3].map(i => (<li key={i} className="inline-flex flex-row items-start rounded-l-lg rounded-r-lg">
              <Skeleton animation="wave" variant="rectangular" className="rounded-full" width={48} height={48}/>
              <div className="flex-1 flex flex-col ml-6">
                <Skeleton animation="wave" variant="text" />
                <Skeleton animation="wave" width={'100%'} height={80}/>
              </div>
            </li>))}
          </>
        )}
      </ul>

      <div className="mt-3">
        <a onClick={openJob('')} className={classNames("app-link btnLink")}>More jobs in CeCareer</a>
      </div>
    </div>
  );
};

export default RecentJobsComponent;