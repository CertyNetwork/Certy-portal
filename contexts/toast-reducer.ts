import { ReactNode } from 'react';
import { Severity } from './toast-context';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum TypesToast {
  SHOW_TOAST = 'SHOW_TOAST',
  CLOSE_TOAST = 'CLOSE_TOAST',
}

type ToastPayload = {
  [TypesToast.SHOW_TOAST]: {
    message: string | ReactNode | JSX.Element | JSX.Element[];
    type: Severity;
  };
  [TypesToast.CLOSE_TOAST]: {
    open: boolean;
  };
};

export type toastActions =
  ActionMap<ToastPayload>[keyof ActionMap<ToastPayload>];

export const toastReducer = (state, action: toastActions) => {
  switch (action.type) {
    case TypesToast.SHOW_TOAST:
      return {
        ...state,
        open: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    case TypesToast.CLOSE_TOAST:
      return {
        ...state,
        open: action.payload.open,
        message: '',
        type: 'success' as Severity,
      };
    default:
      return state;
  }
};
