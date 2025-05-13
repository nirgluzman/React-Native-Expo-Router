//
// Create Tab
//
// This component provides a form for users to create and upload a new video post.
// It allows users to add a title, upload a video file and thumbnail image, enter an AI prompt associated
// with the video, and submit the content for publishing.
//

import { useState } from 'react';

import { Image, Text, View, ScrollView, TouchableOpacity, ImageSourcePropType } from 'react-native';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { router } from 'expo-router';

// library to access the system's UI for selecting documents from the available providers on the user's device.
import * as DocumentPicker from 'expo-document-picker';

// custom hook for accessing the global React contexts.
import { useErrorContext } from '../../services/error/error.context';
import { useAuthContext } from '../../services/auth/auth.context';
import { useFirestoreContext } from '../../services/db/firestore.context';
import { useStorageContext } from '../../services/storage/storage.context';

import { icons } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

interface IFormState {
  title: string;
  video: { uri: string; mimeType: string | undefined };
  thumbnail: { uri: string; mimeType: string | undefined };
  prompt: string;
}

const Create = () => {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<IFormState>({
    title: '',
    video: { uri: '', mimeType: '' },
    thumbnail: { uri: '', mimeType: '' },
    prompt: '',
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const { handleError } = useErrorContext();
  const { user } = useAuthContext();
  const { uploadFile } = useStorageContext();
  const { addDocument } = useFirestoreContext();

  const openPicker = async (selectType: 'video' | 'image') => {
    // display the system UI for choosing a document.
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? 'image/*' : 'video/*',
      copyToCacheDirectory: true,
      multiple: false, // allow only a single file to be selected.
    });

    // check if user has cancelled the picking process.
    if (!result.canceled && result.assets) {
      const { uri, mimeType } = result.assets[0];

      if (selectType === 'image') {
        setForm({ ...form, thumbnail: { uri, mimeType } });
      } else {
        setForm({ ...form, video: { uri, mimeType } });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      handleError(new Error('Missing fields'), { userMessage: 'Please fill in all the fields.' });
      return;
    } else {
      // upload video
      setUploading(true);

      const [videoUrl, thumbnailUrl] = await Promise.all([
        uploadFile(form.video.uri, form.video.mimeType, `videos/${user!.uid}/${Date.now()}`),
        uploadFile(form.thumbnail.uri, form.thumbnail.mimeType, `thumbnails/${user!.uid}/${Date.now()}`),
      ]);

      if (!videoUrl || !thumbnailUrl) {
        handleError(new Error('Upload failed'), { userMessage: 'Failed to upload video or thumbnail.' });
        setUploading(false);
        return;
      }

      await addDocument({
        creator: {
          username: user!.displayName,
          photoURL: user!.photoURL,
        },
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        timestamp: new Date(),
      });

      setForm({
        title: '',
        video: { uri: '', mimeType: '' },
        thumbnail: { uri: '', mimeType: '' },
        prompt: '',
      });

      setUploading(false);

      router.navigate('/home');
    }
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
          <TouchableOpacity onPress={() => openPicker('video')} className='mt-1'>
            <View className='w-full h-16 px-4 bg-black-100 rounded-lg flex-row justify-center items-center gap-x-2'>
              {form.video.uri ? (
                <Text className='text-sm text-red-500 font-psemibold'>File selected</Text>
              ) : (
                <>
                  <Image source={icons.upload} className='w-5 h-5' resizeMode='cover' />
                  <Text className='text-sm text-gray-100 font-psemibold'>Choose a file</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View className='mt-6 space-y-2'>
          <Text className='text-base text-gray-100 font-psemibold'>Thumbnail Image</Text>
          <TouchableOpacity onPress={() => openPicker('image')} className='mt-1'>
            <View className='w-full h-16 px-4 bg-black-100 rounded-lg flex-row justify-center items-center gap-x-2'>
              {form.thumbnail.uri ? (
                <Text className='text-sm text-red-500 font-psemibold'>File selected</Text>
              ) : (
                <>
                  <Image source={icons.upload} className='w-5 h-5' resizeMode='cover' />
                  <Text className='text-sm text-gray-100 font-psemibold'>Choose a file</Text>
                </>
              )}
            </View>
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
