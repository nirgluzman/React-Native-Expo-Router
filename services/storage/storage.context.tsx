//
// Service for interacting with Firebase Cloud Storage.
//
// Common storage operations such as uploading, deleting, and listing files, abstracting the direct Firebase Storage SDK calls.
//
// https://rnfirebase.io/auth/usage
// https://firebase.google.com/docs/storage/web/start
// https://github.com/expo/examples/tree/master/with-firebase-storage-upload
//

import { createContext, useContext, useCallback, type ReactNode } from 'react';

import { storage } from '../../config/firebase/firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from '@react-native-firebase/storage';

// https://docs.expo.dev/versions/latest/sdk/expo/#api
import { fetch } from 'expo/fetch';

import { useErrorContext } from '../error/error.context';

interface StorageContextType {
  uploadFile: (fileUri: string, mimeType: string | undefined, path: string) => Promise<string | null>;
  deleteFile: (path: string) => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageContextProvider = ({ children }: { children: ReactNode }) => {
  const { handleError } = useErrorContext();

  // upload a file from a local URI to Firebase Storage at a specified path.
  const uploadFile = useCallback(
    async (
      fileUri: string, // local file uri to upload.
      mimeType: string | undefined, // MIME type of the file being uploaded.
      path: string // string representing where the file should be stored.
    ) => {
      try {
        const fetchResult = await fetch(fileUri); // retrieve the file located at fileUri.
        const blob = await fetchResult.blob(); // convert the response into a Blob object.

        // upload to Firebase/Storage.
        const fileRef = storageRef(storage, path); // reference to where the file will be stored.
        const snapshot = await uploadBytes(fileRef, blob); // upload the file.

        // return the public URL where the file can be accessed.
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (err) {
        handleError(err);
        console.log('err: ', err);
        return null;
      }
    },
    []
  );

  // delete a file from Firebase Storage given its path.
  const deleteFile = useCallback(async (path: string) => {
    const fileRef = storageRef(storage, path); // reference to the file to delete.

    try {
      // delete the file.
      return await deleteObject(fileRef);
    } catch (err) {
      handleError(err);
    }
  }, []);

  const contextValue: StorageContextType = {
    uploadFile,
    deleteFile,
  };

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>;
};

// custom hook for using the Storage context
export const useStorageContext = () => {
  const context = useContext(StorageContext);

  // check if the context is available.
  if (context === undefined) {
    throw new Error('useStorageContext must be used within an ErrorContextProvider');
  }
  return context as StorageContextType;
};
