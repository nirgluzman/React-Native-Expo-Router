// Root layout - share UI between multiple routes.
// https://docs.expo.dev/develop/file-based-routing/#root-layout
//
// NOTE: This is the initial client file (entry point).
// https://docs.expo.dev/router/installation/#setup-entry-point
//

import './global.css'; // global styles (incl. Tailwind CSS definitions).

import { useEffect } from 'react';

import { StatusBar } from 'expo-status-bar'; // control the status bar (the top bar of the screen that shows battery, time, etc.)
import {
  SafeAreaView, // render content within the safe area boundaries of a device.
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import {
  Slot, // dynamically renders the currently active screen in our app (similar to `children` in React).
  Stack,
  SplashScreen,
} from 'expo-router';

import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // load the font files asynchronously, https://docs.expo.dev/develop/user-interface/fonts/
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  // font loading with splash screen.
  useEffect(() => {
    // if an error exists, then throw (raise) that error.
    if (error) throw error;

    // hide the native splash screen immediately (we must have content ready to display).
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [error, fontsLoaded]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar
        style='light'
        backgroundColor='#161622'
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              // style object for the scene content.
              backgroundColor: '#161622', // apply a dark background color to the content area of all screens rendered within the stack.
            },
          }}>
          <Stack.Screen name='index' />
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='(auth)' />
        </Stack>
      </SafeAreaView>
    </>
  );
};

export default RootLayout;
