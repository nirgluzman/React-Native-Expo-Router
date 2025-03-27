// Top level route (matches the / route).
// This route appears first when we open the app or navigate to our web app's root URL.

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { Link } from 'expo-router';

export default function App() {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <StatusBar style='auto' />
      <Text className='text-3xl font-pblack'>Aora!</Text>
      <Link href='/home' style={{ color: 'blue' }}>
        Go to Home
      </Link>
    </View>
  );
}
