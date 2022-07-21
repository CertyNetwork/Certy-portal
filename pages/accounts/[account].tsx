
import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../layouts/main'
import { getPublicProfile } from '../../apis/services/profile'
import CorporatePublic from '../../components/corporate_public'
import IndividualPublic from '../../components/individual_public'

const Account = ({userType, profile, accountId}) => {
  return (
    <>
      <Head>
        <title>Certify Your Future</title>
      </Head>
      <MainLayout>
        {userType === 'individual' && <IndividualPublic profile={profile} accountId={accountId}></IndividualPublic>}
        {userType === 'institution' && <CorporatePublic profile={profile} accountId={accountId}></CorporatePublic>}
      </MainLayout>
    </>
  ) 
}

export default Account;

export async function getServerSideProps({params, req}) {
  const { account } = params
  const { cookies } = req
  const accessToken = cookies['ACCESS_TOKEN'];
  if (accessToken) {
    const tknInfo = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
    if (tknInfo && tknInfo.accountId && account === tknInfo.accountId) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  const { data: { userType, profile }} = await getPublicProfile(account)
  if (!profile) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      userType,
      profile,
      accountId: account
    },
  }
}
