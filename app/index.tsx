//
// Onboarding Screen
// Top level route (matches the / route).
// This route appears first when we open the app or navigate to our web app's root URL.
//

import { router } from 'expo-router';

import { Image, ScrollView, Text, View } from 'react-native';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function Onboarding() {
  return (
    <ScrollView contentContainerStyle={{ height: '100%' }}>
      <View className='w-full justify-center items-center min-h-[85vh] px-4'>
        <Image
          source={images.logo}
          className='w-[130px] h-[84px]'
          resizeMode='contain'
        />
        <Image
          source={images.cards}
          className='max-w-[380px] w-full h-[300px]'
          resizeMode='contain'
        />

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
  );
}
