
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { IconButton } from "@mui/material";
import { XIcon } from "@heroicons/react/outline";
import { finishKyc, startKyc } from "../../apis/services/kyc";

interface KycDialogProps {
  session?: string;
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const KycDialog = ({
  session,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: KycDialogProps) => {
  let vouched = useRef<any>(null);

  const loadVouched = useCallback(() => {
    const config = {
      appId: process.env.VOUCHED_PUBLIC_KEY,
      callbackURL: `${process.env.API_BASE_URL}/webhook/vouched-id`,
      ...(session ? { token: session } : null),
      sandbox: process.env.VOUCHED_SANDBOX_MODE === 'true',

      type: 'idv',
      id: 'camera',
      face: 'camera',
      
      // mobile handoff settings
      crossDevice: true,
      crossDeviceQRCode: true,
      crossDeviceSMS: false,
      disableCssBaseline: true,

      onInit: ({token, job}: any) => {
        if (!session && token && job.id) {
          startKyc({
            ref: job.id,
            token,
          });
        }
      },
    
      // called when the verification is completed.
      onDone: (job: any) => {
        finishKyc({
          jobId: job.id,
          jobToken: job.token,
        });
      },
      
      // theme
      theme: {
        name: 'avant',
        handoffLinkColor: '#2A85FF',
        bgColor: '##ffffff',
      },
    };

    const existingScript = document.getElementById("vouched");
    if (!vouched.current || existingScript) {
      const script = document.createElement("script");
      script.src = "https://static.vouched.id/widget/vouched-2.0.0.js";
      script.id = "vouched";
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        vouched.current = window["Vouched"]({ ...config });
        vouched.current.mount("#vouched-element");
      };
    } else {
      vouched.current = window["Vouched"]({ ...config });
      vouched.current.mount("#vouched-element");
    }
  }, [session]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    loadVouched();
    return () => {
      if (vouched && vouched.current) {
        vouched.current.unmount("#vouched_element");
      }
    }
  }, [isOpen, loadVouched]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[99]" onClose={closeModal}>
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
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-h-[80vh] max-w-xl overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex flex-row items-center text-lg font-medium leading-6 text-gray-900">
                  <span>KYC</span>
                  <span className="ml-auto"></span>
                  <IconButton aria-label="edit" color="primary" onClick={onCancelButtonClick}>
                    <XIcon color='#2A85FF' width={20} height={20}></XIcon>
                  </IconButton>
                </Dialog.Title>
                <div className="mt-4">
                  <div id="vouched-element" className="flex items-center justify-center !max-h-full w-full min-h-[300px] h-full"></div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default KycDialog;