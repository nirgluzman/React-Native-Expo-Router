//
// Onboarding Screen
// Top level route (matches the / route).
// This route appears first when we open the app or navigate to our web app's root URL.
//

import { router, Redirect } from 'expo-router';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { Image, ScrollView, Text, View } from 'react-native';

import { useAuthContext } from '../services/auth/auth.context';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function Welcome() {
  const insets = useSafeAreaInsets();

  const { isLoading, isAuthenticated } = useAuthContext();

  // authenticated users are automatically redirected to the /home screen.
  if (!isLoading && isAuthenticated) return <Redirect href='/home' />;

  return (
    <View
      className='bg-primary h-full'
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Image source={images.logo} className='w-[130px] h-[84px]' resizeMode='contain' />
          <Image source={images.cards} className='max-w-[380px] w-full h-[300px]' resizeMode='contain' />

          <View className='relative mt-5'>
            <Text className='text-3xl font-pmedium text-white text-center'>
              Discover Endless Possibilities with <Text className='text-secondary-200'>Aora</Text>
            </Text>
            <Image
              source={images.path}
              className='w-[136px] h-[15px] absolute -bottom-2 -right-8'
              resizeMode='contain'
            />
          </View>

          <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Aora
          </Text>

          <CustomButton
            title='Continue with Email'
            containerStyles='w-full mt-7'
            handlePress={() => router.push('/sign-in')}
            isLoading={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}
