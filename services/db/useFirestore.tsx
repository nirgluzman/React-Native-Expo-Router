//
// useFirestore Custom Hook
//
// Hook to provide an interface for fetching and managing data from a Firestore collection.
// It encapsulates real-time updates, data fetching, loading state management, and error handling.
//

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object. In addition to a message string and stack trace, it contains a string code.
import { DocumentData } from 'firebase/firestore';

import { listenToCollection, getDocuments } from '../../services/db/db.service';

export const useFirestore = <T extends DocumentData>(collectionName: string, queryLimit: number = 0) => {
  const [firestoreData, setFirestoreData] = useState({
    data: [] as (T & { id: string })[], // array of data items fetched from Firestore, including their document IDs.
    isListening: false, // indicates whether the Firestore real-time listener is active.
    isFetching: false, // indicates whether a fetch operation is in progress (manually triggered, not from the real-time listener).
  });

  const handleFetchError = useCallback((err: Error) => {
    Alert.alert('Error', err instanceof FirebaseError ? err.message : 'An unexpected error occurred.');
  }, []);

  const handleFetch = useCallback(async () => {
    setFirestoreData((prev) => ({ ...prev, isFetching: true }));

    try {
      // fetch data from Firestore; this forces a server fetch, bypassing the local cache, to ensure up-to-date data.
      const fetchedData = await getDocuments<T>(collectionName, queryLimit);

      // update the 'data' state with the newly fetched data.
      setFirestoreData((prev) => ({
        ...prev,
        data: fetchedData,
        isFetching: false,
      }));
    } catch (err) {
      handleFetchError(err as Error);

      // reset the fetching state to false, indicating the fetch is complete (regardless of success or failure).
      setFirestoreData((prev) => ({ ...prev, isFetching: false }));
    }
  }, []); // empty dependency array since we're using functional updates.

  // set up a real-time listener for the collection in Firestore.
  useEffect(() => {
    try {
      const unsubscribeFromFirestore = listenToCollection<T>(
        collectionName,
        queryLimit,
        (items) => {
          setFirestoreData((prev) => ({
            ...prev,
            data: items,
            isListening: true, // real-time listener is active.
          }));
        },
        (err) => {
          // Handle Firestore listener errors.
          // These errors occur asynchronously during the onSnapshot listener's operation, and are not caught
          // by the initial try/catch block in the useEffect hook, which only handles errors during the listener's setup.
          handleFetchError(err);
          setFirestoreData((prev) => ({ ...prev, isListening: false }));
        }
      );
      return () => {
        unsubscribeFromFirestore();
        setFirestoreData((prev) => ({ ...prev, isListening: false })); // unmount
      };
    } catch (err) {
      // Handle synchronous errors during the initial setup of the Firestore listener.
      // This catch block will only capture errors thrown synchronously when listenToCollection is called.
      // Errors occurring later, during the onSnapshot listener's operation, are handled within the errorCallback provided to listenToCollection.

      handleFetchError(err as Error);
      setFirestoreData((prev) => ({ ...prev, isListening: false }));
    }
  }, []); // empty dependency array since this should only run once on mount

  return {
    data: firestoreData.data,
    isListening: firestoreData.isListening,
    isFetching: firestoreData.isFetching,
    onFetch: handleFetch,
  };
};
