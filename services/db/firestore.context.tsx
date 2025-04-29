//
// Firestore context for fetching and managing data from a Firestore collection.
// It encapsulates real-time updates, data fetching, loading state management, and error handling.
//

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

import { DocumentData, OrderByDirection, WhereFilterOp } from 'firebase/firestore';

import {
  listenToCollectionService,
  getDocumentService,
  getDocumentsService,
  getTrendingDocumentsService,
  getFilteredAndOrderedDocumentsService,
  addDocumentService,
  updateDocumentFieldsService,
  deleteDocumentService,
  QueryOptions,
} from './firestore.service';

// imports the custom hook for accessing the global error management context.
import { useErrorContext } from '../error/error.context';

// define context types
interface FirestoreContextType<T extends DocumentData> {
  // data state
  documents: Array<T & { id: string }>;
  filteredDocuments: Array<T & { id: string }>;
  trendingDocuments: Array<T & { id: string }>;

  // loading states
  isListening: boolean; // indicates whether the Firestore real-time listener is active.
  isLoading: boolean; // indicates whether an Firestore CRUD operation is in progress.

  // collection operations
  startListener: (options: QueryOptions<T>) => void;
  stopListener: () => void;

  // document operations
  refreshCollection: (options: QueryOptions<T>) => Promise<void>;
  refreshDocument: (documentId: string, forceServerFetch: boolean) => Promise<(T & { id: string }) | undefined>;
  getTrendingDocuments: (trendingField: string, count: number) => Promise<void>;
  getFilteredAndOrderedDocuments: (
    filter: { field: string; operator: WhereFilterOp; value: any },
    sortBy: { field: string; direction: OrderByDirection },
    queryLimit: number
  ) => Promise<(T & { id: string })[] | undefined>;
  addDocument: (data: T) => Promise<void>;
  updateDocument: (documentId: string, data: T) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;

  // filtering
  filterBySubstring: (field: string, substring: string) => void;
  clearFilters: () => void;
}

// create the context
// using 'undefined' enforces provider usage and prevents accidental context access without it.
const FirestoreContext = createContext<FirestoreContextType<any> | undefined>(undefined);

