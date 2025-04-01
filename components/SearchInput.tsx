//
// Customizable search bar with text input and search icon.
//

import { useState } from 'react';
import { Image, TextInput, View, TouchableOpacity } from 'react-native';

import { colors } from '../constants';
import { icons } from '../constants';

interface ISearchInput {
  placeholder?: string; // placeholder text for the search field.
  value: string; // current value of the input field.
  handleChangeText: (e: string) => void; // function to handle text input changes.
  otherStyles?: string; // additional styles to apply to the container view.
  [key: string]: any; // index signature ("catch-all" for properties that are not explicitly defined in the interface).
}

const SearchInput = ({ placeholder, value, handleChangeText, otherStyles, ...props }: ISearchInput) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false); // text input is focused.

  return (
    <View
      className={`w-full h-16 px-4 bg-black-100 rounded-lg border-2 mt-1 ${
        isFocused ? 'border-secondary' : 'border-black-200'
      } flex flex-row items-center space-x-4 ${otherStyles}`}>
      <TextInput
        className='flex-1 text-gray-100 font-pregular text-base'
        style={{ includeFontPadding: false }} // remove default font padding for vertical alignment of placeholder text.
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.gray[200]}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)} // Callback that is called when the text input is focused.
        onBlur={() => setIsFocused(false)} // Callback that is called when the text input is blurred.
        {...props}
      />

      <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
        <Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
