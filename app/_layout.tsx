// Root layout - share UI between multiple routes
// https://docs.expo.dev/develop/file-based-routing/#root-layout

import { Text } from 'react-native';

import {
  Slot, // renders the currently selected route (similar to `children` in React).
} from 'expo-router';

const RootLayout = () => {
  return (
    <>
      <Text>Header</Text>
      <Slot />
      <Text>Footer</Text>
    </>
  );
};
export default RootLayout;
