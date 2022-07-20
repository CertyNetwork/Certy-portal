
import { Fragment, useContext, useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { Field } from "formik";

const Editor = ({name, initialValue, onChange}: any) => {
  let [currentValue, setCurrentValue] = useState<any>({
    ops: []
  })

  useEffect(() => {
    setCurrentValue(initialValue)
  }, [initialValue])

  const handleChange = (value) => {
    setCurrentValue(value)
    if (typeof(onChange) === 'function')
      onChange(value)
  }

  return (
    
       <div>
        <ReactQuill theme="snow"
          value={currentValue}
          onChange={handleChange}
        />
      </div>
  );
};

export default Editor;