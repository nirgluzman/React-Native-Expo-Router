import { useState, useContext, useCallback } from 'react';

import { FlatList, Image, RefreshControl, Text, View } from 'react-native';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { AuthContext } from '../../services/auth/auth.context';

import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';

const Home = () => {
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = useCallback(() => {
    // trigger fetch videos
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const { user } = useContext(AuthContext);

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
        data={[]}
        keyExtractor={(item) => item.id} // unique key for each FlatList item.
        renderItem={({ item }) => <Text className='text-3xl text-white'>{item.id}</Text>}
        ListHeaderComponent={() => (
          // rendered at the top of all the items.
          <View className='my-6 px-4 space-y-6'>
            <View className='flex-row items-start justify-between mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>Welcome Back</Text>
                <Text className='font-psemibold text-2xl text-white'>Nir</Text>
              </View>
              <View className='my-auto'>
                <Image source={images.logoSmall} className='w-9 h-10' resizeMode='contain' />
              </View>
            </View>

            <SearchInput placeholder='Search for a video topic' />

            <View className='flex-1 w-full pt-5 pb-8'>
              <Text className='font-pregular text-lg text-gray-100 mb-3'>Trending Videos</Text>
              <Trending posts={[{ id: 11 }, { id: 22 }, { id: 33 }]} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          // rendered when the list is empty.
          <EmptyState title='No Videos Found' subtitle='Be the first one to upload videos' />
        )}
        refreshControl={
          // Pull down to see RefreshControl indicator, https://reactnative.dev/docs/refreshcontrol
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};
export default Home;
