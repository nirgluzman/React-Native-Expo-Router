//
// Authentication context for managing authentication state and logic for the application.
//

import { useState, useEffect, createContext, type ReactNode } from 'react';

import { type User as FirebaseUser } from 'firebase/auth';
import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object. In addition to a message string and stack trace, it contains a string code.

import { listenAuthState, signInRequest, signUpRequest, logoutRequest } from './auth.service';

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

// create context with proper typing and default value.
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  onSignIn: async () => {
    throw new Error('Cannot use onSignIn without AuthProvider');
  },
  onSignUp: async () => {
    throw new Error('Cannot use onSignUp without AuthProvider');
  },
  onLogout: async () => {
    throw new Error('Cannot use onLogout without AuthProvider');
  },
  idToken: null,
  isLoading: false,
});

// format a Firebase Authentication error message.
// https://firebase.google.com/docs/reference/js/auth#autherrorcodes (AuthErrorCodes)
function formatAuthErrorMessage(errorMessage: string) {
  return errorMessage
    .replace('auth/', '')
    .replace(/-/g, ' ')
    .replace(/^./, (char: string) => char.toUpperCase());
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: currentUser } = await signInRequest(email, password);
      setUser(currentUser);
      setIdToken(await currentUser.getIdToken());
      return { success: true, message: 'Sign in was successful' };
    } catch (err) {
      if (err instanceof FirebaseError) {
        return { success: false, message: formatAuthErrorMessage(err.code) };
      } else {
        return { success: false, message: 'An unexpected error occurred' };
      }
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
      if (err instanceof FirebaseError) {
        return { success: false, message: formatAuthErrorMessage(err.code) };
      } else {
        return { success: false, message: 'An unexpected error occurred' };
      }
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
      return { success: true };
    } catch (err) {
      if (err instanceof FirebaseError) {
        return { success: false, message: err.message };
      } else {
        return { success: false, message: 'An unexpected error occurred' };
      }
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        onSignIn,
        onSignUp,
        onLogout,
        idToken,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
