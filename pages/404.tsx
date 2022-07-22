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
        <Image alt='not-found' src={notFoundImg} width={'auto'} height={'auto'}></Image>
        <p className='text-xl my-4'>Something went wrong</p>
        <p>Refresh the page</p>
      </div>
    </>
  ) 
}

export default NotFound;
