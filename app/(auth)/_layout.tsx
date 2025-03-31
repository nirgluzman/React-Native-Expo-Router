import { colors } from '../../constants/colors';

import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        // for fixing white background flicker in Stack navigation transitions.
        presentation: 'transparentModal',
        contentStyle: { backgroundColor: colors.primary }, // style object for the scene content.
      }}>
      <Stack.Screen name='sign-in' />
      <Stack.Screen name='sign-up' />
    </Stack>
  );
};

export default AuthLayout;
