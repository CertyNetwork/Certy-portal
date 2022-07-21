
import { Fragment, useContext } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { alpha, InputBase, InputLabel, MenuItem, Select, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from '@mui/material/FormControl';
import { updateOrganizationBasicInfo } from "../../apis/services/profile";
import { ToastContext } from "../../contexts/toast-context";
import { TypesToast } from "../../contexts/toast-reducer";
import { Formik } from "formik";
import { CompanyInfo } from "../../models/CompanyInfo";

interface BasicInfoProps {
  info: CompanyInfo | null,
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const BootstrapSelect = styled(Select)(({ theme }) => ({
  'label': {
    fontSize: '14px'
  },
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '&::before': {
    border: 'none !important',
  },
  '& .MuiSelect-select': {
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
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

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
  const companyInfo = {
    companyName: info?.companyName,
    email: info?.email,
    location: info?.location,
    organizationType: info?.organizationType,
    workingHours: info?.workingHours,
    organizationSize: info?.organizationSize,
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
                    initialValues={companyInfo}
                    validate={values => {
                      const errors: any = {};
                      if (!values.companyName) {
                        errors.companyName = 'Company name is required';
                      }
                      if (!values.email) {
                        errors.email = 'Email is required';
                      }
                      if (!values.location) {
                        errors.location = 'Location is required';
                      }
                      if (!values.organizationType) {
                        errors.organizationType = 'Please specify your company type';
                      }
                      if (!values.workingHours) {
                        errors.endDate = 'Please specify a working hour';
                      }
                      if (!values.organizationSize) {
                        errors.endDate = 'Please specify your organization\'s size';
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true)
                      let success = false;
                      updateOrganizationBasicInfo(values).then((e) => {
                        success = true;
                        dispatchToast({
                          type: TypesToast.SHOW_TOAST,
                          payload: {
                            message: 'The education has been added successfully',
                            type: 'success',
                          },
                        });
                      }).finally(() => {
                        setSubmitting(false)
                        onSubmitted(success);
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
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="companyName" required>
                            Company Name
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="companyName"
                            value={values.companyName || ''}
                            id="companyName" />
                          <span className="text-rose-600 text-xs mt-1">{errors.companyName && touched.companyName && errors.companyName}</span>
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
                          <InputLabel shrink htmlFor="organizationType" className="l-0" required>
                            Company Type
                          </InputLabel>
                          <BootstrapSelect
                            id="organizationType"
                            name="organizationType"
                            value={values.organizationType}
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={handleChange}
                          >
                            <MenuItem value={'product'} className="text-sm">Product Company</MenuItem>
                            <MenuItem value={'outsource'} className="text-sm">Outsource</MenuItem>
                          </BootstrapSelect>
                          <span className="text-rose-600 text-xs mt-1">{errors.organizationType && touched.organizationType && errors.organizationType}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="workingHours" required>
                            Working Hours
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.workingHours || ''}
                            name="workingHours"
                            id="workingHours" />
                          <span className="text-rose-600 text-xs mt-1">{errors.workingHours && touched.workingHours && errors.workingHours}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="organizationSize" required>
                            Organization Size
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.organizationSize || ''}
                            name="organizationSize"
                            id="organizationSize" />
                          <span className="text-rose-600 text-xs mt-1">{errors.organizationSize && touched.organizationSize && errors.organizationSize}</span>
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
