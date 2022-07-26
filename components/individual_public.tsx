
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import Image, { ImageLoaderProps } from 'next/image'
import { Skeleton, Divider, Chip } from '@mui/material'
import { gql, useApolloClient } from '@apollo/client';
import { getAccountBg, getAccountAvatar } from '../apis/services/profile'
import profileBg from '../assets/images/profile-bg.png'
import apartmentBg from '../assets/images/apartment_bg.svg'
import academyBg from '../assets/images/academy.svg'
import { Experience } from '../models/Experience'
import { Education } from '../models/Education'
import { BasicInfo } from '../models/BasicInfo'
import { Certificate } from '../models/Certificate'
import PictureDialog from './PictureDialog'
import RecentJobsComponent from './RecentJob';
import styles from '../styles/Home.module.scss'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const defaultImageLoader =  ({ src, width, quality }: ImageLoaderProps) => {
  return src;
}

const IndividualPublic = ({profile, accountId}) => {
  const client = useApolloClient();

  let [isPictureDialogOpen, setIsPictureDialogOpen] = useState(false);
  let [isBgImageLoading, setIsBgImageLoading] = useState(true)
  let [isAvatarImageLoading, setIsAvatarImageLoading] = useState(true)

  let [shouldReloadBg, setShouldReloadBg] = useState(false)
  let [shouldReloadAvatar, setShouldReloadAvatar] = useState(false)
  let [shouldReloadCerts, setShouldReloadCerts] = useState(false)

  let [about, setAbout] = useState<string | undefined>();
  let [experiences, setExperiences] = useState<Experience[]>([])
  let [educations, setEducations] = useState<Education[]>([])
  let [certificates, setCertificates] = useState<Certificate[]>([])
  let [selectedCertificates, setSelectedCertificates] = useState<string[]>([])
  let [myCertificates, setMyCertificates] = useState<Certificate[]>([])
  let [avatar, setAvatar] = useState<string | null>(null)
  let [bgImg, setBgImg] = useState<string | null>(null)
  let [info, setInfo] = useState<BasicInfo | null>(null)
  let [skills, setSkills] = useState<string[]>([])

  function openPictureDialog() {
    setIsPictureDialogOpen(true)
  }

  function closePictureDialog(isUpdated?: boolean) {
    setIsPictureDialogOpen(false)
    if (isUpdated) {
      setShouldReloadAvatar(!shouldReloadAvatar)
    }
  }

  const onAvatarClick = () => (event) => {
    openPictureDialog();
  }

  const getAvatar = useCallback(async () => {
    try {
      setIsAvatarImageLoading(true)
      const { data } = await getAccountAvatar(accountId);
      setAvatar(data.data.src);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setTimeout(() => setIsAvatarImageLoading(false), 300)
    }
  }, [accountId]);

  const getCerts = useCallback(async () => {
    try {
      const result = await client.query({
        query: gql`query Certs($ownerId: String!) {
          certs(where:{ owner_id: $ownerId }) {
            id,
            owner_id,
            title,
            description,
            media,
            issued_at
          }
        }`,
        variables: {
          ownerId: accountId,
        },
      });
      if (result && result.data) {
        setCertificates(result.data.certs || []);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }, [client, accountId]);

  const getMyBgImg = useCallback(async () => {
    try {
      setIsBgImageLoading(true)
      const { data } = await getAccountBg(accountId);
      setBgImg(data.data.src);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setTimeout(() => setIsBgImageLoading(false), 300)
    }
  }, [accountId]);

  useEffect(() => {
    const certs = certificates.filter(cert => selectedCertificates.indexOf(cert.id) >= 0);
    setMyCertificates(certs);
  }, [certificates, selectedCertificates]);

  useEffect(() => {
    getCerts()
  }, [getCerts, shouldReloadCerts]);

  useEffect(() => {
    getAvatar()
  }, [getAvatar]);

  useEffect(() => {
    getMyBgImg()
  }, [getMyBgImg]);
  
  useEffect(() => {
    if (profile) {
      setEducations(profile.educations);
      setExperiences(profile.experiences);
      setSkills(profile.skills);
      setInfo(profile.info);
      setAbout(profile.about);
      setSelectedCertificates((profile.certificates || []).map(cert => cert.id));
    }
  }, [profile]);
  
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
                  {!bgImg && <Image src={profileBg} alt='bg-picture' className='w-full h-40 lg:h-60 object-cover rounded-t-lg'/>}
                  {!!bgImg && <Image loader={defaultImageLoader} src={bgImg} alt='bg-picture' width={900} height={300} className='w-full h-40 lg:h-60 object-cover rounded-t-lg' />}
                </>
              )}
            </div>
            <div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-4 lg:px-16 lg:h-18 bg-card">
              {isAvatarImageLoading ? (
                <Skeleton animation="wave" variant='circular' width={128} height={128} className={classNames("mt-[-26px] z-0 lg:mt-[-22px] rounded-full cursor-pointer", styles.profilePicture)}></Skeleton>
              ) : (
                <div className={classNames("mt-[-26px] z-0 lg:mt-[-22px] rounded-full cursor-pointer", styles.profilePicture)}>
                  {avatar && <Image onClick={onAvatarClick()} loader={defaultImageLoader} src={avatar} width={128} height={128} alt='avatar' className='w-32 h-32 rounded-full ring-4 ring-white' />}
                  {!avatar && <div className='bg-[#2A85FF] flex items-center justify-center w-32 h-32 rounded-full ring-4 ring-white'><EmptyUserIcon></EmptyUserIcon></div>}
                </div>
              )}
              <div className="flex flex-col items-center lg:items-start mt-4 pt-4 lg:mt-0 lg:ml-8">
                <div className="font-bold leading-none flex flex-row space-x-3">
                  {info && <span>{info?.displayName}</span>}
                </div>
                <div className="text-secondary text-sm mt-3 text-[rgb(28,31,39)]/70">{info?.bio}</div>
              </div>
            </div>

            <div className='mx-8'>
              <Divider className='py-4 !border-[rgb(0,0,0)]/5' />
            </div>
            
            <div className="py-8 px-4 lg:px-16">
              <p className="font-semibold text-[rgb(28,31,39)]/50">About Me</p>
              <>
                <div className={classNames("leading-7 mt-6 text-sm text-[#1C1F27]", styles.instructor_about)} dangerouslySetInnerHTML={{__html: about || ''}}></div>
              </>
            </div>
          </div>
          
          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <div className='flex flex-row justify-between items-center'>
                <p className={classNames("font-semibold", styles.sectionTitle)}>Experience</p>
              </div>
              
              {!!experiences.length && <div className='mt-4 flex flex-col space-y-3 divide-y divide-[rgb(0,0,0)]/5'>
                {experiences.map((ex, idx) => (
                  <div key={ex.id} className={classNames("w-full flex flex-row items-center py-3 cursor-pointer")}>
                    <div className='w-[48px] h-[48px] bg-blue-500 rounded-md flex items-center justify-center'>
                      <Image src={apartmentBg} alt='company-picture' className='object-cover' />
                    </div>
                    <div className='flex flex-col ml-6 flex-1'>
                      <div className='text-lg font-semibold'>{ex.title}</div>
                      <div className='mt-[10px] flex flex-row space-x-3 divide-x divide-[rgb(0,0,0)]/5'>
                        <span className={classNames('font-semibold text-sm', styles.ink_80)}>{ex.companyName}</span>
                        <span className={classNames('pl-3 text-sm capitalize', styles.ink_80)}>{ex.employmentType}</span>
                        <span className={classNames('pl-3 text-sm', styles.ink_80)}>{dayjs(ex.startDate).locale('en').format('YYYY-MM-DD')} &#8212; {dayjs(ex.endDate).locale('en').format('YYYY-MM-DD')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>}
              {!experiences.length && <div className='py-3 w-full flex flex-col items-center justify-center'>
                <p>No experience updated</p>
              </div>}
            </div>
          </div>
          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <div className='flex flex-row justify-between items-center'>
                <p className={classNames("font-semibold", styles.sectionTitle)}>Education</p>
              </div>
              {!!educations.length && <div className='mt-6 flex flex-col space-y-3 divide-y divide-[rgb(0,0,0)]/5'>
                {educations.map((ed, idx) => (
                  <div key={ed.id} className={classNames("w-full flex flex-row items-start py-3 cursor-pointer")}>
                    <div className='w-[48px] h-[48px] bg-blue-500 rounded-md flex items-center justify-center'>
                      <Image src={academyBg} alt='academy-picture' className='object-cover' />
                    </div>
                    <div className='flex flex-col ml-6 flex-1'>
                      <div className='text-lg font-semibold'>{ed.school}</div>
                      <div className='mt-[4px] flex flex-row space-x-3 divide-x divide-[rgb(0,0,0)]/5'>
                        <span className={classNames('font-semibold text-sm', styles.ink_80)}>{ed.fieldOfStudy}</span>
                        <span className={classNames('pl-3 text-sm', styles.ink_80)}>{dayjs(ed.startDate).locale('en').format('YYYY-MM-DD')} - {dayjs(ed.endDate).locale('en').format('YYYY-MM-DD')}</span>
                      </div>
                      <div className='mt-4 flex'>
                        <span className={classNames('text-sm font-light leading-7', styles.ink_80)} dangerouslySetInnerHTML={{__html: ed?.description || ''}}></span>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>}
              {!educations.length && <div className='py-3 w-full flex flex-col items-center justify-center'>
                <p>No education updated</p>
              </div>}
            </div>
          </div>

          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <div className='flex flex-row justify-between items-center'>
                <p className={classNames("font-semibold", styles.sectionTitle)}>Skills</p>
              </div>
              {!!skills.length && <div className='py-3 w-full flex flex-row items-start space-x-2'>
                {skills.map(sk => <Chip key={sk} variant='filled' label={sk}></Chip>)}
              </div>}
              {!skills.length && <div className='py-3 w-full flex flex-col items-center justify-center'>
                <p>No skill updated</p>
              </div>}
            </div>
          </div>

          <div className='w-full app-card px-0 mt-5'>
            <div className="py-5 h-full px-4 lg:px-16">
              <div className='flex flex-row justify-between items-center'>
                <p className={classNames("font-semibold", styles.sectionTitle)}>Certificates</p>
              </div>
              {myCertificates.length > 0 &&
                <ul className="mt-7 flex flex-col space-y-6">
                  {myCertificates.map((cert) => (
                    <li key={cert.id} className="cursor-pointer inline-flex flex-row items-start rounded-l-lg rounded-r-lg">
                      <Image loader={defaultImageLoader} src={cert.media} alt={'cert_' + cert.id} width={120} height={120} className="object-cover rounded-lg" />
                      <div className="flex flex-col ml-6">
                        <span className="font-semibold line-clamp-1">{cert.title}</span>
                        <span className="mt-2 text-sm">{cert.description}</span>
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

export default IndividualPublic

function EmptyUserIcon() {
  return (
    <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 4.66668C13.7658 4.66668 10.3333 8.09916 10.3333 12.3333C10.3333 16.5675 13.7658 20 18 20C22.2342 20 25.6667 16.5675 25.6667 12.3333C25.6667 8.09916 22.2342 4.66668 18 4.66668ZM6.5 12.3333C6.5 5.98207 11.6487 0.833344 18 0.833344C24.3513 0.833344 29.5 5.98207 29.5 12.3333C29.5 18.6846 24.3513 23.8333 18 23.8333C11.6487 23.8333 6.5 18.6846 6.5 12.3333ZM10.3333 31.5C7.1577 31.5 4.58333 34.0744 4.58333 37.25C4.58333 38.3086 3.72521 39.1667 2.66667 39.1667C1.60812 39.1667 0.75 38.3086 0.75 37.25C0.75 31.9573 5.04061 27.6667 10.3333 27.6667H25.6667C30.9594 27.6667 35.25 31.9573 35.25 37.25C35.25 38.3086 34.3919 39.1667 33.3333 39.1667C32.2748 39.1667 31.4167 38.3086 31.4167 37.25C31.4167 34.0744 28.8423 31.5 25.6667 31.5H10.3333Z" fill="white"/>
    </svg>
  )
}


