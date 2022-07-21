
import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { CircularProgress } from '@mui/material'
import { MainLayout } from '../layouts/main'
import { getUserType } from '../apis/services/profile'
import Individual from '../components/individual'
import Corporate from '../components/corporate'
import { AuthContext } from '../contexts/auth-context'

const Home: NextPage = () => {
  let [userType, setUserType] = useState(null)
  let [isLoading, setIsLoading] = useState(false)
  const { isInitializing, authenticated } = useContext(AuthContext)

  const getMyUserType = async () => {
    try {
      setIsLoading(true)
      const { data } = await getUserType()
      setUserType(data.data.userType)
    } catch (error) {
      console.log('error:', error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (authenticated) {
      getMyUserType()
    }
  }, [authenticated])

  useEffect(() => {
    if (isInitializing) {
      return;
    }
    authenticated
   ? Router.push("/")
   : Router.push({pathname: '/start'});
  }, [authenticated, isInitializing])
  
  return (
    <>
      <Head>
        <title>Certify Your Future</title>
      </Head>
      <MainLayout>
        {isLoading && <div className='min-h-[100vh] flex items-center justify-center'>
          <CircularProgress color="secondary" />
        </div>}
        {!isLoading && userType === 'individual' && <Individual></Individual>}
        {!isLoading && userType === 'institution' && <Corporate></Corporate>}
      </MainLayout>
    </>
  ) 
}

export default Home;
