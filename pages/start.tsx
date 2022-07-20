
import { useContext, useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import { XIcon, MenuIcon } from '@heroicons/react/outline'
import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import Image from 'next/image'
import logo from '../assets/images/logo.svg'
import socialImg from '../assets/images/social.svg'
import storageImg from '../assets/images/storage.svg'
import careerImg from '../assets/images/career.svg'
import learningImg from '../assets/images/learning.svg'
import githubIcon from '../assets/images/socials/github.svg'
import mediumIcon from '../assets/images/socials/medium.svg'
import telegramIcon from '../assets/images/socials/telegram.svg'
import twitterIcon from '../assets/images/socials/twitter.svg'
import discordIcon from '../assets/images/socials/discord.svg'
import { AuthContext } from '../contexts/auth-context'
import styles from '../styles/Intro.module.css'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Start: NextPage = () => {
  const { login, isInitializing, authenticated } = useContext(AuthContext)

  useEffect(() => {
    if (isInitializing) {
      return;
    }
    authenticated
   ? Router.push("/")
   : Router.push({pathname: '/start'});
  }, [authenticated, isInitializing])

  return (
   <div className='flex flex-col min-h-full'>
    <Head>
      <title>Certify Your Future</title>
    </Head>
    <div className={classNames('min-h-[450px] md:min-h-[600px] max-h-[70vh] w-full', styles.hero)}>
      <Disclosure as="nav" className={styles.nav}>
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      src={logo}
                      className="h-8 w-8"
                      alt="logo"
                      width={125}
                      height={48}
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <a className='' aria-current={'page'}>Discord</a>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <a className='' aria-current={'page'}>Blog</a>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <a className='' aria-current={'page'}>Certy Token</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className={classNames("md:hidden", styles.menuWrapper)}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Disclosure.Button
                    as="a"
                    href='#'
                    className='text-gray-300 hover:bg-gray-700 hover:text-white, block px-3 py-2 rounded-md text-base font-medium'
                    aria-current={'page'}
                  >
                    Discord
                </Disclosure.Button>
                <Disclosure.Button
                    as="a"
                    href='#'
                    className='text-gray-300 hover:bg-gray-700 hover:text-white, block px-3 py-2 rounded-md text-base font-medium'
                    aria-current={'page'}
                  >
                    Blog
                </Disclosure.Button>
                <Disclosure.Button
                    as="a"
                    href='#'
                    className='text-gray-300 hover:bg-gray-700 hover:text-white, block px-3 py-2 rounded-md text-base font-medium'
                    aria-current={'page'}
                  >
                    Token
                </Disclosure.Button>
              </div>
              {/* <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  
                  <button
                    type="button"
                    className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div> */}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className={styles.spotGradient}></div>

      <div className={classNames('w-full max-w-7xl mx-auto px-4 md:px-6', styles.headline)}>
        <h1 className='text-7xl font-semibold md:max-w-[500px]'>
          Certify Your Future
        </h1>
        <p className='mt-3 font-light'>Improve career development and pave the way to the future.</p>
        <button type="submit" className="mt-8 px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium rounded-xl text-white bg-[#1C53B4] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className='text-xs uppercase' onClick={login}>Connect to Near Wallet</span>
        </button>
      </div>
    </div>

    <div className={classNames('min-h-[450px] lg:min-h-[600px] w-full px-6', styles.mainIntro)}>
      <div className={classNames('max-w-7xl mx-auto flex flex-col')}>
        <div className='mt-10 mb-11'>
          <div className='flex flex-col flex-auto w-full md:px-10 lg:px-20'>
            <div className="max-w-[200px] px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium rounded-xl text-[#2C86FF] bg-[#D6E7FF]">
              <span className='text-xs uppercase'>Our Products</span>
            </div>
          </div>
          
        </div>
        <div className={classNames('flex flex-col items-center md:flex-row', styles.introItemLeft)}>
          <div className='flex flex-col flex-auto w-full md:w-1/2 p-10 md:px-10 lg:px-20'>
            <h2 className='text-4xl font-semibold'>CeSocial</h2>
            <p className='mt-3 font-light leading-8'>
              Utilizing blockchain technology, Certy <span className='font-semibold'>transforms a traditional customized profile into a decentralized social networking site</span> with employment-oriented online services in the form of SocialFi.
            </p>
            <button type="submit" className="mt-5 rounded-xl max-w-[100px] px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium text-white bg-[#2A85FF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className='text-xs uppercase'>Discover</span>
            </button>
          </div>
          <div className='flex-auto w-full md:w-1/2'>
            <Image
              src={socialImg}
              alt="social"
              height={350}
            />
          </div>
        </div>

        <div className={classNames('flex flex-col-reverse items-center md:flex-row', styles.introItemBottomLeft)}>
          <div className='flex-auto w-full md:w-1/2'>
            <Image
              src={storageImg}
              alt="storage"
              height={350}
            />
          </div>
          <div className='flex flex-col flex-auto w-full md:w-1/2 p-10 md:px-10 lg:px-20'>
            <h2 className='text-4xl font-semibold'>CeStorage</h2>
            <p className='mt-3 font-light leading-8'>
              With the <span className='font-semibold'>one-click function</span> and customizable configuration parameters, users can quickly <span className='font-semibold'>mint and issue degrees and certificates</span> as Non-Fungible Tokens (NFT) and securely store them on-chain.
            </p>
            <button type="submit" className="mt-5 rounded-xl max-w-[100px] px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium text-white bg-[#2A85FF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className='text-xs uppercase'>Discover</span>
            </button>
          </div>
        </div>

        <div className={classNames('flex flex-col items-center md:flex-row')}>
          <div className='flex flex-col flex-auto w-full md:w-1/2 p-10 md:px-10 lg:px-20'>
            <h2 className='text-4xl font-semibold'>CeCareer</h2>
            <p className='mt-3 font-light leading-8'>
              Certy will be building the <span className='font-semibold'>Career Builder feature</span>, working as a portal using a recommender system to <span className='font-semibold'>connect users looking for desired jobs with the world&apos;s leading companies</span> based on their interests and skills.
            </p>
            <button type="submit" className="mt-5 rounded-xl max-w-[100px] px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium text-white bg-[#2A85FF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className='text-xs uppercase'>Discover</span>
            </button>
          </div>
          <div className='flex-auto w-full md:w-1/2'>
            <Image
              src={careerImg}
              alt="career"
              height={350}
            />
          </div>
        </div>

        <div className={classNames('flex flex-col-reverse items-center md:flex-row', styles.introItemBottomRight)}>
          <div className='flex-auto w-full md:w-1/2'>
            <Image
              src={learningImg}
              alt="storage"
              height={350}
            />
          </div>
          <div className='flex flex-col flex-auto w-full md:w-1/2 p-10 md:px-10 lg:px-20'>
            <h2 className='text-4xl font-semibold'>CeLearning</h2>
            <p className='mt-3 font-light leading-8'>
              Using Artificial Intelligence, our tokenized <span className='font-semibold'>Learn-To-Earn model</span> will help personalize students&apos;learning pathways suiting their career orientation while motivating them with incentive rewards.
            </p>
            <button type="submit" className="mt-5 rounded-xl max-w-[100px] px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium text-white bg-[#2A85FF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className='text-xs uppercase'>Discover</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <footer className={classNames('min-h-[300px] lg:min-h-[450px] w-full', styles.footer)}>
      <div className={styles.spotGradient}></div>
      <div className={classNames('w-full max-w-7xl mx-auto flex flex-col space-y-5 md:space-y-0 md:flex-row px-4 sm:px-6 md:px-6', styles.headline)}>
        <div className='flex-auto w-full md:w-1/2'>
          <h3 className='text-xs'>GET IN TOUCH WITH CONVERSANT</h3>
          <h2 className='mt-6 text-2xl max-w-[640px]'>Looking to mailist your communications?</h2>
        </div>
        <div className='flex-auto w-full md:w-1/2 flex md:justify-end items-start'>
          <button type="submit" className="mt-4 px-5 py-3 group relative flex justify-center border border-transparent text-sm font-medium rounded-xl text-black bg-[#FFFFFF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className='text-xs uppercase'>Contact Us</span>
          </button>
        </div>
      </div>

      <div className='w-full max-w-7xl mx-auto my-10 h-[1px] bg-[#D2E6F9] opacity-5'></div>

      <div className={classNames('w-full max-w-7xl mx-auto flex flex-col space-y-12 md:space-y-0 md:flex-row px-4 sm:px-6 md:px-6')}>
        <div className='flex-auto flex flex-col items-center md:items-start w-full md:w-1/3'>
          <Image
            src={logo}
            className="h-8 w-8"
            alt="logo"
            width={125}
            height={48}
          />
          <p className='mt-8 font-semibold'>Certify Your Future</p>
          <div className='mt-8 flex flex-wrap flex-row'>
            <a className="rounded-full w-12 h-12 hover:scale-90" href="https://github.com/CertyNetwork " target="_blank" rel="nofollow noopener noreferrer">
              <Image
                src={githubIcon}
                alt="github"
                width={24}
                height={24}
              />
            </a>
            <a className="rounded-full w-12 h-12 hover:scale-90" href="https://mobile.twitter.com/certyhq" target="_blank" rel="nofollow noopener noreferrer">
              <Image
                src={twitterIcon}
                alt="twitter"
                width={24}
                height={24}
              />
            </a>
            <a className="rounded-full w-12 h-12 hover:scale-90" href="https://t.me/certynetworkann" target="_blank" rel="nofollow noopener noreferrer">
              <Image
                src={telegramIcon}
                alt="telegram"
                width={24}
                height={24}
              />
            </a>
            <a className="rounded-full w-12 h-12 hover:scale-90" href=" https://discord.gg/gAcZ7uCCUG" target="_blank" rel="nofollow noopener">
              <Image
                src={discordIcon}
                alt="discord"
                width={24}
                height={24}
              />
            </a>
            <a className="rounded-full w-12 h-12 hover:scale-90" href="https://medium.com/@CertyNetwork" target="_blank" rel="nofollow noopener noreferrer">
              <Image
                src={mediumIcon}
                alt="medium"
                width={24}
                height={24}
              />
            </a>
          </div>
        </div>

        <div className='flex-auto flex flex-col w-full md:w-1/3 text-center md:text-left'>
          <h2 className={classNames(styles.footerTitle)}>Legal</h2>
          <p className={classNames('mt-4', styles.footerLink)}>Privacy Policy</p>
          <p className={classNames('mt-4', styles.footerLink)}>Terms & Conditions</p>
          <p className={classNames('mt-4', styles.footerLink)}>Tokenomics</p>
        </div>

        <div className='flex-auto flex flex-col w-full md:w-1/3 text-center md:text-left'>
          <h2 className={classNames(styles.footerTitle)}>Company</h2>
          <p className={classNames('mt-4', styles.footerLink)}>Our story</p>
          <p className={classNames('mt-4', styles.footerLink)}>Join Us</p>
          <p className={classNames('mt-4', styles.footerLink)}>Why Choose Us</p>
          <p className={classNames('mt-4', styles.footerLink)}>News</p>
          <p className={classNames('mt-4', styles.footerLink)}>FAQs</p>
        </div>
        <div className='flex-auto flex flex-col w-full md:w-1/3 text-center md:text-left'>
          <h2 className={classNames(styles.footerTitle)}>Our Contact</h2>
          <p className={classNames('mt-4', styles.footerLink)}>E-Mail</p>
          <p className={classNames('mt-4', styles.footerLink)}>Phone Number</p>
        </div>
      </div>
      <div className={classNames('w-full mt-10 md:mt-4 max-w-7xl mx-auto flex flex-col md:flex-row px-4 sm:px-6 md:px-3')}>
        <p className={classNames('mt-4 text-center md:text-left', styles.footerLink)}>© 2022 CertyChain. All rights reserved.</p>
      </div>
    </footer>
   </div>
  )
}

export default Start;

