
import { Fragment, useContext } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { InputLabel } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import { ToastContext } from "../../contexts/toast-context";
import { addAbout } from "../../apis/services/profile";
import { TypesToast } from "../../contexts/toast-reducer";
import Editor from "../Editor";

interface AddAboutMeProps {
  about: string | undefined,
  isOpen: boolean,
  closeModal: () => void,
  onCancelButtonClick: () => void,
  onSubmitted: (updated?: boolean) => void
}

const AddAboutMeDialog = ({
  about,
  isOpen,
  closeModal,
  onCancelButtonClick,
  onSubmitted
}: AddAboutMeProps) => {
  const formData = {
    about
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
                  {!!about ? 'Update About' : 'Add About'}
                </Dialog.Title>
                <div className="mt-4">
                  <Formik
                    initialValues={formData}
                    validate={values => {
                      const errors: any = {};
                      if (!values.about) {
                        errors.school = 'About is required';
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      let success = false;
                      setSubmitting(true)
                      addAbout(values).then((e) => {
                        success = true;
                        dispatchToast({
                          type: TypesToast.SHOW_TOAST,
                          payload: {
                            message: 'About has been added successfully',
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
                         <div className="w-full !mt-4">
                          <InputLabel shrink htmlFor="about" className="!block">
                            You can write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences.
                          </InputLabel>
                          {/* <ReactQuill id="about" defaultValue={values.about || ''} onChange={handleChange('about')} /> */}
                          <Editor name="about" onChange={handleChange('about')} fieldName="about" initialValue={values.about}></Editor>
                          <span className="text-rose-600 text-xs mt-1">{errors.about && touched.about && errors.about}</span>
                        </div>
                        
                        <div className="mt-6 flex">
                          <button type="button" onClick={() => handleCancelButtonClick()}
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <span className='ml-auto'></span>
                          <LoadingButton autoCapitalize="off" className="!capitalize bg-[#2A85FF]" type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                            {!!about ? 'Update About' : 'Add About'}
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

export default AddAboutMeDialog;
