# Expo Router Sample Application

https://github.com/nirgluzman/React-Native-Expo-Router.git
https://www.youtube.com/watch?v=ZBCUegTZF7M
https://resource.jsmastery.pro/aora-design (Figma design)

## NativeWind

https://www.nativewind.dev/ <br/>
https://medium.com/@hychandima2000/understanding-the-folder-structure-of-a-react-native-project-using-expo-and-nativewind-272d656740f4

- Use [Tailwind CSS](https://tailwindcss.com/) to style our components in React Native.

## Expo Router

https://docs.expo.dev/router/introduction/
https://docs.expo.dev/router/installation/
https://docs.expo.dev/develop/file-based-routing/
https://docs.expo.dev/router/basics/core-concepts/
https://github.com/expo/expo/tree/main/templates/expo-template-tabs (code template)

- File-based router for React Native and web applications.
- **[Support for TypeScript](https://docs.expo.dev/router/reference/typed-routes/):**<br />
  Code example: https://ignitecookbook.com/docs/recipes/ExpoRouter/

## White Background Flicker during Stack Navigation Screen Transitions

https://github.com/expo/expo/issues/33040 <br/>
https://stackoverflow.com/questions/69963519/how-to-make-a-transparent-modal-with-react-navigation-6-and-expo

- To solve the issue, set in `screenOptions.presentation` mode to be `transparentModal`.

```js
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        // for fixing white background flicker in Stack navigation transitions.
        presentation: 'transparentModal',
        contentStyle: { backgroundColor: colors.primary },
      }}>
      <Stack.Screen name='sign-in' />
      <Stack.Screen name='sign-up' />
    </Stack>
```

## White Background Flash during Keyboard Transitions

https://stackoverflow.com/questions/77686962/how-to-fix-that-white-flikering-behind-keyboard-in-react-native

- Fixed with [expo-system-ui](https://docs.expo.dev/versions/latest/sdk/system-ui/) background color configuration.

## Support for Safe Areas

https://docs.expo.dev/versions/latest/sdk/safe-area-context/ <br />

- [`react-native-safe-area-context`](https://appandflow.github.io/react-native-safe-area-context/) provides a flexible API for accessing device safe area inset information.
- **Note:** <br/>
  Expo Router adds the `<SafeAreaProvider>` to every route by default; see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets.
- **Note:** <br/>
  Jumpy animations during screen transitions can occur with the `SafeAreaView` component. <br/>
  It's recommended to use `useSafeAreaInsets` instead for consistent safe area handling. <br/>
  https://reactnavigation.org/docs/handling-safe-area/

## Expo Video

https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents <br/>
https://expo.dev/blog/expo-video-a-simple-powerful-way-to-play-videos-in-apps <br/>
https://stackoverflow.com/questions/79552148/

- `expo-video` is a cross-platform, performant video component for React Native and Expo with Web support.
- It is replacing the Video component of `expo-av`.

- **NOTE:** <br/>
  [Rendering multiple `VideoView` components in the same `VideoPlayer`](https://stackoverflow.com/questions/79552148/)<br />
  Mounting multiple `VideoView` components at the same time in the same `VideoPlayer` component does not work on **Android** due to a [platform limitation](https://github.com/expo/expo/issues/35012).

## Expo AV

https://docs.expo.dev/versions/latest/sdk/video-av/ <br/>

- Library that provides APIs for Audio and Video playback.

- **NOTE:** <br/>
  The `Video` component from `expo-av` will be replaced by an improved version in `expo-video` in the upcoming Expo SDK release.

- **Note:** <br/>
  [Expo-AV does not recognize NativeWind className prop](https://stackoverflow.com/questions/79551685/does-expo-av-support-classname-prop)

```ts
<View className='w-full h-60 overflow-hidden rounded-xl mt-3'>
  <Video
    source={{
      uri: (videoSource = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'), // VIDEO PLACEHOLDER
    }}
    style={{
      // style the video to fill its parent
      width: '100%',
      height: '100%',
    }}
    resizeMode={ResizeMode.COVER}
    useNativeControls={true}
    shouldPlay
    onError={
      // function to be called if load or playback have encountered a fatal error.
      (error) => {
        Alert.alert('Error', error);
        setPlay(false);
      }
    }
    onPlaybackStatusUpdate={
      // function to be called regularly with the AVPlaybackStatus of the video.
      (status) => {
        // https://docs.expo.dev/versions/latest/sdk/av/#avplaybackstatussuccess
        if (status.isLoaded && (status as AVPlaybackStatusSuccess).didJustFinish) {
          setPlay(false);
        }
      }
    }
  />
</View>
```

## Expo Hooks

https://docs.expo.dev/versions/latest/sdk/expo/#hooks <br/>
https://docs.expo.dev/versions/latest/sdk/video/#receiving-events

- Examples:

```ts
  // React hook that listens to events emitted by the given object - allows us to listen to events emitted by the player.
  // The returned value is an event parameter that gets updated whenever a new event is dispatched.
  const { isPlaying } = useEvent(
    videoPlayer, // the object that emits events.
    'playingChange', // name of the event to listen to; https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents
    { isPlaying: videoPlayer.playing } // initial state (an event parameter to use until the event is called for the first time).
  );
```
```ts
  // React hook that listens to events emitted by the given object and calls the listener function whenever a new event is dispatched.
  useEventListener(
    videoPlayer, // the object that emits events.
    'statusChange', // name of the event to listen to;
    ({ status, error }) => {
      // function to call when the event is dispatched.
      if (status === 'error') {
        Alert.alert('Error', error!.message);
      }
    }
  );
```
## Animations in React Native

https://www.npmjs.com/package/react-native-animatable/ <br/>
https://www.scaler.com/topics/react-native-animatable/

- Library to create smooth, declarative animations in React Native applications.
