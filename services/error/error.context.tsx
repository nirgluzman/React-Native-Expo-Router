//
// Global error management context for the application.
//

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// subclass of the standard JavaScript Error object, with a 'code' property for specific Firebase errors.
import { FirebaseError } from '@firebase/util';

// import the user-friendly error mappings from the new file
import {
  userFriendlyAuthErrorMap,
  userFriendlyFirestoreErrorMap,
  userFriendlyStorageErrorMap,
} from './firebaseErrorMapping';

interface ErrorContextType {
  hasError: boolean;
  displayError: {
    title?: string; // optional title (e.g., "Authentication Error", "Database Error").
    message: string; // user-friendly message.
    code?: string; // optional technical code.
    details?: string; // optional more technical details (e.g., original SDK message).
  } | null;
  handleError: (error: unknown, options?: { userMessage?: string }) => void;
  clearError: () => void;
}

// create the context; using 'undefined' enforces provider usage and prevents accidental context access without it.
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorContextProvider = ({ children }: { children: ReactNode }) => {
  const [errorState, setErrorState] = useState<{
    raw: unknown;
    display: ErrorContextType['displayError'];
  } | null>(null);

  const handleError = useCallback((err: unknown, options?: { userMessage?: string }) => {
    let displayInfo: ErrorContextType['displayError'] = null;

    if (err instanceof FirebaseError) {
      const firebaseCode = err.code; // e.g., "auth/user-not-found", "firestore/permission-denied".
      const firebaseMessage = err.message;
      const [serviceId] = firebaseCode.split('/', 1); // get just the service prefix.

      let userMessage = options?.userMessage; // start with potential custom message.
      let title = 'Firebase Error'; // default title.

      // determine service and look up specific message.
      switch (serviceId) {
        case 'auth':
          // userMessage = userFriendlyAuthErrorMap[firebaseCode] || userMessage;
          userMessage = firebaseMessage || userMessage;
          title = 'Authentication Error';
          break;
        case 'firestore':
          // userMessage = userFriendlyFirestoreErrorMap[firebaseCode] || userMessage;
          userMessage = firebaseMessage || userMessage;
          title = 'Database Error';
          break;
        case 'storage':
          // userMessage = userFriendlyStorageErrorMap[firebaseCode] || userMessage;
          userMessage = firebaseMessage || userMessage;
          title = 'Storage Error';
          break;

        // add cases for other Firebase services (e.g., 'functions').

        default:
          // Code structure not recognized or service not mapped.
          console.warn(`Unrecognized Firebase service ID or code format: ${firebaseCode}`);
          // fallback will use the custom message if provided, otherwise default generic message.
          break;
      }

      // final display message fallback if no specific or custom message was found.
      const finalUserMessage = userMessage || `An unexpected error occurred (${firebaseCode}).`;

      displayInfo = {
        title: title,
        message: finalUserMessage,
        code: firebaseCode, // always include the technical code.
        details: err.message, // original SDK message as details.
      };
    } else if (err instanceof Error) {
      displayInfo = {
        title: 'An Error Occurred',
        message: options?.userMessage || err.message || 'Something went wrong.', // use custom, original, or generic.
        details: err.message,
      };
    } else {
      displayInfo = {
        title: 'An Unknown Error Occurred',
        message: options?.userMessage || 'An unexpected error occurred.', // use custom or generic.
        details: String(err), // convert unknown to string for details.
      };
    }

    setErrorState({ raw: err, display: displayInfo });
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const contextValue: ErrorContextType = {
    hasError: errorState !== null,
    displayError: errorState?.display ?? null,
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
