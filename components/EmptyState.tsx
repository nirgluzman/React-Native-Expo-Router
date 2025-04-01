//
// Displays a message and action button when there's no data.
//

import { View, Text, Image } from 'react-native';

import { router } from 'expo-router';

import { images } from '../constants';
import CustomButton from './CustomButton';

interface IEmptyState {
  title: string;
  subtitle: string;
}

const EmptyState = ({ title, subtitle }: IEmptyState) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image source={images.empty} className='w-[270px] h-[215px] mb-4 resizeMode="contain" ' />

      <Text className='font-psemibold text-xl text-white'>{title}</Text>
      <Text className='font-pmedium text-sm text-gray-100 mt-2'>{subtitle}</Text>

      <CustomButton title='Create video' handlePress={() => router.push('/create')} containerStyles='w-full my-5' />
    </View>
  );
};

export default EmptyState;
