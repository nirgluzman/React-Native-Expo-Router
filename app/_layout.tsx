// Root layout - share UI between multiple routes.
// https://docs.expo.dev/develop/file-based-routing/#root-layout
//
// NOTE: This is the initial client file (entry point).
// https://docs.expo.dev/router/installation/#setup-entry-point
//

import './global.css'; // global styles (incl. Tailwind CSS definitions).
import { colors } from '../constants';

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'; // control the status bar (the top bar of the screen that shows battery, time, etc.)

import {
  Slot, // dynamically renders the currently active screen in our app (similar to `children` in React).
  Stack,
  SplashScreen,
} from 'expo-router';

import * as SystemUI from 'expo-system-ui'; // library to interact with system UI elements.

import { useFonts } from 'expo-font';

import { AuthContextProvider } from '../services/auth/auth.context';

// configure the root view background color - fix white background flash during keyboard transitions.
SystemUI.setBackgroundColorAsync(colors.primary);

// prevent the splash screen from auto-hiding before asset loading is complete.
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
      <StatusBar style='light' backgroundColor={colors.primary} />

      <AuthContextProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
            // for fixing white background flicker in Stack navigation transitions.
            presentation: 'transparentModal',
            contentStyle: { backgroundColor: colors.primary }, // style object for the scene content.
          }}>
          <Stack.Screen name='index' />
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='/search/[query]' />
        </Stack>
      </AuthContextProvider>
    </>
  );
};

export default RootLayout;
