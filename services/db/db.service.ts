//
// Database service:
// This file encapsulates Firebase Firestore methods for data management.
// https://firebase.google.com/docs/firestore/manage-data/add-data
// https://firebase.google.com/docs/firestore/query-data/get-data

import { db } from '../../config/firebase/firebaseConfig';

import {
  collection,
  doc, // create a document reference.
  onSnapshot, // realtime updates.
  getDoc, // get a single document from the database.
  getDocs, // get multiple documents from the database.
  addDoc, // add a new document to a collection.
  setDoc, // create or overwrite a single document.
  updateDoc, // update specific fields of a document without overwriting the entire document.
  deleteDoc, // delete a single document from the database.
  DocumentReference, // document location in a Firestore database.
  DocumentData, // mapping between a field and its value.
} from 'firebase/firestore';

import { FirebaseError } from '@firebase/util'; // subclass of the standard JavaScript Error object. In addition to a message string and stack trace, it contains a string code.

// create a document reference.
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

// listen to changes in all documents in a collection.
export const listenToCollection = <T extends DocumentData>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  errorCallback?: (error: FirebaseError) => void
): (() => void) => {
  const collectionRef = collection(db, collectionName);
  return onSnapshot(
    collectionRef,
    { includeMetadataChanges: false },
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
      if (errorCallback) {
        errorCallback(err);
      } else {
        console.error('Firestore listener error:', err);
      }
    }
  );
};

// get a single document from the database.
// by default, a get call will attempt to fetch the latest document snapshot from our database.
// on platforms with offline support, the client library will use the offline cache if the network is unavailable or if the request times out.
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | undefined> => {
  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.
  const docSnap = await getDoc(docRef); // get the document from the database.
  return docSnap.exists() ? docSnap.data() : undefined;
};

// get all documents from a collection.
export const getAllDocuments = async <T extends DocumentData>(
  collectionName: string
): Promise<(T & { id: string })[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({
    ...(doc.data() as T), // get the document's data fields
    id: doc.id, // add the document's identifier
  }));
};

// add a new document to a collection; Firestore automatically generates the document identifier.
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T // document to store
): Promise<DocumentReference<T>> => {
  const collectionRef = collection(db, collectionName);
  const docRef = await addDoc(collectionRef, data); // creates a new document with an auto-generated document identifier.
  return docRef as DocumentReference<T>; // return the reference to where the document is stored.
};

// set the data of a document within a collection, explicitly specifying a document identifier.
// if the document does not exist, it will be created.
// if the document does exist, its contents will be overwritten with the newly provided data, unless we specify that the data should be merged into the existing document.
export const createDocumentWithId = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T, // document to store.
  merge: boolean // if true, merges 'data' with existing document; otherwise, overwrites.
): Promise<void> => {
  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.
  await setDoc(docRef, data, { merge }); // creates a new document with a custom ID.
};

// update specific fields of a document without overwriting the entire document (document must exist).
export const updateDocumentFields = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.
  return await updateDoc(docRef, data);
};

// delete a document in a collection.
export const deleteDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<void> => {
  const docRef = createDocumentReference<T>(collectionName, documentId); // create a reference to the document with documentId.
  return await deleteDoc(docRef); // delete the document.
};
