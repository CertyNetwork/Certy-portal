import {
  createContext,
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
import { TypesToast } from './toast-reducer';
import { authenticationService } from '../apis/services/auth';
import { ToastContext } from './toast-context';


export const AuthContext = createContext<{
  isInitializing: boolean,
  connected: boolean,
  authenticated: boolean,
  getAccountId: () => string,
  login: () => void,
  logout: () => void,
}>({
  isInitializing: true,
  connected: false,
  authenticated: false,
  getAccountId: () => '',
  login: () => {},
  logout: () => {},
});

export const AuthProvider = (props) => {
  let [isInitializing, setIsInitializing] = useState(true);
  let [connected, setConnected] = useState(false);
  let [authenticated, setAuthenticated] = useState(authenticationService.isAuthenticated());

  const { dispatchToast } = useContext(ToastContext);

  const login = useCallback(() => {
    try {
      authenticationService.loginWithNear();
    } catch(e: any) {
      dispatchToast({
        type: TypesToast.SHOW_TOAST,
        payload: {
          message: e.message,
          type: 'error',
        },
      })
    }
    
  }, [dispatchToast]);

  const getAccountId = useCallback(() => {
    try {
      return authenticationService.getAccountId();
    } catch(e: any) {
      return '';
    }
    
  }, []);

  const logout = useCallback(() => {
    authenticationService.logout();
    setConnected(false)
    setAuthenticated(false)
  }, []);

  useEffect(() => {
    setIsInitializing(true)
    authenticationService.init().then(() => {
      setConnected(authenticationService.isConnected())
      setAuthenticated(authenticationService.isAuthenticated())
    }).finally(() => {
      setIsInitializing(false)
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      isInitializing,
      connected,
      authenticated,
      getAccountId,
      login,
      logout,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};
