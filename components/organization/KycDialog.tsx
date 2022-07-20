
import { Fragment, useContext, useState } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { alpha, InputBase, InputLabel, styled } from "@mui/material"
import { Formik } from "formik"
import * as Yup from 'yup'
import FormControl from '@mui/material/FormControl'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

import { ToastContext } from "../../contexts/toast-context";
import { TypesToast } from "../../contexts/toast-reducer";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label': {
    fontSize: '14px'
  },
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface KycDialogProps {
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const KycDialog = ({
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: KycDialogProps) => {
  const education = {
    email: '',
    contactName: '',
    organizationName: '',
    address: '',
    phoneNumber: ''
  };
  const validationObj = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Please enter a valid email'),
    contactName: Yup.string().required('Contact name is required'),
    organizationName: Yup.string().required('Organization name is required'),
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  const handleCancelButtonClick = () => {
    onCancelButtonClick();
  }

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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Organization Verification
                </Dialog.Title>
                <div className="mt-4">
                  <Formik
                    initialValues={education}
                    validationSchema={validationObj}
                    onSubmit={(values, { setSubmitting }) => {
                      let success = false;
                      setSubmitting(false)
                      onSubmitted(success);
                      const { organizationName, email, contactName, address, phoneNumber } = values;
                      const body = encodeURIComponent(`Hi, we would like to submit institution info as below:
              
                      Organization Name: ${organizationName}
                      Contact Email: ${email}
                      Contact Name: ${contactName}
                      Address: ${address}
                      Phone Number: ${phoneNumber}
                      
                      Thanks for your consideration!`);
                      window.open(`https://mail.google.com/mail/?view=cm&to=ceo@certy.network&su=Institution%20Kyc%20Submission&body=${body}`);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <FormControl variant="standard" className="w-full">
                          <InputLabel shrink htmlFor="email" required>
                            Email
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email || ''}
                            name="email"
                            id="email" />
                          <span className="text-rose-600 text-xs mt-1">{errors.email && touched.email && errors.email}</span>
                        </FormControl>
                      
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="contactName" required>
                            Contact Name
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contactName || ''}
                            name="contactName"
                            id="contactName" />
                          <span className="text-rose-600 text-xs mt-1">{errors.contactName && touched.contactName && errors.contactName}</span>
                        </FormControl>
                        
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="organizationName" required>
                            Organization Name
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.organizationName || ''}
                            name="organizationName"
                            id="organizationName" />
                          <span className="text-rose-600 text-xs mt-1">{errors.organizationName && touched.organizationName && errors.organizationName}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="address" required>
                            Address
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address || ''}
                            name="address"
                            id="address" />
                          <span className="text-rose-600 text-xs mt-1">{errors.address && touched.address && errors.address}</span>
                        </FormControl>

                        <FormControl variant="standard" className="!mt-4 w-full">
                          <InputLabel shrink htmlFor="phoneNumber" required>
                            Phone Number
                          </InputLabel>
                          <BootstrapInput
                            id="phoneNumber"
                            name="phoneNumber"
                            value={values.phoneNumber || null}
                            onChange={handleChange}
                          />
                          <span className="text-rose-600 text-xs mt-1">{errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}</span>
                        </FormControl>
                        
                        <div className="mt-6 flex">
                          <button type="button" onClick={handleCancelButtonClick}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#FCFCFC] px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <span className='ml-auto'></span>
                          <button type="submit" disabled={isSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#2A85FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
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
