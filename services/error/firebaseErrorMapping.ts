//
// This file centralizes the mapping of Firebase error codes from various services (Authentication, Firestore, Storage, etc.)
// to user-friendly messages.
// These messages are intended for display in the application's user interface.
//

// Import specific error code enums from relevant services
import { AuthErrorCodes } from 'firebase/auth';
import { StorageErrorCode } from 'firebase/storage';

// --- User-Friendly Mappings for Different Services ---
// These maps translate specific Firebase error codes (strings) into user-friendly messages displayed in the application.

// https://firebase.google.com/docs/reference/js/auth#autherrorcodes (AuthErrorCodes)
export const userFriendlyAuthErrorMap: Record<string, string> = {
  // --- Credential/User Specific Errors ---
  [AuthErrorCodes.INVALID_EMAIL]: 'Please enter a valid email address.',

  // Note: USER_DELETED map to "auth/user-not-found"
  [AuthErrorCodes.USER_DELETED]: 'Invalid email or password.',

  // Note: INVALID_PASSWORD maps to "auth/wrong-password"
  [AuthErrorCodes.INVALID_PASSWORD]: 'Invalid email or password.', // Combined message

  // Note: EMAIL_EXISTS maps to "auth/email-already-in-use"
  [AuthErrorCodes.EMAIL_EXISTS]: 'This email address is already in use.',

  [AuthErrorCodes.WEAK_PASSWORD]: 'The password is too weak.',
  [AuthErrorCodes.USER_DISABLED]: 'This account has been disabled.',

  // Note: CREDENTIAL_TOO_OLD_LOGIN_AGAIN maps to "auth/requires-recent-login"
  [AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN]: 'Please log in again.', // For sensitive operations

  // Note: INVALID_IDP_RESPONSE, INVALID_LOGIN_CREDENTIALS, INVALID_CREDENTIAL
  // all map to "auth/invalid-credential". Using INVALID_LOGIN_CREDENTIALS as the primary key.
  [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]: 'Invalid login credentials.', // Generic for providers (e.g., social login)

  // --- General Auth Errors ---
  [AuthErrorCodes.NETWORK_REQUEST_FAILED]: 'Network error. Please check your connection.',

  // Note: TOO_MANY_ATTEMPTS_TRY_LATER map to "auth/too-many-requests"
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: 'Too many attempts. Please try again later.',

  [AuthErrorCodes.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.', // General server error
  [AuthErrorCodes.TIMEOUT]: 'The operation timed out. Please try again.', // Added back as it's common

  // --- Default/Fallback ---
  // Any other Firebase Auth code not listed above will fall through to the default message handling logic in the ErrorContextProvider.
  // That logic uses the provided `userMessage` option or a generic fallback.
};

// https://firebase.google.com/docs/reference/node/firebase.firestore#firestoreerrorcode
export const userFriendlyFirestoreErrorMap: Record<string, string> = {
  'firestore/cancelled': 'The database operation was cancelled.',
  'firestore/unknown': 'An unknown database error occurred.',
  'firestore/invalid-argument': 'Invalid data provided for the database operation.',
  'firestore/deadline-exceeded': 'The database operation timed out.',
  'firestore/not-found': 'The requested data was not found.',
  'firestore/already-exists': 'The data you are trying to create already exists.',
  'firestore/permission-denied': "You don't have permission to perform this action.",
  'firestore/resource-exhausted': 'You have exceeded your quota for database operations.',
  'firestore/failed-precondition': 'The database operation failed because of a precondition.',
  'firestore/aborted': 'The database operation was aborted.',
  'firestore/out-of-range': 'The database query parameter is out of range.',
  'firestore/unimplemented': 'The database operation is not implemented.',
  'firestore/internal': 'An internal database error occurred.',
  'firestore/unavailable': 'The database is temporarily unavailable. Please try again.',
  'firestore/data-loss': 'Potential data loss occurred during the database operation.',
  'firestore/unauthenticated': 'You must be logged in to access the database.',

  // ... add other specific codes if needed
};

export const userFriendlyStorageErrorMap: Record<string, string> = {
  // Storage errors
  [StorageErrorCode.OBJECT_NOT_FOUND]: 'The requested file was not found.',
  [StorageErrorCode.UNAUTHORIZED]: 'You are not authorized to access this file.',
  [StorageErrorCode.UNKNOWN]: 'An unknown storage error occurred.',
  [StorageErrorCode.QUOTA_EXCEEDED]: 'Your storage quota has been exceeded.',
  [StorageErrorCode.UNAUTHENTICATED]: 'You must be logged in to access storage.',
  [StorageErrorCode.INVALID_ARGUMENT]: 'Invalid argument provided for storage operation.',
  [StorageErrorCode.BUCKET_NOT_FOUND]: 'The storage bucket was not found.',
  [StorageErrorCode.PROJECT_NOT_FOUND]: 'The Firebase project was not found.',
  [StorageErrorCode.RETRY_LIMIT_EXCEEDED]: 'File operation failed after multiple retries.',

  // ... add other specific codes if needed
};

// Note: You can add mappings for other Firebase services here as well (e.g. Functions).
