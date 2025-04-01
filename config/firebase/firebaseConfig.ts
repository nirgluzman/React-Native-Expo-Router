// for more information on how to access Firebase in your project, see the Firebase documentation:
// https://firebase.google.com/docs/web/setup#access-firebase

import { initializeApp } from 'firebase/app';

// import services, https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// app's Firebase configuration.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// initialize Firebase.
const app = initializeApp(firebaseConfig);

// initialize Firebase Authentication and get a reference to the service.
//
// NOTE - persist auth state in AsyncStorage:
// with `getAuth` we're initializing Firebase Auth for React Native without providing AsyncStorage.
// Auth state will default to memory persistence and will not persist between sessions.
//
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
