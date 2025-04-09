//
// Displays a global error alert using React Native's Alert component whenever an error occurs in the application's error context.
//

import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useErrorContext } from '../services/error/error.context';

const ErrorAlert = () => {
  const { hasError, errorMessage, clearError } = useErrorContext();

  useEffect(() => {
    if (hasError) {
      Alert.alert('Error', errorMessage!, [
        {
          text: 'OK',
          onPress: clearError, // clear the error when the user acknowledges.
        },
      ]);
    }
  }, [hasError, errorMessage]);

  // this component doesn't need to render anything visible in the UI.
  return null;
};

export default ErrorAlert;
