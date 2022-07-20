import {
  createContext,
  Dispatch,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { toastActions, toastReducer, TypesToast } from './toast-reducer';

export type Severity = 'success' | 'error' | 'warning' | 'info';

const initialState = {
  open: false,
  message: '',
  type: 'success' as Severity,
};
type InitialStateType = {
  open: boolean;
  message: string | ReactNode | JSX.Element | JSX.Element[];
  type: Severity;
};

export const ToastContext = createContext<{
  stateToast: InitialStateType;
  dispatchToast: Dispatch<toastActions>;
}>({
  stateToast: initialState,
  dispatchToast: () => null,
});

const mainReducer = ({ open }: InitialStateType, action: toastActions) =>
  toastReducer(open, action);

export const ToastContextProvider = (props) => {
  const [stateToast, dispatchToast] = useReducer(mainReducer, initialState);
  const handleClose = useCallback(() => {
    dispatchToast({
      type: TypesToast.CLOSE_TOAST,
      payload: {
        open: false,
      },
    });
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [handleClose, stateToast.open]);

  return (
    <ToastContext.Provider value={{ stateToast, dispatchToast }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={stateToast.open}
      >
        <Alert
          onClose={handleClose}
          severity={stateToast.type}
          sx={{ width: '100%' }}
        >
          {stateToast.message}
        </Alert>
      </Snackbar>
      {props.children}
    </ToastContext.Provider>
  );
};
