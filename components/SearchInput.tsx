//
// Customizable search bar with text input and search icon.
//

import { useState } from 'react';
import { Image, TextInput, View, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';

import { type Video } from '../types/video';
import { colors } from '../constants';
import { icons } from '../constants';

import { useErrorContext } from '../services/error/error.context'; // custom hook for accessing the global error management context.
import { useFirestoreContext } from '../services/db/firestore.context';

interface ISearchInput {
  placeholder?: string; // placeholder text for the search field.
  initialQuery?: string;
  [key: string]: any; // index signature ("catch-all" for properties that are not explicitly defined in the interface).
}

const SearchInput = ({ placeholder, initialQuery, ...props }: ISearchInput) => {
  const pathname = usePathname(); // read the current URL's pathname.

  const [query, setQuery] = useState<string>(initialQuery || '');
  const [isFocused, setIsFocused] = useState<boolean>(false); // text input is focused.

  const { handleError } = useErrorContext(); // obtain the function responsible for updating the global error state.

  const { filterBySubstring } = useFirestoreContext<Video>();

  const handleSearch = () => {
    // check if we have a query to search.
    if (!query?.trim()) {
      handleError(new Error('Missing query'), { userMessage: 'You need to input something to search.' });
      return; // stop the function execution here if there's an error.
    }

    // execute search.
    filterBySubstring('title', query);

    if (pathname.startsWith('/search')) {
      // update the current route's query params.
      router.setParams({ query: query });
    } else {
      // push a new route.
      router.push(`/search/${query}`);
    }
  };

  return (
    <View
      className={`w-full h-16 px-4 bg-black-100 rounded-lg border-2 mt-1 ${
        isFocused ? 'border-secondary' : 'border-black-200'
      } flex flex-row items-center space-x-4`}>
      <TextInput
        className='flex-1 text-gray-100 font-pregular text-base'
        style={{ includeFontPadding: false }} // remove default font padding for vertical alignment of placeholder text.
        value={query}
        placeholder={isFocused ? undefined : placeholder}
        placeholderTextColor={colors.gray[100]}
        onChangeText={(e) => setQuery(e)}
        onFocus={() => setIsFocused(true)} // Callback that is called when the text input is focused.
        onBlur={() => setIsFocused(false)} // Callback that is called when the text input is blurred.
        onSubmitEditing={handleSearch} // trigger when the user presses the keyboard's "return" key (which we've relabeled to "search").
        returnKeyType='search' // change the label on the keyboard's return key from "return" to "search", giving users a clearer visual indicator of what the key will do.
        {...props}
      />

      <TouchableOpacity
        onPress={handleSearch}
        className='p-3' // add padding to increase touch area.
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // increase the touchable area around the icon.
      >
        <Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
