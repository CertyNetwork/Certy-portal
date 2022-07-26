
import { Fragment, useContext, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton } from '@mui/material'
import { useDropzone } from 'react-dropzone';
import { XIcon } from '@heroicons/react/outline'
import { ToastContext } from "../contexts/toast-context";
import { removeAvatar, uploadAvatar } from "../apis/services/profile";
import { TypesToast } from "../contexts/toast-reducer";
import styles from '../styles/Dropzone.module.scss'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface PictureDialogProps {
  imgSrc: string | null,
  isOpen: boolean,
  viewOnly?: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const PictureDialog = ({
  imgSrc,
  isOpen,
  viewOnly,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: PictureDialogProps) => {
  let [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10000000,
  });

  const removeFile = (file: any) => (event) => {
    const newFiles = files.filter(f => f !== file)
    setFiles(newFiles)
  }
  
  const handleCancelButtonClick = () => {
    setFiles([]);
    onCancelButtonClick();
  }

  const handleDeleteButtonClick = () => {
    removeAvatar().then(() => {

    }).finally(() => {
      setFiles([]);
      onSubmitted(true);
    });
  }

  const handleUploadButtonClick = () => {
    if (!files.length) {
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    uploadAvatar(formData).then(() => {
      dispatchToast({
        type: TypesToast.SHOW_TOAST,
        payload: {
          message: 'Avatar has been updated successfully',
          type: 'success',
        },
      });
    }).catch(() => {
      dispatchToast({
        type: TypesToast.SHOW_TOAST,
        payload: {
          message: 'Error while updating avatar successfully',
          type: 'error',
        },
      });
    }).finally(() => {
      setIsSubmitting(false)
      setFiles([])
      onSubmitted(true)
    });
  }

  const { dispatchToast } = useContext(ToastContext);


  const thumbs = files.map(file => (
    <div key={file.name} className="p-3 w-1/2 md:w-1/3">
      <div className="rounded-2xl relative">
        <img
          src={file.preview}
          className="rounded-2xl cursor-pointer object-cover"
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
        <span onClick={removeFile(file)} className="absolute cursor-pointer right-2 top-2 flex items-center justify-center w-7 h-7 rounded-full bg-slate-50">
          <XIcon className="w-3 h-3"></XIcon>
        </span>
      </div>
    </div>
  ));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex items-center text-lg font-medium leading-6 text-gray-900">
                  <span>Profile Picture</span>
                  <span className="ml-auto"></span>
                  <IconButton aria-label="edit" color="primary" onClick={() => onCancelButtonClick()}>
                    <XIcon color='#2A85FF' width={20} height={20}></XIcon>
                  </IconButton>
                </Dialog.Title>
                {!!imgSrc && <div className="mt-4 mx-auto w-[280px] h-[280px]">
                  <img src={imgSrc || ''} className="rounded-full w-full h-full"></img>
                </div>}
                {(!viewOnly && !imgSrc) && <><div {...getRootProps({className: classNames('dropzone mt-4 w-full min-h-[150px]')})}>
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <p>Drag and drop file here, or click to select file</p>
                    <div className="mt-4 text-sm flex flex-col">
                      <span>Maximum size: 10MB</span>
                      <span>Acceptable format: jpeg | png | gif</span>
                    </div>
                  </div>
                </div><div className={classNames('mt-4 -mx-3', styles.thumbsContainer)}>
                    {thumbs}
                  </div></>}
                <div className="mt-6 flex">
                  <button type="button" onClick={() => handleCancelButtonClick()}
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <span className='ml-auto'></span>
                  {!viewOnly && imgSrc && <LoadingButton autoCapitalize="off" className="!capitalize !bg-[#f24921] !hover:bg-[#f24921]/80" type="submit" onClick={handleDeleteButtonClick} variant="contained" loading={isSubmitting}>
                    Delete
                  </LoadingButton>}
                  {!!files.length && <LoadingButton autoCapitalize="off" className="!capitalize bg-[#2A85FF]" type="submit" onClick={handleUploadButtonClick} variant="contained" disabled={!files.length} loading={isSubmitting}>
                    Upload
                  </LoadingButton>}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PictureDialog;