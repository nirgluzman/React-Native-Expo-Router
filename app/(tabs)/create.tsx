//
// Create Tab
//
// This component provides a form for users to create and upload a new video post.
// It allows users to add a title, upload a video file and thumbnail image, enter an AI prompt associated
// with the video, and submit the content for publishing.
//

import { useState } from 'react';

import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { icons } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const Create = () => {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const submit = () => {
    console.log('submit');
  };

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
      <ScrollView className='px-4 my-6'>
        <Text className='font-psemibold text-white text-2xl'>Upload Video</Text>

        <FormField
          title='Video Title'
          placeholder='Give your video a title here...'
          value={form.title}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles='mt-10'
        />

        <View className='mt-6 space-y-2'>
          <Text className='text-base text-gray-100 font-psemibold'>Upload Video</Text>
          <TouchableOpacity className='mt-1'>
            {form.video ? (
              <Text className='text-sm text-gray-400 font-pregular'>Video Uploaded!</Text>
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-lg justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 rounded-xl justify-center items-center'>
                  <Image source={icons.upload} className='w-1/2 h-1/2' resizeMode='cover' />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-6 space-y-2'>
          <Text className='text-base text-gray-100 font-psemibold'>Thumbnail Image</Text>
          <TouchableOpacity className='mt-1'>
            {form.thumbnail ? (
              <Image source={{ uri: form.thumbnail }} resizeMode='cover' className='w-full h-64 rounded-lg' />
            ) : (
              <View className='w-full h-16 px-4 bg-black-100 rounded-lg flex-row justify-center items-center gap-x-2'>
                <Image source={icons.upload} className='w-5 h-5' resizeMode='cover' />
                <Text className='text-sm text-gray-100 font-psemibold'>Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title='AI Prompt'
          placeholder='AI prompt for your video ...'
          value={form.prompt}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles='mt-6'
        />

        <CustomButton title='Submit & Publish' containerStyles='mt-6' handlePress={submit} isLoading={uploading} />
      </ScrollView>
    </View>
  );
};

export default Create;
