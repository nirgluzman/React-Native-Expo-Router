//
// Authentication context for managing authentication state and logic for the application.
//

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

import { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object. In addition to a message string and stack trace, it contains a string code.

// imports the custom hook for accessing the global error management context.
import { useErrorContext } from '../error/error.context';

import { listenAuthState, signInRequest, signUpRequest, logoutRequest } from './auth.service';

type FirebaseUser = FirebaseAuthTypes.User;

// define the context value type.
type AuthContextType = {
  user: FirebaseUser | null; // storing the authenticated user information.
  isAuthenticated: boolean; // boolean flag indicating authentication status.
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onSignUp: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onLogout: () => Promise<{ success: boolean; message?: string }>;
  idToken: string | null; // storing authentication token.
  isLoading: boolean; // tracking authentication state changes.
};

// create the context.
// using 'undefined' enforces provider usage and prevents accidental context access without it.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // obtain the function responsible for updating the global error state.
  const { handleError } = useErrorContext();

  const onSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: currentUser } = await signInRequest(email, password);
      setUser(currentUser);
      setIdToken(await currentUser.getIdToken());
      return { success: true, message: 'Sign in was successful' };
    } catch (err) {
      handleError(err);
      return { success: false, message: (err as FirebaseError).message };
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: currentUser } = await signUpRequest(username, email, password);
      setUser(currentUser);
      setIdToken(await currentUser.getIdToken());
      return { success: true, message: 'Sign up was successful' };
    } catch (err) {
      handleError(err);
      return { success: false, message: (err as FirebaseError).message };
    } finally {
      setIsLoading(false);
    }
  };

  const onLogout = async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
      setUser(null);
      setIdToken(null);
      return { success: true, message: 'Logout was successful' };
    } catch (err) {
      handleError(err);
      return { success: false, message: (err as FirebaseError).message };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // subscribe to the users current authentication state, and receive an event whenever that state changes.
    const unsubscribe = listenAuthState(async (currentUser) => {
      setUser(currentUser); // update user state with the currentUser object received from the authentication listener (onAuthStateChanged).
      setIsAuthenticated(!!currentUser);
      if (currentUser) {
        setIdToken(await currentUser.getIdToken());
      } else {
        setIdToken(null);
      }
    });

    return () => {
      unsubscribe(); // unsubscribe when the component is unmounted (cleanup mechanism).
    };

    // The authentication listener (onAuthStateChanged) itself is designed to handle subsequent authentication state changes.
    // Therefore, the dependency array should be empty.
  }, []);

  // context value.
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    onSignIn,
    onSignUp,
    onLogout,
    idToken,
    isLoading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// custom hook for using Auth context.
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  // check if the context is available.
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }

  return context as AuthContextType;
};
