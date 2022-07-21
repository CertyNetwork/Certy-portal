
import { Fragment, useContext } from "react";
import dayjs from 'dayjs';
// import dynamic from 'next/dynamic';
import { Transition, Dialog } from "@headlessui/react";
import { alpha, InputBase, InputLabel, Select, MenuItem, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import FormControl from '@mui/material/FormControl';
import { addExperience } from '../../apis/services/profile'
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import 'react-quill/dist/quill.snow.css';
import { ToastContext } from "../../contexts/toast-context";
import { TypesToast } from "../../contexts/toast-reducer";
import { Experience } from "../../models/Experience";
import Editor from "../Editor";

interface ExperienceProps {
  ex: Experience | null,
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

const AddExperienceDialog = ({
  ex,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: ExperienceProps) => {
  const experience = {
    id: ex?.id,
    company: ex?.companyName,
    location: ex?.location,
    title: ex?.title,
    employmentType: ex?.employmentType,
    description: ex?.description,
    startDate: dayjs(ex?.startDate).locale('en').format('YYYY-MM-DD'),
    endDate: dayjs(ex?.endDate).locale('en').format('YYYY-MM-DD'),
  };

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
                  {ex?.id ? 'Update Work Experience' : 'Add Work Experience'}
                </Dialog.Title>
                <div className="mt-6">
                  <Formik
                    initialValues={experience}
                    validate={values => {
                      const errors: any = {};
                      if (!values.company) {
                        errors.company = 'Company is required';
                      }
                      if (!values.location) {
                        errors.location = 'Location is required';
                      }
                      if (!values.title) {
                        errors.title = 'Position is required';
                      }
                      if (!values.startDate) {
                        errors.startDate = 'Please specify a start time';
                      }
                      if (!values.endDate) {
                        errors.endDate = 'Please specify a end time';
                      }
                      if (!values.description) {
                        errors.description = 'Please provide a description';
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true)
                      let success = false;
                      addExperience(values).then((response) => {
                        success = true;
                        dispatchToast({
                          type: TypesToast.SHOW_TOAST,
                          payload: {
                            message: 'The experience has been added successfully',
                            type: 'success',
                          },
                        });
                      }).finally(() => {
                        setSubmitting(false)
                        onSubmitted(success)
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
                          <InputLabel shrink htmlFor="company" required>
                            Company/Organization
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.company}
                            name="company"
                            id="company" />
                          <span className="text-rose-600 text-xs mt-1">{errors.company && touched.company && errors.company}</span>
                        </FormControl>
                      
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="location" required>
                            Location
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.location}
                            name="location"
                            id="location" />
                          <span className="text-rose-600 text-xs mt-1">{errors.location && touched.location && errors.location}</span>
                        </FormControl>
                        
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="title" required>
                            Position
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="title"
                            value={values.title}
                            id="title" />
                          <span className="text-rose-600 text-xs mt-1">{errors.title && touched.title && errors.title}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="employmentType" className="l-0">
                            Employment Type
                          </InputLabel>
                          <BootstrapSelect
                            id="employmentType"
                            name="employmentType"
                            defaultValue={values.employmentType}
                            value={values.employmentType}
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={handleChange}
                          >
                            <MenuItem value={'full-time'} className="text-sm">Full Time</MenuItem>
                            <MenuItem value={'part-time'} className="text-sm">Part Time</MenuItem>
                            <MenuItem value={'self-employed'} className="text-sm">Self Employed</MenuItem>
                            <MenuItem value={'free-lance'} className="text-sm">Free Lance</MenuItem>
                            <MenuItem value={'internship'} className="text-sm">Internship</MenuItem>
                            <MenuItem value={'contract'} className="text-sm">Contract</MenuItem>
                          </BootstrapSelect>
                          <span className="text-rose-600 text-xs mt-1">{errors.employmentType && touched.employmentType && errors.employmentType}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-1/2 !mt-4 !pr-2">
                          <InputLabel shrink htmlFor="startDate" required>
                            From
                          </InputLabel>
                          <BootstrapInput
                            id="startDate"
                            name="startDate"
                            defaultValue={values.startDate}
                            onChange={handleChange}
                            type="date"
                          />
                          <span className="text-rose-600 text-xs mt-1">{errors.startDate && touched.startDate && errors.startDate}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-1/2 !mt-4 !pl-2">
                          <InputLabel shrink htmlFor="endDate" required>
                            To
                          </InputLabel>
                          <BootstrapInput
                            id="endDate"
                            name="endDate"
                            defaultValue={values.endDate}
                            onChange={handleChange}
                            type="date"
                          />
                          <span className="text-rose-600 text-xs mt-1">{errors.endDate && touched.endDate && errors.endDate}</span>
                        </FormControl>
                        
                        <div className="w-full !mt-4">
                          <InputLabel shrink htmlFor="description" className="!block" required>
                            Description
                          </InputLabel>
                          {/* <ReactQuill id="description" defaultValue={values.description || ''} onChange={handleChange('description')}/> */}
                          <Editor name="description" onChange={handleChange('description')} fieldName="description" initialValue={values.description}></Editor>
                          <span className="text-rose-600 text-xs mt-1">{errors.description && touched.description && errors.description}</span>
                        </div>
                        
                        <div className="mt-6 flex">
                          <button type="button" onClick={() => onCancelButtonClick()}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#FCFCFC] px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <span className='ml-auto'></span>
                          <LoadingButton autoCapitalize="off" className="!capitalize bg-[#2A85FF]" type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                            {ex?.id ? 'Update Work Experience' : 'Add Work Experience'}
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

export default AddExperienceDialog;
