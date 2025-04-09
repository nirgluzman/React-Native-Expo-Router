//
// Search Screen
//
// This component displays search results based on a query parameter, fetching and rendering filtered video items.
//

import { FlatList, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { type Video } from '../../types/video';
import { useFirestoreContext } from '../../services/db/firestore.context';

import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';

const Search = () => {
  const insets = useSafeAreaInsets();

  const { query } = useLocalSearchParams(); // extract parameters from the URL of the current component's route (local).

  const { filteredDocuments: videoItems } = useFirestoreContext<Video>();

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
      <FlatList
        data={videoItems}
        keyExtractor={(item) => item.id} // unique key for each FlatList item.
        renderItem={({ item }) => <VideoCard videoItem={item} />}
        ListHeaderComponent={() => (
          // rendered at the top of all the items.
          <View className='my-6 px-4'>
            <Text className='font-pmedium text-sm text-gray-100'>Search results</Text>
            <Text className='font-psemibold text-2xl text-white'>{query}</Text>

            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={`${query}`} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          // rendered when the list is empty.
          <EmptyState title='No Videos Found' subtitle='No videos found for this search query' />
        )}
      />
    </View>
  );
};

export default Search;
