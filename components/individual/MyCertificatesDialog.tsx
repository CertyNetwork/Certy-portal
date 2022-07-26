
import { Fragment, useContext, useEffect, useCallback, useState } from "react";
import Image, { ImageLoaderProps } from 'next/image'
import { Transition, Dialog, Listbox } from "@headlessui/react";
import { Checkbox, IconButton } from "@mui/material";
import { XIcon } from '@heroicons/react/outline'
import { ToastContext } from "../../contexts/toast-context";
import { addCertificates } from "../../apis/services/profile";
import { Certificate } from "../../models/Certificate";

interface MyCertificatesDialogProps {
  selectedCertIds: string[],
  certificates: Certificate[],
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const defaultImageLoader =  ({ src, width, quality }: ImageLoaderProps) => {
  return src;
}

const MyCertificatesDialog = ({
  selectedCertIds,
  certificates,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: MyCertificatesDialogProps) => {
  let [selectedCerts, setSelectedCerts] = useState<string[]>([])

  const handleCancelButtonClick = () => {
    setSelectedCerts(selectedCertIds)
    onCancelButtonClick()
  }

  const handleUpdateButtonClick = () => {
    addCertificates({
      certs: selectedCerts
    }).then(() => {
      onSubmitted(true)
    });
  }

  useEffect(() => {
    setSelectedCerts(selectedCertIds)
  }, [selectedCertIds]);

  const { dispatchToast } = useContext(ToastContext);

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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex items-center px-6 py-3 text-lg font-medium leading-6 text-gray-900">
                  List of Certificate
                  <span className="ml-auto"></span>
                  <IconButton aria-label="edit" color="primary" onClick={() => onCancelButtonClick()}>
                    <XIcon color='#2A85FF' width={20} height={20}></XIcon>
                  </IconButton>
                </Dialog.Title>
                <div className="bg-[#F9FAFF]">
                  <Listbox multiple value={selectedCerts} onChange={setSelectedCerts}>
                    <Listbox.Options static className="divide-y divide-[rgb(0,0,0)]/5">
                      {certificates.map((cert) => (
                        <Listbox.Option
                          key={cert.id}
                          value={cert.id}
                          as={Fragment}
                        >
                          {({ active, selected }) => (
                            <li key={cert.id} className="mx-6 cursor-pointer py-3 flex flex-row items-center space-x-3">
                              <div className="mr-6" ><Checkbox checked={selected}/></div>
                              <Image loader={defaultImageLoader} src={cert.media} alt={'cert_' + cert.id} width={110} height={80} className="object-cover rounded-lg" />
                              <div className="flex flex-col !ml-10">
                                <span className="font-semibold text-sm line-clamp-1">{cert.title}</span>
                                <span className="text-sm text-[#9A9FA5] mt-2">{cert.description}</span>
                              </div>
                            </li>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                  
                  <div className="p-6 flex bg-white">
                    <button type="button" onClick={() => handleCancelButtonClick()}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <span className='ml-auto'></span>
                    <button type="button" disabled={!certificates.length}
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#2A85FF] px-4 py-2 text-sm font-medium text-white disabled:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleUpdateButtonClick}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MyCertificatesDialog;
