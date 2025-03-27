// Root layout - share UI between multiple routes.
// https://docs.expo.dev/develop/file-based-routing/#root-layout

import './global.css'; // global styles (incl. Tailwind CSS definitions).

import {
  Slot, // renders the currently selected route (similar to `children` in React).
  Stack,
} from 'expo-router';

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='profile' />
    </Stack>
  );
};
export default RootLayout;
