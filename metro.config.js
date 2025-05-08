// Metro Bundler is the default JavaScript bundler for React Native projects.
// It takes our code and its dependencies and packages them into a single JavaScript file (or multiple bundles) that can be run on a mobile device or in a web browser.

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK for Auth doesn't work with Expo v53
// https://docs.expo.dev/guides/using-firebase/?redirected#configure-metro
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

// https://www.nativewind.dev/getting-started/installation#4-modify-your-metroconfigjs
module.exports = withNativeWind(config, { input: './app/global.css' });
