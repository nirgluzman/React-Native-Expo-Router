//
// Displays a global error alert using React Native's Alert component whenever an error occurs in the application's error context.
//

import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useErrorContext } from '../services/error/error.context';

const ErrorAlert = () => {
  const { hasError, displayError, clearError } = useErrorContext();

  useEffect(() => {
    if (hasError) {
      Alert.alert('Error', displayError!.message, [
        {
          text: 'OK',
          onPress: clearError, // clear the error when the user acknowledges.
        },
      ]);
    }
  }, [hasError, displayError]);

  // this component doesn't need to render anything visible in the UI.
  return null;
};

export default ErrorAlert;
