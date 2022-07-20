import NextImage, { ImageLoaderProps } from 'next/image'
import { useEffect, useState } from 'react'
import { Skeleton } from '@mui/material'
import { UserCircleIcon } from '@heroicons/react/outline'
import { getAccountAvatar } from '../apis/services/profile'

const avatarImageLoader =  ({ src, width, quality }: ImageLoaderProps) => {
  return src;
}

const ProfileImage = (props) => {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    // Skip if image is already eager or has priority (disables lazy loading)
    if (props.loading === 'eager' || props.priority) {
      return;
    }

    if (!isMobileConnection()) {
      let clearDefer;
      // Set loading to eager if all resources of document are loaded, but defer it a bit
      const onLoad = () => {
        clearDefer = defer(() => setLoading(false));
      };
      window.addEventListener('load', onLoad);
      return () => {
        // Clean up the load event listener and an eventual defer
        window.removeEventListener('load', onLoad);
        if (clearDefer) {
          clearDefer();
        }
      };
    }
  }, [props.loading, props.priority]);

  useEffect(() => {
    getProfileImage(props.src);
  }, [props.src]);

  const getProfileImage = async (accountId: string) => {
    if (!accountId) {
      return;
    }
    try {
      const { data } = await getAccountAvatar(accountId);
      if (data && data.data) {
        setImgSrc(data.data.src || '');
      }
    } catch(e: any) {

    } finally {
      setLoading(false)
    }
  }

  return (loading ? <Skeleton variant="circular" width={48} height={48} />
    : (!loading && imgSrc ? <img {...props} src={imgSrc} className="w-12 h-12 rounded-full object-cover" /> : <UserCircleIcon strokeWidth={1} className='w-12 h-12 font-light' />));
};

const isMobileConnection = () => {
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return (
    connection?.type === 'cellular' ||
    // @ts-ignore
    connection?.effectiveType === 'slow-2g' ||
    // @ts-ignore
    connection?.effectiveType === '2g' ||
    // @ts-ignore
    connection?.effectiveType === '3g' ||
    // @ts-ignore
    connection?.saveData === true
  );
};

const defer = (callback) => {
  // Check if we can use requestIdleCallback
  if (window.requestIdleCallback) {
    const handle = window.requestIdleCallback(callback);
    return () => window.cancelIdleCallback(handle);
  }
  // Just defer using setTimeout with some random delay otherwise
  const handle = setTimeout(callback, 2345 + Math.random() * 1000);
  return () => clearTimeout(handle);
};

export default ProfileImage;