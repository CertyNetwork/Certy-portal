import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link';
import logo from '../assets/images/logo.png'
import OurSolution from '../components/OurSolution';
import { AuthContext } from '../contexts/auth-context'
import ProfileImage from '../components/ProfileImage'
import githubIcon from '../assets/images/socials/github_blue.svg'
import mediumIcon from '../assets/images/socials/medium_blue.svg'
import telegramIcon from '../assets/images/socials/telegram_blue.svg'
import twitterIcon from '../assets/images/socials/twitter_blue.svg'
import discordIcon from '../assets/images/socials/discord_blue.svg'

interface MainLayoutProps {
  children: any
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const MainLayout: FunctionComponent<MainLayoutProps> = ({
  children,
}) => {
  const { login, logout, getAccountId, authenticated, isInitializing } = useContext(AuthContext)
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    if (isInitializing) {
      setIsAuthenticated(authenticated)
    }
  }, [isInitializing, authenticated]);
  
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-white">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src={logo}
                        className="h-8 w-8"
                        alt="Workflow"
                        width={125}
                        height={48}
                      />
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <OurSolution></OurSolution>
                      {/* Profile dropdown */}
                      {isAuthenticated ? <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-[rgb(42,133,255)]/5 rounded-full flex items-center text-sm focus:outline-none">
                            <span className="sr-only">Open user menu</span>
                            <ProfileImage src={getAccountId()}></ProfileImage>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  onClick={logout}
                                  className={classNames('cursor-pointer',
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-[#FF3A44] font-semibold'
                                  )}
                                >
                                  Logout
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu> : <Button variant="outlined" className='ml-3 !capitalize' onClick={login}>Login with NEAR</Button>}
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

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                  <OurSolution></OurSolution>
                </div>
                {isAuthenticated ? <div className="flex items-center justify-center flex-col pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <ProfileImage width={32} height={32} src={getAccountId()} className="rounded-full"></ProfileImage>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Disclosure.Button
                      as="a"
                      // href={item.href}
                      className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div> : <div className="flex items-center justify-center flex-col pt-4 pb-3"><Button variant="outlined" className='ml-3 !capitalize' onClick={login}>Login with NEAR</Button></div>}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {children}
        <footer className="footer mt-8 py-[48px] bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
            <div className="logo_container">
              <Link href='#'>
                <a><Image
                  src={logo}
                  className="h-8 w-8"
                  alt="Workflow"
                  width={125}
                  height={48}
                /></a>
              </Link>
              <div className='text-[#6E6B68] font-light'>
                <a className="py-5 md:py-0">Privacy Policy</a>
                <span className="mx-3 p-text-secondary">&#8226;</span>
                <a className="p-text-secondary py-5 md:py-0">Terms & Conditions</a>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end w-2/5 md:w-1/2">
              <a className="flex rounded-full w-12 h-12 hover:scale-90" href="https://github.com/CertyNetwork " target="_blank" rel="nofollow noopener noreferrer">
                <Image
                  src={githubIcon}
                  alt="github"
                  width={24}
                  height={24}
                />
              </a>
              <a className="flex rounded-full w-12 h-12 hover:scale-90" href="https://mobile.twitter.com/certyhq" target="_blank" rel="nofollow noopener noreferrer">
                <Image
                  src={twitterIcon}
                  alt="twitter"
                  width={24}
                  height={24}
                />
              </a>
              <a className="flex rounded-full w-12 h-12 hover:scale-90" href="https://t.me/certynetworkann" target="_blank" rel="nofollow noopener noreferrer">
                <Image
                  src={telegramIcon}
                  alt="telegram"
                  width={24}
                  height={24}
                />
              </a>
              <a className="flex rounded-full w-12 h-12 hover:scale-90" href=" https://discord.gg/gAcZ7uCCUG" target="_blank" rel="nofollow noopener">
                <Image
                  src={discordIcon}
                  alt="discord"
                  width={24}
                  height={24}
                />
              </a>
              <a className="flex rounded-full w-12 h-12 hover:scale-90" href="https://medium.com/@CertyNetwork" target="_blank" rel="nofollow noopener noreferrer">
                <Image
                  src={mediumIcon}
                  alt="medium"
                  width={24}
                  height={24}
                />
              </a>
              {/* <a className="flex rounded-full w-12 h-12 hover:scale-90" href="https://medium.com/@CertyNetwork" target="_blank" rel="nofollow noopener noreferrer">
                <Image
                  src={mailIcon}
                  alt="medium"
                  width={24}
                  height={24}
                />
              </a> */}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainLayout;
