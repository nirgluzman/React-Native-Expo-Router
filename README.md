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

## Support for Safe Areas

https://docs.expo.dev/versions/latest/sdk/safe-area-context/ <br />

- [`react-native-safe-area-context`](https://appandflow.github.io/react-native-safe-area-context/) provides a flexible API for accessing device safe area inset information.
- **Note:** <br/>
  Expo Router adds the `<SafeAreaProvider>` to every route by default; see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets.
- **Note:** <br/>
  Jumpy animations during screen transitions can occur with the `SafeAreaView` component. <br/>
  It's recommended to use `useSafeAreaInsets` instead for consistent safe area handling. <br/>
  https://reactnavigation.org/docs/handling-safe-area/
