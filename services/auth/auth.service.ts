//
// Authentication service:
// This file encapsulates Firebase authentication methods for user management.
//

import { auth } from '../../config/firebase/firebaseConfig';

import {
  onAuthStateChanged, // monitors authentication status changes and returns the current user.
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';

type FirebaseUser = FirebaseAuthTypes.User;

// sets up a listener for authentication state changes.
export const listenAuthState = (callback: (user: FirebaseUser | null) => void) => {
  // onAuthStateChanged sets up a listener that monitors the user's authentication state.
  // whenever the state changes (e.g., user signs in, signs out, or the authentication token refreshes), it executes
  // the provided callback function, passing the current user object (or null) as an argument.
  return onAuthStateChanged(auth, callback);
};

// function to generate an avatar URL with the initial letter.
const generateAvatarUrl = (username: string): string => {
  const initial = username.charAt(0).toUpperCase();
  const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // random background color.
  const textColor = '#FFFFFF'; // white text

  return `https://ui-avatars.com/api/?name=${initial}&background=${backgroundColor.slice(1)}&color=${textColor.slice(
    1
  )}`;
};

// create a new user account with username, email and password.
export const signUpRequest = async (username: string, email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const avatarUrl = generateAvatarUrl(username);
  await updateProfile(user, { displayName: username, photoURL: avatarUrl });
  return { user };
};

// login user with email and password.
export const signInRequest = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// handle user logout.
export const logoutRequest = () => {
  return signOut(auth);
};
