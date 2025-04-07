//
// Database service:
// This file encapsulates Firebase/Firestore methods for data management.
//

import { db } from '../../config/firebase/firebaseConfig';

import {
  // Document References (Pointers to Documents)
  doc, // Create a DocumentReference.
  DocumentReference, // Type: Document location in Firestore.

  // Collection References (Pointers to Collections)
  collection,
  CollectionReference,

  // Document Operations (Single Document)
  getDoc, // Fetch a single document from the server.
  getDocFromCache, // Fetch a single document from the local cache.
  setDoc, // Create or overwrite a document.
  updateDoc, // Update specific fields in a document.
  deleteDoc, // Delete a document.
  addDoc, // Add a new document to a collection (auto-generated ID).

  // Query Operations (Multiple Documents)
  query, // Create a query with constraints.
  getDocs, // Fetch multiple documents from the server.
  getDocsFromCache, // Fetch multiple documents from the local cache.

  // Query Constraints (Filter & Order)
  where, // Filter documents based on conditions.
  orderBy, // Sort documents.
  limit, // Limit the number of documents.
  startAfter, // Paginate: Start after a specific document.
  endBefore, // Paginate: End before a specific document.

  // Realtime Updates
  onSnapshot, // Listen for realtime document changes.

  // Data Types & Snapshots
  DocumentSnapshot, // Metadata & data of a single document.
  DocumentData, // The raw data of a document (key-value pairs).
  QuerySnapshot, // Results of a query (multiple documents).
  QueryDocumentSnapshot, // Data of a single document in a query result.

  // Query Configuration Types
  OrderByDirection, // 'asc' or 'desc' for sorting.
  WhereFilterOp, // Operators for filtering (e.g., '==', '>', '<').
  QueryConstraint, // Generic query constraint type.
} from 'firebase/firestore';

import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object (in addition to a message string and stack trace, it contains a string code).

// type definitions for query options.
export interface QueryOptions<T extends DocumentData | null> {
  // ordering.
  orderByField?: string;
  orderDirection?: OrderByDirection;

  // pagination.
  limit?: number;
  startAfterDoc?: DocumentSnapshot<T>;
  endBeforeDoc?: DocumentSnapshot<T>;

  // filtering.
  whereConditions?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>;

  // cache settings.
  forceServerFetch?: boolean; // if true, fetches data directly from the server, ignoring the local cache.
}

interface ListenerOptions<T extends DocumentData> extends QueryOptions<T> {
  includeMetadataChanges?: boolean;
}

// helper function to build a query with the provided options.
const buildQuery = <T extends DocumentData>(collectionRef: CollectionReference<T>, options: QueryOptions<T> = {}) => {
  const queryConstraints: QueryConstraint[] = [];

  // add ordering.
  if (options.orderByField) {
    queryConstraints.push(orderBy(options.orderByField, options.orderDirection || 'desc'));
  } else {
    // Default ordering by timestamp if no order specified.
    queryConstraints.push(orderBy('timestamp', 'desc'));
  }

  // add filtering conditions.
  if (options.whereConditions && options.whereConditions.length > 0) {
    options.whereConditions.forEach((condition) => {
      queryConstraints.push(where(condition.field, condition.operator, condition.value));
    });
  }

  // add pagination.
  if (options.limit && options.limit > 0) {
    queryConstraints.push(limit(options.limit));
  }

  // add cursor for pagination.
  if (options.startAfterDoc) {
    queryConstraints.push(startAfter(options.startAfterDoc));
  }

  if (options.endBeforeDoc) {
    queryConstraints.push(endBefore(options.endBeforeDoc));
  }

  return query(collectionRef, ...queryConstraints);
};

// helper function to create a document reference.
export const createDocumentReference = <T extends DocumentData>(
  collectionName: string,
  documentId?: string
): DocumentReference<T> => {
  if (documentId) {
    return doc(db, collectionName, documentId) as DocumentReference<T>;
  }

  // create a document reference with an auto-generated ID, for using the reference later.
  return doc(db, collectionName) as DocumentReference<T>;
};

// listen to changes in documents in the collection with flexible query options.
export const listenToCollectionService = <T extends DocumentData>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  options: ListenerOptions<T> = {},
  errorCallback?: (error: FirebaseError) => void
): (() => void) => {
  const collectionRef = collection(db, collectionName);
  const documentsQuery = buildQuery(collectionRef, options);

  return onSnapshot(
    documentsQuery,
    { includeMetadataChanges: options.includeMetadataChanges || false },
    (querySnapshot) => {
      const data: (T & { id: string })[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data() as T; // get the document's data fields
        if (docData) {
          data.push({
            ...docData, // spread the document's data fields into the new object
            id: doc.id, // add the document's identifier
          });
        }
      });
      callback(data);
    },
    (err) => {
      // handle Firestore listener errors; these errors occur asynchronously during the onSnapshot listener's operation.
      // https://firebase.google.com/docs/firestore/query-data/listen#handle_listen_errors
      if (errorCallback) {
        errorCallback(err);
      } else {
        console.error('Firestore listener error:', err);
      }
    }
  );
};

// fetch a SINGLE document from the database.
// by default, a get call will attempt to fetch the latest document snapshot from our database.
// on platforms with offline support, the client library will use the offline cache if the network is unavailable or if the request times out.
export const getDocumentService = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  forceServerFetch: boolean = true // source option.
): Promise<(T & { id: string }) | undefined> => {
  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.

  // choose the data source based on forceServerFetch.
  const docSnap = forceServerFetch
    ? await getDoc(docRef) // database (server).
    : await getDocFromCache(docRef); // local cache.

  if (!docSnap.exists()) return undefined;

  return {
    ...(docSnap.data() as T),
    id: docSnap.id,
  };
};

