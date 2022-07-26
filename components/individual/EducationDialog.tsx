
import { Fragment, useContext } from "react";
import dayjs from 'dayjs';
import { Transition, Dialog } from "@headlessui/react";
import { alpha, InputBase, InputLabel, Select, styled, TextField, IconButton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import FormControl from '@mui/material/FormControl';
import { XIcon } from '@heroicons/react/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

import { addEducation } from "../../apis/services/profile";
import { ToastContext } from "../../contexts/toast-context";
import { TypesToast } from "../../contexts/toast-reducer";
import { Education } from "../../models/Education";
import Editor from "../Editor";

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

const BootstrapTextField = styled(TextField)(({ theme }) => ({
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

interface EducationProps {
  ed: Education | null,
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const AddEducationDialog = ({
  ed,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: EducationProps) => {
  const education = {
    id: ed?.id,
    school: ed?.school,
    degree: ed?.degree,
    fieldOfStudy: ed?.fieldOfStudy,
    grade: ed?.grade,
    description: ed?.description,
    startDate: dayjs(ed?.startDate).locale('en').format('YYYY-MM-DD'),
    endDate: dayjs(ed?.endDate).locale('en').format('YYYY-MM-DD'),
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
                <Dialog.Title as="div" className="flex items-center text-lg font-medium leading-6 text-gray-900">
                  <span>{ed?.id ? 'Update Education' : 'Add Education'}</span>
                  <span className="ml-auto"></span>
                  <IconButton aria-label="edit" color="primary" onClick={() => onCancelButtonClick()}>
                    <XIcon color='#2A85FF' width={20} height={20}></XIcon>
                  </IconButton>
                </Dialog.Title>
                <div className="mt-4">
                  <Formik
                    initialValues={education}
                    validate={values => {
                      const errors: any = {};
                      if (!values.school) {
                        errors.school = 'School is required';
                      }
                      if (!values.degree) {
                        errors.degree = 'Degree is required';
                      }
                      if (!values.fieldOfStudy) {
                        errors.fieldOfStudy = 'Field of study is required';
                      }
                      if (!values.startDate) {
                        errors.startDate = 'Please specify a start time';
                      }
                      if (!values.endDate) {
                        errors.endDate = 'Please specify a end time';
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true)
                      let success = false
                      addEducation(values).then((e) => {
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
                          <InputLabel shrink htmlFor="school" required>
                            School
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.school || ''}
                            name="school"
                            id="school" />
                          <span className="text-rose-600 text-xs mt-1">{errors.school && touched.school && errors.school}</span>
                        </FormControl>
                      
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="degree" required>
                            Degree
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.degree || ''}
                            name="degree"
                            id="degree" />
                          <span className="text-rose-600 text-xs mt-1">{errors.degree && touched.degree && errors.degree}</span>
                        </FormControl>
                        
                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="fieldOfStudy" required>
                            Field of study
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.fieldOfStudy || ''}
                            name="fieldOfStudy"
                            id="fieldOfStudy" />
                          <span className="text-rose-600 text-xs mt-1">{errors.fieldOfStudy && touched.fieldOfStudy && errors.fieldOfStudy}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-full !mt-4">
                          <InputLabel shrink htmlFor="grade">
                            Grade
                          </InputLabel>
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.grade || ''}
                            name="grade"
                            id="grade" />
                          <span className="text-rose-600 text-xs mt-1">{errors.grade && touched.grade && errors.grade}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-1/2 !mt-4 !pr-2">
                          <InputLabel shrink htmlFor="startDate" required>
                            From
                          </InputLabel>
                          <BootstrapTextField
                            id="startDate"
                            name="startDate"
                            defaultValue={values.startDate || null}
                            onChange={handleChange}
                            type="date"
                          />
                          <span className="text-rose-600 text-xs mt-1">{errors.startDate && touched.startDate && errors.startDate}</span>
                        </FormControl>

                        <FormControl variant="standard" className="w-1/2 !mt-4 !pl-2">
                          <InputLabel shrink htmlFor="endDate" required>
                            To
                          </InputLabel>
                          <BootstrapTextField
                            id="endDate"
                            name="endDate"
                            type="date"
                            defaultValue={values.endDate || null}
                            onChange={handleChange}
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
                            {ed?.id ? 'Update Education' : 'Add Education'}
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

export default AddEducationDialog;
