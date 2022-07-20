
import { Fragment, useCallback, useContext, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDropzone } from 'react-dropzone';
import { XIcon } from '@heroicons/react/outline';
import { TypesToast } from "../../contexts/toast-reducer";
import { ToastContext } from "../../contexts/toast-context";
import styles from '../../styles/Dropzone.module.scss'
import { uploadOrganizationImages } from "../../apis/services/profile";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const MAX_FILES = 5;

interface CompanyImagesDialog {
  numberOfImages: number;
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const CompanyImagesDialog = ({
  numberOfImages,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: CompanyImagesDialog) => {
  let [isSubmitting, setIsSubmitting] = useState(false);
  const { dispatchToast } = useContext(ToastContext);
  const [files, setFiles] = useState<Array<any>>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg']
    },
    onDrop: acceptedFiles => {
      setFiles((prevFiles) => {
        if (prevFiles.length >= 5) {
          return prevFiles;
        }
        const validFiles = acceptedFiles.filter(f => prevFiles.findIndex(pf => pf.name === f.name) < 0);
        return validFiles.reduce(
          (acc, file) => [
            ...acc,
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          ],
          prevFiles
        )
      });
    },
    maxFiles: MAX_FILES - numberOfImages,
    multiple: true,
    maxSize: 10000000,
    disabled: files.length >= MAX_FILES - numberOfImages
  });

  const removeFile = (file: any) => (event) => {
    const newFiles = files.filter(f => f !== file)
    setFiles(newFiles)
  }

  const handelCancel = useCallback(() => {
    setFiles([]);
    onCancelButtonClick();
  }, [onCancelButtonClick]);

  const onUploadProgress = (file) => (progressEvent: any) => {
    console.log(file.name);
    console.log(progressEvent);
  }

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await Promise.all(files.map(file => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadOrganizationImages(formData, onUploadProgress(file))
    }));
    setIsSubmitting(false);
    setFiles([]);
    onSubmitted(true);
  }, [files, onSubmitted]);

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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Company Images
                </Dialog.Title>
                <div className="mt-4 mx-auto min-h-[300px] flex flex-row flex-wrap">
                  <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <div className="text-center">
                      <p>Drag and drop some files here, or click to select files</p>
                      <p className="text-sm mt-3 text-gray-500">{5 - numberOfImages - files.length} file(s) left</p>
                      <div className="mt-4 text-sm flex flex-col">
                        <span>Maximum size: 10MB</span>
                        <span>Acceptable format: jpeg | png | gif</span>
                      </div>
                    </div>
                  </div>
                  <div className={classNames('mt-4 -mx-3', styles.thumbsContainer)}>
                    {thumbs}
                  </div>
                </div>
                <div className="mt-6 flex">
                  <button type="button" onClick={handelCancel}
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#FCFCFC] px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <span className='ml-auto'></span>
                  <LoadingButton autoCapitalize="off" className="!capitalize bg-[#2A85FF]" type="submit" onClick={handleSubmit} variant="contained" disabled={files.length < 1} loading={isSubmitting}>
                    Upload Images
                  </LoadingButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CompanyImagesDialog;