// fetch MULTIPLE documents from collection with flexible query options.
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
export const getDocumentsService = async <T extends DocumentData>(
  collectionName: string,
  options: QueryOptions<T> = {}
): Promise<{
  data: (T & { id: string })[];
  lastDoc?: QueryDocumentSnapshot<T>;
  firstDoc?: QueryDocumentSnapshot<T>;
}> => {
  const collectionRef = collection(db, collectionName);
  const documentsQuery = buildQuery(collectionRef, options);

  // choose the data source based on forceServerFetch.
  const querySnapshot = options.forceServerFetch
    ? ((await getDocs(documentsQuery)) as QuerySnapshot<T>) // database (server).
    : ((await getDocsFromCache(documentsQuery)) as QuerySnapshot<T>); // local cache.

  const data = querySnapshot.docs.map((doc) => ({
    ...(doc.data() as T), // get the document's data fields
    id: doc.id, // add the document's identifier
  }));

  // return the fetched data along with pagination metadata for subsequent queries.
  return {
    data,
    lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : undefined, // last document in the result set.
    firstDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[0] : undefined, // first document in the result set.
  };
};

// fetch MULTIPLE documents from collection using their IDs.
export const batchGetDocumentsService = async <T extends DocumentData>(
  collectionName: string,
  documentIds: string[]
): Promise<(T & { id: string })[]> => {
  const promises = documentIds.map((id) => getDocumentService<T>(collectionName, id));
  const results = await Promise.all(promises);

  return results.filter((doc) => doc !== undefined);
};

// get trending documents (most viewed/most popular).
export const getTrendingDocumentsService = async <T extends DocumentData>(
  collectionName: string,
  trendingField: string = 'views',
  count: number = 3
): Promise<(T & { id: string })[]> => {
  const options: QueryOptions<T> = {
    orderByField: trendingField,
    orderDirection: 'desc',
    limit: count,
    forceServerFetch: true,
  };

  const { data } = await getDocumentsService<T>(collectionName, options);
  return data;
};

// paginated query.
export const getPaginatedDocumentsService = async <T extends DocumentData>(
  collectionName: string,
  pageSize: number = 20,
  startAfterDocument?: QueryDocumentSnapshot<T>,
  options: Omit<QueryOptions<T>, 'limit' | 'startAfterDoc'> = {}
): Promise<{
  data: (T & { id: string })[];
  lastDoc?: QueryDocumentSnapshot<T>;
  firstDoc?: QueryDocumentSnapshot<T>;
  hasMore: boolean;
}> => {
  // request one more document than needed to determine if there are more pages.
  const queryOptions: QueryOptions<T> = {
    ...options,
    limit: pageSize + 1,
    startAfterDoc: startAfterDocument,
  };

  const { data, lastDoc, firstDoc } = await getDocumentsService<T>(collectionName, queryOptions);

  // if we get more items than pageSize, there are more pages.
  const hasMore = data.length > pageSize;

  // return only the requested pageSize.
  return {
    data: hasMore ? data.slice(0, pageSize) : data,
    lastDoc,
    firstDoc,
    hasMore,
  };
};

// compound queries.
export const getFilteredAndOrderedDocumentsService = async <T extends DocumentData>(
  collectionName: string,
  filter: {
    field: string;
    operator: WhereFilterOp;
    value: any;
  },
  sortBy: {
    field: string;
    direction: OrderByDirection;
  },
  queryLimit: number = 20
): Promise<(T & { id: string })[]> => {
  const options: QueryOptions<T> = {
    whereConditions: [filter],
    orderByField: sortBy.field,
    orderDirection: sortBy.direction,
    limit: queryLimit,
  };

  const { data } = await getDocumentsService<T>(collectionName, options);
  return data;
};

// add a new document to a collection; Firestore automatically generates the document identifier.
export const addDocumentService = async <T extends DocumentData>(
  collectionName: string,
  data: T // document to store
): Promise<{ id: string; ref: DocumentReference<T> }> => {
  const collectionRef = collection(db, collectionName);

  // add a timestamp if not provided.
  const documentData = {
    ...data,
    timestamp: data.timestamp || new Date().getTime(),
  };

  const docRef = await addDoc(collectionRef, documentData); // creates a new document with an auto-generated document identifier.

  return { id: docRef.id, ref: docRef as DocumentReference<T> }; // return the reference to where the document is stored.
};

// set the data of a document within a collection, explicitly specifying a document identifier.
// if the document does not exist, it will be created.
// if the document does exist, its contents will be overwritten with the newly provided data, unless we specify that the data should be merged into the existing document.
export const addDocumentWithIdService = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T, // document to store.
  merge: boolean = true // if true, merges 'data' with existing document; otherwise, overwrites.
): Promise<void> => {
  // add a timestamp if not provided
  const documentData = {
    ...data,
    timestamp: data.timestamp || new Date().getTime(),
  };

  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.

  await setDoc(docRef, documentData, { merge }); // creates a new document with a custom ID.
};

// update specific fields of a document without overwriting the entire document (document must exist).
export const updateDocumentFieldsService = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  // add a timestamp if not provided
  const documentData = {
    ...data,
    timestamp: data.timestamp || new Date().getTime(),
  };

  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.

  return await updateDoc(docRef, documentData);
};

// delete a document in a collection.
export const deleteDocumentService = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<void> => {
  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.

  return await deleteDoc(docRef); // delete the document.
};