// provider component
export const FirestoreContextProvider = <T extends DocumentData>({
  children,
  collectionName, // Firestore collection to interact with.
}: {
  children: ReactNode;
  collectionName: string;
}) => {
  // state management
  const [documents, setDocuments] = useState<Array<T & { id: string }>>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Array<T & { id: string }>>([]);
  const [trendingDocuments, setTrendingDocuments] = useState<Array<T & { id: string }>>([]);

  // loading states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // collection tracking
  const [listenerUnsubscribe, setListenerUnsubscribe] = useState<(() => void) | null>(null);
  const [listenerOptions, setListenerOptions] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<{ field: string; substring: string } | null>(null);

  // obtain the function responsible for updating the global error state.
  const { handleError } = useErrorContext();

  // Effect to handle filtering when documents or filter options change.
  useEffect(() => {
    if (!filterOptions) {
      setFilteredDocuments(documents);
      return;
    }

    const { field, substring } = filterOptions;
    if (!field || !substring) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter((doc) => {
      const fieldValue = doc[field];
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(substring.toLowerCase());
      }
      return false;
    });

    setFilteredDocuments(filtered);
  }, [documents, filterOptions]);

  // start a real-time listener for the collection in Firestore.
  const startListener = useCallback(
    (options: QueryOptions<T> = {}) => {
      // clean up any existing listener
      if (listenerUnsubscribe) {
        listenerUnsubscribe();
      }

      setIsListening(false);
      setListenerOptions(options);

      try {
        const unsubscribe = listenToCollectionService<T>(
          collectionName,
          (data) => {
            setDocuments(data);
            setIsListening(true);
          },
          options,
          (err) => {
            // Firestore listener errors - these errors occur asynchronously during the onSnapshot listener's operation,
            // and are not caught by try/catch block, which only handles errors during the listener's setup.
            setIsListening(false);
            handleError(err); // start real-time listener.
          }
        );

        setListenerUnsubscribe(() => unsubscribe);
      } catch (err) {
        setIsListening(false);
        handleError(err); // setting up real-time listener.
      }
    },
    [listenerUnsubscribe]
  );

  // stop the active listener
  const stopListener = useCallback(() => {
    if (listenerUnsubscribe) {
      listenerUnsubscribe();
      setListenerUnsubscribe(null);
    }
    setListenerOptions(null);
  }, [listenerUnsubscribe]);

  // replace the current collection data with a fresh fetch from Firestore (non-realtime operation).
  const refreshCollection = useCallback(
    async (options: QueryOptions<T> = {}) => {
      setIsLoading(true);

      try {
        const mergedOptions = { ...listenerOptions, ...options };
        const { data: fetchedDocs } = await getDocumentsService<T>(collectionName, mergedOptions);

        if (fetchedDocs) {
          // replace the documents in local state.
          setDocuments(fetchedDocs);
        }
      } catch (err) {
        handleError(err);
      } finally {
        // reset the fetching state to false, indicating the fetch is complete (regardless of success or failure).
        setIsLoading(false);
      }
    },
    [listenerOptions]
  );

  // fetch a specific document by its ID and updates the local collection.
  const refreshDocument = useCallback(async (documentId: string, forceServerFetch: boolean = true) => {
    setIsLoading(true);

    try {
      const fetchedDoc = await getDocumentService<T>(collectionName, documentId, forceServerFetch);

      if (fetchedDoc) {
        // update the document in local state if it exists.
        setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? fetchedDoc : doc)));
      }
      setIsLoading(false);
      return fetchedDoc;
    } catch (err) {
      handleError(err);
      setIsLoading(false);
      return undefined;
    }
  }, []);

  // fetch trending documents based on a specified field and count.
  const getTrendingDocuments = useCallback(async (trendingField: string, count: number) => {
    setIsLoading(true);

    try {
      const trendingDocs = await getTrendingDocumentsService<T>(collectionName, trendingField, count);
      setTrendingDocuments(trendingDocs);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // fetch documents with specific filtering and sorting options.
  const getFilteredAndOrderedDocuments = useCallback(
    async (
      filter: { field: string; operator: WhereFilterOp; value: any },
      sortBy: {
        field: string;
        direction: OrderByDirection;
      },
      queryLimit: number
    ) => {
      setIsLoading(true);

      try {
        const fetchedDocs = await getFilteredAndOrderedDocumentsService<T>(collectionName, filter, sortBy, queryLimit);
        setIsLoading(false);
        return fetchedDocs;
      } catch (err) {
        handleError(err);
        setIsLoading(false);
        return undefined;
      }
    },
    []
  );

  // add a new document.
  const addDocument = useCallback(async (data: T) => {
    setIsLoading(true);

    try {
      await addDocumentService<T>(collectionName, data);
    } catch (err) {
      handleError(err);
    } finally {
      // reset the fetching state to false, indicating the fetch is complete (regardless of success or failure).
      setIsLoading(false);
    }
  }, []);

  // update an existing document.
  const updateDocument = useCallback(async (documentId: string, data: T) => {
    setIsLoading(true);

    try {
      await updateDocumentFieldsService<T>(collectionName, documentId, data);
    } catch (err) {
      handleError(err);
    } finally {
      // reset the fetching state to false, indicating the fetch is complete (regardless of success or failure).
      setIsLoading(false);
    }
  }, []);

  // delete a document.
  const deleteDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);

    try {
      await deleteDocumentService<T>(collectionName, documentId);
    } catch (err) {
      handleError(err);
    } finally {
      // reset the fetching state to false, indicating the fetch is complete (regardless of success or failure).
      setIsLoading(false);
    }
  }, []);

  // filter documents by substring.
  const filterBySubstring = useCallback((field: string, substring: string) => {
    setFilterOptions({ field, substring });
  }, []);

  // clear all filters.
  const clearFilters = useCallback(() => {
    setFilterOptions(null);
  }, []);

  // clean up on unmount.
  useEffect(() => {
    return () => {
      if (listenerUnsubscribe) {
        listenerUnsubscribe();
      }
    };
  }, [listenerUnsubscribe]);

  // Context value.
  const contextValue: FirestoreContextType<T> = {
    documents,
    filteredDocuments,
    trendingDocuments,
    isListening,
    isLoading,
    startListener,
    stopListener,
    refreshCollection,
    refreshDocument,
    getTrendingDocuments,
    getFilteredAndOrderedDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    filterBySubstring,
    clearFilters,
  };

  return <FirestoreContext.Provider value={contextValue}>{children}</FirestoreContext.Provider>;
};

// custom hook for using the Firestore context.
export const useFirestoreContext = <T extends DocumentData>() => {
  const context = useContext(FirestoreContext);

  // check if the context is available.
  if (context === undefined) {
    throw new Error('useFirestoreContext must be used within a FirestoreContextProvider');
  }
  return context as FirestoreContextType<T>;
};
