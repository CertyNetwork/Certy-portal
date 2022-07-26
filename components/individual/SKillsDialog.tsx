
import { Fragment, useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { alpha, Chip, InputBase, styled, IconButton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Field, Formik } from "formik";
import FormControl from '@mui/material/FormControl';
import { XIcon } from '@heroicons/react/outline';
import { addSkills } from "../../apis/services/profile";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface AddSkillsDialogProps {
  skills: string[],
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
};

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

const AddSkillsDialog = ({
  skills,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: AddSkillsDialogProps) => {
  const payload = {
    skill: ''
  };

  const [userSkills, setUserSkills] = useState(skills);

  useEffect(() => {
    if (isOpen) {
      setUserSkills(skills)
    }
  }, [isOpen, skills]);

  const handleCancelButtonClick = () => {
    onCancelButtonClick();
  }

  const handleSkillDelete = (skillToDelete: string) => () => {
    setUserSkills((userSkills) => userSkills.filter((sk) => sk !== skillToDelete));
  };

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
                  <span>Add Skills</span>
                  <span className="ml-auto"></span>
                  <IconButton aria-label="edit" color="primary" onClick={() => onCancelButtonClick()}>
                    <XIcon color='#2A85FF' width={20} height={20}></XIcon>
                  </IconButton>
                </Dialog.Title>
                <div className="mt-4">
                  <Formik
                    initialValues={payload}
                    validate={values => {
                      const errors: any = {};
                      if (userSkills.findIndex(sk => sk.toLocaleLowerCase() === values.skill.toLocaleLowerCase()) >= 0) {
                        errors.skill = 'This skill already exists';
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true);
                      const finalSkills = [...userSkills, values.skill?.trim()].filter(sk => !!sk);
                      addSkills({skills: finalSkills}).then((e) => {
                        // console.log(e);
                      }).finally(() => {
                        setSubmitting(false)
                        onSubmitted(true);
                      });
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                      handleBlur,
                      isValid,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="my-4 flex flex-row space-x-2">
                          {userSkills.map(sk => (<Chip
                            key={sk}
                            label={sk}
                            onDelete={handleSkillDelete(sk)}
                          />))}
                        </div>
                        
                        <FormControl variant="standard" className="w-full">
                          <BootstrapInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="skill"
                            defaultValue={values.skill}/>
                          <span className="text-rose-600 text-xs mt-1">{errors.skill && touched.skill && errors.skill}</span>
                        </FormControl>
                        
                        <div className="mt-6 flex">
                          <button type="button" onClick={() => handleCancelButtonClick()}
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <span className='ml-auto'></span>
                          <LoadingButton type="submit" className="!capitalize bg-[#2A85FF]" variant="contained" disabled={!isValid} loading={isSubmitting}>
                            {!skills.length ? 'Add Skills' : 'Update Skills'}
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

export default AddSkillsDialog;
