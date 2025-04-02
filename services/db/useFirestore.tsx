//
// useFirestore Custom Hook
//
// Hook to provide an interface for fetching and managing video data from a Firestore collection.
// It encapsulates real-time data listening, manual data refreshing, loading state management, and error handling.
//

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object. In addition to a message string and stack trace, it contains a string code.

import { type Video } from '../../types/video';
import { listenToCollection, getAllDocuments } from '../../services/db/db.service';

const collectionName = process.env.EXPO_PUBLIC_FIRESTORE_COLLECTION || '';

export const useFirestore = () => {
  // State object managing video data fetched from Firestore.
  // Encapsulates video items, loading, and refresh states into a single object to reduce multiple state updates to improve performance.
  const [firestoreData, setFirestoreData] = useState({
    videoItems: [] as (Video & { id: string })[], // array of Video items fetched from Firestore, including their document IDs.
    isListening: true, // indicates whether the Firestore listener is actively receiving updates.
    isPullToRefreshing: false, // indicates whether a pull-to-refresh operation is in progress.
  });

  const handleFetchError = useCallback((err: Error) => {
    Alert.alert('Error', err instanceof FirebaseError ? err.message : 'An unexpected error occurred.');
  }, []);

  const handlePullToRefresh = useCallback(async () => {
    setFirestoreData((prev) => ({ ...prev, isPullToRefreshing: true }));

    try {
      // fetch the latest video data from Firestore using getAllDocuments; this forces a server fetch, bypassing the local cache, to ensure up-to-date data.
      const refreshedVideos = await getAllDocuments<Video>(collectionName);

      // update the 'videoItems' state with the newly fetched data, triggering a re-render.
      setFirestoreData((prev) => ({
        ...prev,
        videoItems: refreshedVideos,
        isPullToRefreshing: false,
      }));
    } catch (err) {
      handleFetchError(err as Error);

      // reset the refreshing state to false, indicating the refresh is complete (regardless of success or failure).
      setFirestoreData((prev) => ({ ...prev, isPullToRefreshing: false }));
    }
  }, []); // empty dependency array since we're using functional updates.

  // set up a real-time listener for the "videos" collection in Firestore.
  useEffect(() => {
    // set isListening to `true` when starting to fetch from Firestore.
    setFirestoreData((prev) => ({ ...prev, isListening: true }));

    try {
      const unsubscribeFromFirestore = listenToCollection<Video>(
        collectionName,
        (videos) => {
          setFirestoreData((prev) => ({
            ...prev,
            videoItems: videos,
            isListening: false, // set isListening to `false` once data is received.
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
    videoItems: firestoreData.videoItems,
    isListening: firestoreData.isListening,
    isPullToRefreshing: firestoreData.isPullToRefreshing,
    onPullToRefresh: handlePullToRefresh,
  };
};
