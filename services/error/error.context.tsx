//
// Global error management context for the application.
//

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object, with a 'code' property for specific Firebase errors.

// format the Firebase error code.
// https://firebase.google.com/docs/reference/js/auth#autherrorcodes (AuthErrorCodes)
function formatFirebaseErrorCode(code: string) {
  return code.replace('auth/', '').replace(/-/g, ' ');
}

interface ErrorContextType {
  hasError: boolean;
  isFirebaseError: boolean;
  error: FirebaseError | Error | null;
  errorMessage: string | null; // user-friendly message.
  handleError: (error: unknown, operation: string) => void;
  clearError: () => void;
}

// create the context; using 'undefined' enforces provider usage and prevents accidental context access without it.
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorContextProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<FirebaseError | Error | null>(null);

  const handleError = useCallback((err: unknown, customMessage: string) => {
    setError(err instanceof FirebaseError ? err : new Error(`${customMessage}`));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const errorMessage =
    error instanceof FirebaseError
      ? `Firebase error (${formatFirebaseErrorCode(error.code)}): ${error.message}`
      : error?.message ?? null;

  const contextValue: ErrorContextType = {
    hasError: error !== null,
    isFirebaseError: error instanceof FirebaseError,
    error,
    errorMessage,
    handleError,
    clearError,
  };

  return <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>;
};

// custom hook for using the Error context
export const useErrorContext = () => {
  const context = useContext(ErrorContext);

  // check if the context is available.
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorContextProvider');
  }
  return context as ErrorContextType;
};
