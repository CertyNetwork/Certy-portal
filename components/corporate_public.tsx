
import { useCallback, useEffect, useState } from 'react'
import Image, { ImageLoaderProps } from 'next/image'
import { gql, useApolloClient } from '@apollo/client'
import { Skeleton, Divider } from '@mui/material'
import styles from '../styles/Home.module.scss'
import profileBg from '../assets/images/profile-bg.png'
import emptyBox from '../assets/images/empty-box.svg'
import { getAccountBg, getAccountAvatar } from '../apis/services/profile'
import { CompanyInfo } from '../models/CompanyInfo'
import RecentJobsComponent from './RecentJob'
import PictureDialog from './PictureDialog'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const defaultImageLoader =  ({ src, width, quality }: ImageLoaderProps) => {
  return src;
}

const CorporatePublic = ({profile, accountId}) => {
  const client = useApolloClient();
  let [isBgImageLoading, setIsBgImageLoading] = useState(true)
  let [isAvatarImageLoading, setIsAvatarImageLoading] = useState(true)

  let [isPictureDialogOpen, setIsPictureDialogOpen] = useState(false)
  let [shouldReloadOpenJobs, setShouldReloadOpenJobs] = useState(true)
  let [shouldReloadAvatar, setShouldReloadAvatar] = useState(false)

  let [avatar, setAvatar] = useState<string | null>(null)
  let [bgImg, setBgImg] = useState<string | null>(null)
  let [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  let [companyImages, setCompanyImages] = useState<any[]>([]);
  let [companyAbout, setCompanyAbout] = useState<string | null>(null)
  let [jobs, setJobs] = useState<Array<any>>([]);

  function openPictureDialog() {
    setIsPictureDialogOpen(true)
  }

  function closePictureDialog(isUpdated?: boolean) {
    setIsPictureDialogOpen(false)
    if (isUpdated) {
      setShouldReloadAvatar(!shouldReloadAvatar)
    }
  }

  const getOpenJobs = useCallback(async () => {
    try {
      const result = await client.query({
        query: gql`query Jobs($ownerId: String!) {
          jobs(where:{ owner_id: $ownerId,  }) {
            id,
            title,
            description,
            extra,
            salary_to,
            job_type,
            salary_from,
            work_location_city,
            work_location_country,
            issued_at,
            application_deadline
          }
        }`,
        variables: {
          ownerId: accountId,
        },
      });
      if (result && result.data) {
        setJobs(result.data.jobs || []);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }, [client, accountId]);

  
  const getMyAvatar = useCallback(async () => {
    try {
      const { data } = await getAccountAvatar(accountId);
      setAvatar(data.data.src);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setTimeout(() => setIsAvatarImageLoading(false), 300)
    }
  }, [accountId]);

  const getMyBgImg = useCallback(async () => {
    try {
      const { data } = await getAccountBg(accountId);
      setBgImg(data.data.src);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setTimeout(() => setIsBgImageLoading(false), 300)
    }
  }, [accountId]);

  const openJob = (jobId: string) => (event) => {
    if (window) {
      window.open(`https://certy-career-builder.vercel.app/certy-career/individual/jobs/${jobId}`, '_blank')?.focus();
    }
  }

  const onAvatarClick = () => (event) => {
    openPictureDialog();
  }

  useEffect(() => {
    if (profile) {
      setCompanyImages(profile.images);
      setCompanyInfo(profile.info);
      setCompanyAbout(profile.about);
    }
  }, [profile]);

  useEffect(() => {
    getOpenJobs()
  }, [getOpenJobs, shouldReloadOpenJobs]);

  useEffect(() => {
    getMyAvatar()
  }, [getMyAvatar]);

  useEffect(() => {
    getMyBgImg()
  }, [getMyBgImg]);
  
  return (
    <>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
        <div className="flex flex-col flex-auto min-w-0 w-full lg:w-3/4">
          <div className="w-full app-card px-0">
            <div className="flex flex-col bg-card w-full relative">
              {isBgImageLoading ? (
                <Skeleton variant='rectangular' width={'100%'} height={296}></Skeleton>
              ) : (
                <>
                  {!bgImg && <Image src={profileBg} alt='bg-picture' className='w-full h-40 lg:h-60 object-cover rounded-t-lg' />}
                  {!!bgImg && <Image loader={defaultImageLoader} src={bgImg} alt='bg-picture' width={900} height={300} className='w-full h-40 lg:h-60 object-cover rounded-t-lg' />}
                </>
              )}
            </div>
          
            <div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-4 lg:px-16 lg:h-18 bg-card">
              {isAvatarImageLoading ? (
                <Skeleton animation="wave" variant='circular' width={128} height={128} className={classNames("mt-[-26px] z-0 lg:mt-[-22px] rounded-full cursor-pointer", styles.profilePicture)}></Skeleton>
              ) : (
                <div className={classNames("mt-[-26px] z-0 lg:mt-[-22px] rounded-full", styles.profilePicture)}>
                  {avatar && <Image onClick={onAvatarClick()} loader={defaultImageLoader} src={avatar} width={128} height={128} alt='avatar' className='w-32 h-32 rounded-full ring-4 ring-white cursor-pointer' />}
                  {!avatar && <div className='bg-[#2A85FF] flex items-center justify-center w-32 h-32 rounded-full ring-4 ring-white'><EmptyUserIcon></EmptyUserIcon></div>}
                </div>
              )}
              <div className="pt-4 flex flex-col items-center lg:items-start mt-4 lg:mt-0 lg:ml-8">
                <div className="text-lg font-bold leading-none flex space-x-4">
                  <span>{companyInfo?.companyName}</span>
                </div>
                <div className="text-secondary mt-3">{companyInfo?.location}</div>
              </div>
            </div>

            <div className='mx-8'>
              <Divider className='py-4 !border-[rgb(0,0,0)]/5' />
            </div>

            <div className="py-5 h-full px-4 lg:px-16">
              <p className={classNames("font-semibold", styles.sectionTitle)}>About</p>
              <div className={classNames("leading-7 mt-6 text-sm text-[#1C1F27]", styles.instructor_about)} dangerouslySetInnerHTML={{__html: companyAbout || ''}}></div>
            </div>
          </div>
          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <div className='flex flex-row justify-between items-center'>
                <p className={classNames("font-semibold", styles.sectionTitle)}>Images</p>
              </div>
              <div className='-mx-4 mt-4 flex flex-row flex-wrap'>
                {companyImages.map((doc) => (
                   <div key={doc.id} className='w-[140px] h-[140px] p-4 rounded-[12px] flex items-center justify-center relative'>
                    <Image loader={defaultImageLoader} src={doc.src} width={112} height={112} alt='company-picture' className='rounded-[12px] object-cover' />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <div className='flex flex-row justify-between items-center'>
                <p className={classNames("font-semibold", styles.sectionTitle)}>Organization Information</p>
              </div>
              <div className='mt-6'>
                <div className={classNames("w-full flex flex-row items-start flex-wrap")}>
                  <div className='p-3 flex flex-col w-full md:w-1/3'>
                    <span className='font-light text-sm text-[rgb(28,31,39)]/50'>Location</span>
                    <span className='mt-2'>{companyInfo?.location}</span>
                  </div>
                  <div className='p-3 flex flex-col w-full md:w-1/3'>
                    <span className='font-light text-sm text-[rgb(28,31,39)]/50'>Company Type</span>
                    <span className='mt-2 capitalize'>{companyInfo?.organizationType}</span>
                  </div>
                  <div className='p-3 flex flex-col w-full md:w-1/3'>
                    <span className='font-light text-sm text-[rgb(28,31,39)]/50'>Working Hours</span>
                    <span className='mt-2'>{companyInfo?.workingHours}</span>
                  </div>
                  <div className='p-3 flex flex-col w-full md:w-1/3'>
                    <span className='font-light text-sm text-[rgb(28,31,39)]/50'>Size</span>
                    <span className='mt-2'>{companyInfo?.organizationSize}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <p className={classNames("font-semibold", styles.sectionTitle)}>Opening Jobs</p>
              {!jobs.length && <div className='py-3 w-full flex flex-col items-center justify-center'>
                <div className='py-3 w-full flex flex-col items-center justify-center'>
                  <Image src={emptyBox} alt='empty' className='w-32 h-32' />
                </div>
              </div>}
              {jobs.length > 0 &&
                <ul className="mt-7 flex flex-col divide-y divide-[rgb(0,0,0)]/5">
                  {jobs.map((job) => (
                    <li onClick={openJob(job.id)} key={job.id} className="py-3 cursor-pointer inline-flex flex-row items-start rounded-l-lg rounded-r-lg">
                      <div className='w-[80px] h-[80px] bg-blue-500 rounded-2xl flex items-center justify-center'>
                        {/* <BriefcaseIcon className='w-[24px] h-[24px]' color='#FFFFFF'></BriefcaseIcon> */}
                      </div>
                     
                      {/* <Image loader={defaultImageLoader} src={job.media || 'loading'} alt={'cert_' + job.idclassName="object-cover rounded-lg"} width={120} height={120}  /> */}
                      <div className="flex flex-col ml-6">
                        <span className="font-semibold line-clamp-1">{job.title}</span>
                        <div className='mt-3 text-sm flex flex-row space-x-3 divide-x divide-[rgb(0,0,0)]/5'>
                          <span>{job.job_type}</span>
                          <span className='pl-3'>{job.work_location_city}-{job.work_location_country}</span>
                          <span className='pl-3'>{job.salary_from}-{job.salary_to} USD</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            </div>
          </div>
          
        </div>
        <div className="flex flex-col flex-auto min-w-0 w-full mt-6 lg:mt-0 lg:w-1/4 lg:ml-8 h-full space-y-6">
          <RecentJobsComponent></RecentJobsComponent>
        </div>
      </main>
      <PictureDialog viewOnly={true} imgSrc={avatar} isOpen={isPictureDialogOpen} closeModal={() => {}} onCancelButtonClick={closePictureDialog} onSubmitted={closePictureDialog}></PictureDialog>
    </>
  )
}

export default CorporatePublic;

function EmptyUserIcon() {
  return (
    <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 4.66668C13.7658 4.66668 10.3333 8.09916 10.3333 12.3333C10.3333 16.5675 13.7658 20 18 20C22.2342 20 25.6667 16.5675 25.6667 12.3333C25.6667 8.09916 22.2342 4.66668 18 4.66668ZM6.5 12.3333C6.5 5.98207 11.6487 0.833344 18 0.833344C24.3513 0.833344 29.5 5.98207 29.5 12.3333C29.5 18.6846 24.3513 23.8333 18 23.8333C11.6487 23.8333 6.5 18.6846 6.5 12.3333ZM10.3333 31.5C7.1577 31.5 4.58333 34.0744 4.58333 37.25C4.58333 38.3086 3.72521 39.1667 2.66667 39.1667C1.60812 39.1667 0.75 38.3086 0.75 37.25C0.75 31.9573 5.04061 27.6667 10.3333 27.6667H25.6667C30.9594 27.6667 35.25 31.9573 35.25 37.25C35.25 38.3086 34.3919 39.1667 33.3333 39.1667C32.2748 39.1667 31.4167 38.3086 31.4167 37.25C31.4167 34.0744 28.8423 31.5 25.6667 31.5H10.3333Z" fill="white"/>
    </svg>
  )
}