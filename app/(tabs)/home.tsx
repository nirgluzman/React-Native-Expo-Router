//
// Home Tab
//
// This component displays a list of videos along with trending videos and a search input.
// It fetches video data from Firestore and provides an interface for browsing and discovering video content.
//
import { useEffect } from 'react';
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { type Video } from '../../types/video';
import { images } from '../../constants';

import { useFirestoreContext } from '../../services/db/firestore.context';

import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';

const Home = () => {
  const insets = useSafeAreaInsets();

  const {
    documents: videoItems,
    trendingDocuments: trendingItems,
    isLoading: isPullToRefreshing,
    refreshCollection: onPullToRefresh,
    getTrendingDocuments: getTrendingItems,
  } = useFirestoreContext<Video>();

  useEffect(() => {
    // fetch the trending videos when the component mounts.
    // NOTE: 'trendingField' and 'count' are hardcoded for development purposes; to be replaced with a dynamic configuration later!
    getTrendingItems('timestamp', 3);
  }, [videoItems]);

  //
  // one FlatList with list header and horizontal FlatList.
  // we cannot do that with just ScrollView as there's both horizontal and vertical scroll (two FlatLists, including Trending).
  //

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
              <Trending trendingVideos={trendingItems} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          // rendered when the list is empty.
          <EmptyState title='No Videos Found' subtitle='Be the first one to upload videos' />
        )}
        refreshControl={
          // pull down to see RefreshControl indicator, https://reactnative.dev/docs/refreshcontrol
          <RefreshControl
            refreshing={isPullToRefreshing} // whether the view should be indicating an active refresh.
            onRefresh={() => onPullToRefresh({})} // called when the view starts refreshing.
          />
        }
      />
    </View>
  );
};
export default Home;
