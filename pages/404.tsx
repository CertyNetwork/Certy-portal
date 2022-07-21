
import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import notFoundImg from '../assets/images/35g21lbobq614u53uejo9treo.svg'
import Router, { useRouter } from 'next/router'

const NotFound = ({}) => {
  
  return (
    <>
      <Head>
        <title>Certify Your Future</title>
      </Head>
      <div className='mt-[48px] flex flex-col items-center justify-center'>
        <Image src={notFoundImg}></Image>
        <p className='text-xl my-4'>Something went wrong</p>
        <p>Refresh the page</p>
      </div>
      {/* <MainLayout>
        {isLoading && <div className='min-h-[100vh] flex items-center justify-center'>
          <CircularProgress color="secondary" />
        </div>}
        {!isLoading && userType === 'individual' && <Individual></Individual>}
        {!isLoading && userType === 'institution' && <Corporate></Corporate>}
      </MainLayout> */}
    </>
  ) 
}

export default NotFound;
