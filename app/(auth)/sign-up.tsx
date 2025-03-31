//
// Sign-up screen, providing a form for users to create a new account by entering their username, email, and password.
//

import { useState, useContext } from 'react';
import { Alert, Image, View, ScrollView, Text, TouchableOpacity } from 'react-native';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { AuthContext } from '../../services/auth/auth.context';

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const SignUp = () => {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { onSignUp, isLoading } = useContext(AuthContext);

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    const { success, message } = await onSignUp(form.username, form.email, form.password);

    if (success) {
      router.replace('/home');
    } else {
      Alert.alert('Error', message);
      setForm({ username: '', email: '', password: '' });
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
      <ScrollView>
        <View className='w-full justify-start min-h-[85vh] px-6 my-20'>
          <Image source={images.logo} className='w-[115px] h-[35px]' resizeMode='contain' />
          <Text className='text-2xl text-white font-psemibold mt-10'>Sign up</Text>
          <FormField
            title='Username'
            placeholder='Enter your username'
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles='mt-7'
          />
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
          <CustomButton title='Sign up' containerStyles=' mt-7' handlePress={submit} isLoading={isLoading} />
          <View className='flex flex-row justify-center pt-5 gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Already have an account?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace('/sign-in')}>
              <Text className='text-lg font-psemibold text-secondary'>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
