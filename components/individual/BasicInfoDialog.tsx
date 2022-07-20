
import { Fragment, useContext } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { alpha, InputBase, InputLabel, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from '@mui/material/FormControl';
import { Formik } from "formik";
import { updateIndividualBasicInfo } from "../../apis/services/profile";
import { ToastContext } from "../../contexts/toast-context";
import { TypesToast } from "../../contexts/toast-reducer";
import { BasicInfo } from "../../models/BasicInfo";

interface BasicInfoProps {
  info: BasicInfo | null,
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

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

const BasicInfoDialog = ({
  info,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: BasicInfoProps) => {
  const experience = {
    displayName: info?.displayName,
    email: info?.email,
    location: info?.location,
    bio: info?.bio,
    linkedinLink: info?.linkedInLink,
    githubLink: info?.githubLink,
  };

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
                  Basic Information
                </Dialog.Title>
                <div className="mt-4">
                  <Formik
                    initialValues={experience}
                    validate={values => {
                      const errors: any = {};
                      if (!values.displayName) {
                        errors.displayName = 'Display name is required';
                      }
                      if (!values.email) {
                        errors.email = 'Email is required';
                      }
                      if (!values.location) {
                        errors.location = 'Location is required';
                      }
                      if (!values.bio) {
                        errors.bio = 'Please specify a introduction';
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      let success = false;
                      setSubmitting(true)
                      updateIndividualBasicInfo(values).then((e) => {
                        success = true;
                        dispatchToast({
                          type: TypesToast.SHOW_TOAST,
                          payload: {
                            message: 'Your info has been added successfully',
                            type: 'success',
                          },
                        });
                        onSubmitted(success);
                      }).catch((e: any) => {
                        dispatchToast({
                          type: TypesToast.SHOW_TOAST,
                          payload: {
                            message: e[0],
                            type: 'error',
                          },
                        });
                      }).finally(() => {
                        setSubmitting(false);
                      });
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <FormControl variant="standard" className="w-full">
                          <InputLabel shrink htmlFor="displayName" required>
                            Display name
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="displayName"
                            value={values.displayName || ''}
                            id="displayName" />
                          <span className="text-rose-600 text-xs mt-1">{errors.displayName && touched.displayName && errors.displayName}</span>
                        </FormControl>
                      
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="email" required>
                            Email
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="email"
                            value={values.email || ''}
                            id="email" />
                          <span className="text-rose-600 text-xs mt-1">{errors.email && touched.email && errors.email}</span>
                        </FormControl>
                        
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="location" required>
                            Location
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="location"
                            value={values.location || ''}
                            id="location" />
                          <span className="text-rose-600 text-xs mt-1">{errors.location && touched.location && errors.location}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="bio" className="!block" required>
                            Introduction
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="bio"
                            value={values.bio || ''}
                            id="bio" />
                          <span className="text-rose-600 text-xs mt-1">{errors.bio && touched.bio && errors.bio}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="linkedinLink">
                            Linkedin Link
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.linkedinLink || ''}
                            name="linkedinLink"
                            id="linkedinLink" />
                          <span className="text-rose-600 text-xs mt-1">{errors.linkedinLink && touched.linkedinLink && errors.linkedinLink}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="githubLink">
                            Github Link
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.githubLink || ''}
                            name="githubLink"
                            id="githubLink" />
                          <span className="text-rose-600 text-xs mt-1">{errors.githubLink && touched.githubLink && errors.githubLink}</span>
                        </FormControl>
                        
                        <div className="mt-6 flex">
                          <button type="button" onClick={handleCancelButtonClick}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#FCFCFC] px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <span className='ml-auto'></span>
                          <LoadingButton autoCapitalize="off" className="!capitalize bg-[#2A85FF]" type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                            Update Info
                          </LoadingButton>
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

export default BasicInfoDialog;
