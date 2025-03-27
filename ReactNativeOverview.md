# React Native - Overview

https://youtu.be/ZBCUegTZF7M?si=R4y871nz5s9bxoHv
https://github.com/adrianhajdin/aora/blob/main/README.md
https://resource.jsmastery.pro/ultimate-react-native-guide

## Expo Router

- File-based routing framework, similar to Next.js.
- `--template tabs` installs and configures file-based routing with Expo Router and TypeScript enabled.
- Expo Router uses [React Navigation](https://reactnavigation.org/) underneath.

## NativeWind

https://www.nativewind.dev/

- [Tailwind CSS](https://tailwindcss.com/) to style our components in React Native.

## React Native Components

- [Core Components and APIs](https://reactnative.dev/docs/components-and-apis)

### Layout and Structure

#### View

- Similar to `<div>` element in HTML but with some added functionality specific to mobile apps.
- It's often used to create layout structures for other components.
- It has number of props that can be used to control its appearance and behavior.
- **Uses flexbox layout by default** (which makes it really easy to control how its child components are laid out within
  the container).

### Handling Touches

#### Button

- Basic button component, supports a minimal level of customization.

#### TouchableOpacity

- Wrapper for making views respond properly to touches.
- It's like a cousin to the Button component in React.

#### TouchableHighlight

- On press down, the opacity of the wrapped view is decreased, which allows the underlay color to show through, darkening or tinting the view.

#### TouchableWithoutFeedback

- Clickable element without any visual effect on press.

### ActivityIndicator

- Displays a circular loading indicator.

### Render Lists of Data

#### FlatList

- Rendering a long list of items that need to be scrolled efficiently (e.g. smooth scrolling).
- Similar to `map` function in React, but has extra features like: optimized scroll performance, item separation.

#### ScrollView

- Box to hold multiple components and views, providing a scrolling container for them.
- Helps users can easily explore all the content, making the app more intuitive and user-friendly.

#### SafeAreaView

- Renders content within the safe area boundaries of a device.
- Safe Area's paddings reflect the physical limitation of the screen, such as rounded corners or camera notches.

### Images

#### Image

- Display stand-alone images.

#### ImageBackground

- Designed to display images as a background of a container, allowing other components to be layered on top of it.

#### react-native-svg

- SVG image support to React Native.

### Toggle

#### Switch

- Renders a boolean input.

### StatusBar

- Component to control the app's status bar.
