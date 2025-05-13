//
// Firebase config file
//

import { getApp, setReactNativeAsyncStorage } from '@react-native-firebase/app';

// import services, https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // app's Firebase configuration for web.
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
// };

// configure the AsyncStorage to be used to persist user sessions, https://rnfirebase.io/platforms#async-storage
setReactNativeAsyncStorage(ReactNativeAsyncStorage);

// initialize Firebase.
const app = getApp();

// initialize Firebase Authentication and get a reference to the service.
const auth = getAuth(app);

// initialize Firestore and get a reference to the service.
const db = getFirestore(app);

// initialize Cloud Storage and get a reference to the service.
const storage = getStorage(app);

export { app, auth, db, storage };
