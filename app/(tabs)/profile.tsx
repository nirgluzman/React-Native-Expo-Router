//
// Profile Tab
//

import { useState, useEffect } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';

import { router } from 'expo-router';

import {
  useSafeAreaInsets, // hook to get the safe area insets of the current device (instead of SafeAreaView).
  // NOTE: Expo Router adds the <SafeAreaProvider> to every route; this setup is not needed (see: https://www.nativewind.dev/tailwind/new-concepts/safe-area-insets).
} from 'react-native-safe-area-context';

import { WhereFilterOp, OrderByDirection } from 'firebase/firestore';

import type { Video, VideoWithId } from '../../types/video';
import { icons } from '../../constants';

import { useAuthContext } from '../../services/auth/auth.context';
import { useFirestoreContext } from '../../services/db/firestore.context';

import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import InfoBox from '../../components/InfoBox';

const Profile = () => {
  const insets = useSafeAreaInsets();

  const [userItems, setUserItems] = useState<VideoWithId[]>([]);

  const { user, onLogout } = useAuthContext();

  const { getFilteredAndOrderedDocuments: onPullToRefresh } = useFirestoreContext<Video>();

  const filter = { field: 'creator.username', operator: '==' as WhereFilterOp, value: user!.displayName };
  const sortBy = { field: 'timestamp', direction: 'desc' as OrderByDirection };
  const queryLimit = 10; // NOTE: 'queryLimit' is hardcoded for development purposes.

  useEffect(() => {
    // fetch the videos for the userId.
    const fetchUserItems = async () => {
      const items = await onPullToRefresh(filter, sortBy, queryLimit);
      setUserItems(items || []);
    };

    fetchUserItems();
  }, []);

  const logout = async () => {
    await onLogout(); // await logout first to update auth state.
    router.replace('/sign-in'); // navigate.
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
      <FlatList
        data={userItems}
        keyExtractor={(item) => item.id} // unique key for each FlatList item.
        renderItem={({ item }) => <VideoCard videoItem={item} />}
        ListHeaderComponent={() => (
          // rendered at the top of all the items.
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity className='w-full items-end mb-10' onPress={logout}>
              <Image source={icons.logout} className='w-6 h-6' resizeMode='contain' />
            </TouchableOpacity>

            <View className='w-16 h-16 justify-center items-center border border-secondary rounded-lg'>
              <Image
                source={{ uri: user!.photoURL ?? undefined }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover'
              />
            </View>

            <InfoBox title={user!.displayName!} subtitle={user!.email!} containerStyles='mt-5' titleStyles='text-lg' />

            <View className='mt-5 flex-row'>
              <InfoBox
                title={userItems.length.toString()}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              <InfoBox title='1.2k' subtitle='Followers' titleStyles='text-xl' />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          // rendered when the list is empty.
          <EmptyState title='No Videos Found' subtitle='No videos found for this profile' />
        )}
      />
    </View>
  );
};

export default Profile;
