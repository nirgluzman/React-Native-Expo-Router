//
// Service for interacting with Firebase Cloud Storage.
//
// Common storage operations such as uploading, deleting, and listing files, abstracting the direct Firebase Storage SDK calls.
//
// https://rnfirebase.io/storage/usage --> This method is deprecated !!!
// https://rnfirebase.io/reference/storage
// https://rnfirebase.io/migrating-to-v22
//

import { createContext, useContext, useCallback, type ReactNode } from 'react';

import storage from '@react-native-firebase/storage';

import { File } from 'expo-file-system/next';

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
        // // https://www.reddit.com/r/reactnative/comments/1k15xo8/can_i_create_a_blob_in_react_native/
        // // https://docs.expo.dev/versions/v53.0.0/sdk/filesystem-next/#uploading-files-using-expofetch
        // const file = new File(fileUri);
        // const blob = await file.blob(); // convert the response into a Blob object.

        const reference = storage().ref(path); // storage reference to not yet existing file
        await reference.putFile(fileUri); // upload file

        // return the public URL where the file can be accessed.
        const downloadURL = await reference.getDownloadURL();
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
    const fileRef = storage().ref(path); // reference to the file to delete.

    try {
      // delete the file.
      return await fileRef.delete();
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
