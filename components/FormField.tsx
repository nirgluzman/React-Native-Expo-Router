//
// Reusable form input field with customizable styling and functionality.
// It handles text input, password visibility toggling, and focus state management.
//

import { useState } from 'react';
import { Image, Text, TextInput, View, TouchableOpacity } from 'react-native';

import { icons } from '../constants';

interface IFormField {
  title: string; // title of the form field.
  placeholder?: string; // placeholder text for the input field.
  value: string; // current value of the input field.
  handleChangeText: (e: string) => void; // function to handle text input changes.
  otherStyles?: string; // additional styles to apply to the container view.
  [key: string]: any; // index signature ("catch-all" for properties that are not explicitly defined in the interface).
}

const FormField = ({ title, placeholder, value, handleChangeText, otherStyles, ...props }: IFormField) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false); // text input is focused.

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-psemibold'>{title}</Text>
      <View
        className={`w-full h-16 px-4 bg-black-100 rounded-lg border-2 mt-1 ${
          isFocused ? 'border-secondary' : 'border-black-200'
        } flex flex-row items-center`}>
        <TextInput
          className='flex-1 text-white font-psemibold text-base'
          style={{ includeFontPadding: false }} // remove default font padding for vertical alignment of placeholder text.
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          onFocus={() => setIsFocused(true)} // Callback that is called when the text input is focused.
          onBlur={() => setIsFocused(false)} // Callback that is called when the text input is blurred.
          {...props}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Image source={showPassword ? icons.eyeHide : icons.eye} className='w-6 h-6' resizeMode='contain' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
