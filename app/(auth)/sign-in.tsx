//
// Sign-in screen, providing a form for users to enter their credentials.
//

import { useState } from 'react';
import { Image, View, ScrollView, Text, TouchableOpacity } from 'react-native';

import {
  SafeAreaView, // render content within the safe area boundaries of a device.
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = () => {
    console.log('Form Submitted');
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-start min-h-[85vh] px-6 my-20'>
          <Image source={images.logo} className='w-[115px] h-[35px]' resizeMode='contain' />
          <Text className='text-2xl text-white font-psemibold mt-10'>Sign in</Text>
          <FormField
            title='Email'
            placeholder='Enter your email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />
          <FormField
            title='Password'
            placeholder='Enter your password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
            keyboardType='password'
          />
          <CustomButton title='Sign in' containerStyles=' mt-7' handlePress={submit} isLoading={isSubmitting} />
          <View className='flex flex-row justify-center pt-5 gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace('/sign-up')}>
              <Text className='text-lg font-psemibold text-secondary'>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignIn;
